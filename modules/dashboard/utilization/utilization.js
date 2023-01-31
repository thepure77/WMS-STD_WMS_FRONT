(function () {
    'use strict'

    app.component('utilization', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/dashboard/utilization/utilization.html";
        },
        controller: function ($scope, $interval, dashboardFactory) {
            var $vm = this;
            let newItem = [];
            var factory = dashboardFactory;

            $vm.timmer = null;
            var timeInterval = 5 * 60 * 1000;

            $vm.getData = function () {
                factory.Utilization().then(function (res) {
                    let data1 = '';
                    let data2 = '';
                    let total1 = '';
                    let total2 = '';
                    if (res && res.data && res.data.status == 'SUCCESS') {
                        var items = res.data.items;
                        let count = 0;
                        angular.forEach(items, function (value, key) {
                            count++
                            if (value.label == 'Space Used') {
                                data1 = value.data;
                            }
                            else if (value.label == 'Space Not Used') {
                                data2 = value.data;
                            }
                        });

                        total1 = (data1 / data2) * 100;
                        total2 = ((data2 - data1) / data2) * 100;
                        for (var i = 0; i < items.length; i++) {
                            var newarr = {}
                            if (items[i].label == 'Space Used') {
                                newarr.data = total1.toFixed(2);

                            }
                            else if (items[i].label == 'Space Not Used') {
                                newarr.data = total2.toFixed(2);
                            }
                            newarr.label = items[i].label;
                            // newarr.data = items[i].data;
                            newItem.push(newarr)
                        }
                        // $scope.labels = res.data.labels;
                        // $scope.data = res.data.data;                       
                        // if(items.data.length > 0 && items.labels.length > 0){
                        //     for (var i = 0; i < items.length; i++) {
                        //         var newarr = {}
                        //         newarr.labels = items[i].labels;
                        //         newarr.data = items[i].data;
                        //         newItem.push(newarr)
                        //     }
                        // }                       
                        if (newItem.length > 0) {
                            var options = {
                                series: {
                                    pie: {
                                        show: true,
                                        innerRadius: 0.5,
                                        radius: 1
                                    }
                                },
                                grid: {
                                    hoverable: true
                                },
                                tooltip: true,
                                tooltipOpts: {
                                    cssClass: "flotTip",
                                    content: "%s: %p.1%",
                                    defaultTheme: false
                                }
                            };
                            $.plot($("#pie-placeholder1"), newItem, options);
                        }
                    }
                });
            };
            $scope.labels = [];
            $scope.data = [];

            $scope.options = {
                responsive: true,
                legend: {
                    position: 'right',
                    align: 'center',
                    display: true
                },
                title: {
                    display: true,
                    text: 'Utilization'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            };
            
            $scope.chartColors = ["#FFC400", "#CCCCCC"];

            this.$onInit = function () {
                $vm.getData();

                $vm.timmer = $interval(function () {
                    $vm.getData();
                }, timeInterval);
            };

            $scope.$on('$destroy', function () {
            });
        }
    })
})();