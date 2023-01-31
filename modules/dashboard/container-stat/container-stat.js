(function () {
    'use strict'

    app.component('containerStat', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/dashboard/container-stat/container-stat.html";
        },
        controller: function ($scope, $interval, dashboardFactory) {
            var $vm = this;
            var factory = dashboardFactory;
            $vm.startDate = null;
            $vm.endDate = null;
            $vm.timmer = null;
            var timeInterval = 5 * 60 * 1000;
            $vm.timeTrigger = function () {
                getItem($vm.startDate, $vm.endDate);
            };

            function getItem(start, end) {
                factory.ContainerStat(start, end).then(function (res) {

                    if (res && res.data && res.data.status == 'SUCCESS') {
                        // $scope.labels = res.data.labels;
                        // $scope.series = res.data.series;
                        // $scope.data = res.data.data;
                        let items = res.data.items;
                        $("#morrisArea").empty();
                        if (items != undefined) {
                            Morris.Area({
                                resize: true,
                                element: 'morrisArea',
                                data: items,
                                xkey: 'date',
                                ykeys: ['data'],
                                labels: ['Space Not Used'],
                                lineColors: ['#991B1E'],
                                fillOpacity: 0,
                            });
                        }
                    }
                });
            }


            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

            $scope.convertDate = function (param) {

                if (param != undefined) {
                    var item = param.split(" - ");
                    var d1 = item[0].split("/");
                    var d2 = item[1].split("/");

                    var dStart = '' + d1[2] + d1[1] + d1[0];
                    var dEnd = '' + d2[2] + d2[1] + d2[0];

                    getItem(dStart, dEnd);

                    $interval.cancel($vm.timmer);

                    $vm.startDate = dStart;
                    $vm.endDate = dEnd;
                    $vm.timmer = $interval(function () {
                        $vm.timeTrigger();
                    }, timeInterval);
                }
            }

            function init() {
                var d = new Date();
                var year = d.getFullYear();
                var month = ((d.getMonth() + 1) / 10 < 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '';
                var date = (d.getDate() / 10 < 1 ? '0' + d.getDate() : d.getDate()) + '';

                var initDate = date + '/' + month + '/' + year;
                var getDate = '' + year + month + date;

                $scope.startDate = initDate;
                $scope.endDate = initDate;
                $('.daterange').daterangepicker({
                    opens: 'left',
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (start, end, label) {
                    $scope.startDate = start.format('DD/MM/YYYY');
                    $scope.endDate = end.format('DD/MM/YYYY');

                    $vm.startDate = start.format('YYYYMMDD');
                    $vm.endDate = end.format('YYYYMMDD');

                    if($vm.timmer){
                        $interval.cancel($vm.timmer);
                    }

                    $vm.timmer = $interval(function () {
                        $vm.timeTrigger();
                    }, timeInterval);
                });

                getItem(getDate, getDate);

                $vm.startDate = getDate;
                $vm.endDate = getDate;
                $vm.timmer = $interval(function () {
                    $vm.timeTrigger();
                }, timeInterval);
            }

            this.$onInit = function () {
                init();
            };

            $scope.$on('$destroy', function () {
            });
        }
    })
})();