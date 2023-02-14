(function () {
    'use strict'

    app.component('grGiStat', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs) {
            return "modules/dashboard/gr-gi-stat/gr-gi-stat.html";
        },
        controller: function ($scope, $interval, dashboardFactory) {
            var $vm = this;
            let newItem = []
            var factory = dashboardFactory;
            $vm.timmer = null;
            var timeInterval = 5 * 60 * 1000;

            $vm.getData = function (start, end) {
                factory.GRGIStat(start, end).then(function (res) {
                    if (res && res.data && res.data.status == 'SUCCESS') {
                        var list = res.data.items;
                        // $scope.labels = res.data.labels;

                        // สร้างดาต้าไว้ก่อน ถ้ามีดาต้าจะเอาตัวที่ถูกส่งมาจาก API 
                        // if(res.data.series.length > 1){
                        //     $scope.series = res.data.series;                            
                        // }
                        // else{
                        //     $scope.series = res.data.labels;
                        // }
                        let count = 0;
                        for (var i = 0; i < list.length; i++) {         
                            var newarr = {}
                            // newarr.data1 = list[i].data;
                            if(list[i].label == 'Receipt'){
                                newarr.data1 = list[i].data;
                            }
                            else if (list[i].label == 'Putaway'){
                                newarr.data2 = list[i].data;
                            }
                            else if (list[i].label == 'Picking'){
                                newarr.data3 = list[i].data;
                            }
                            else if (list[i].label == 'Issue'){
                                newarr.data4 = list[i].data;
                            }
                            count++
                            newarr.label = list[i].label;
                            newItem.push(newarr)
                        }
                        let items = newItem;
                        Morris.Bar({
                            resize: true,
                            element: 'morrisStacked1',
                            data: items,
                            xkey: 'label',
                            ykeys: ['data1', 'data2', 'data3', 'data4'],
                            labels: ['Receipt', 'Putaway', 'Picking', 'Issue'],
                            barColors: ['#CCCCCC', '#FFC400', '#991B1E', '#555555'],
                            fillOpacity: 0,
                            smooth: false,
                            stacked: true,
                            hideHover: true,
                        });
                    }
                });
            };

            $scope.labels = [];
            $scope.series = [];
            $scope.data = [];

            $scope.options = {
                legend: {
                    position: 'bottom',
                    align: 'center',
                    display: true
                },
                title: {
                    display: true,
                    text: 'GR GI Stat'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            };

            $scope.datasetOverride = [{
                fill: true,
                backgroundColor: [
                    "#CCC",
                    "#FFC400",
                    "#990000",
                    "#555555"
                ]
            }
            ];

            this.$onInit = function () {
                $vm.getData('21513', '65461');

                $vm.timmer = $interval(function () {
                    $vm.getData('21513', '65461');
                }, timeInterval);
            };

            $scope.$on('$destroy', function () {
            });
        }
    })
})();