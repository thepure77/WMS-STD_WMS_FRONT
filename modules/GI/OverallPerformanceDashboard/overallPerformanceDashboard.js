(function () {
    'use strict'

    app.component('overallPerformanceDashboard', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/OverallPerformanceDashboard/overallPerformanceDashboard.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, overallFactory) {

            var service = overallFactory;

            $scope.model = {};

            $scope.search = function () {
                pageLoading.show();

                $scope.Total_Order = 0;
                $scope.New_Order = 0;
                $scope.Preparing = 0;
                $scope.PickingMarshal = 0;
                $scope.POS = 0;
                $scope.Customer_Service = 0;
                $scope.Done = 0;
                $scope.Canceled = 0;
                $scope.Ex_Total_Order = 0;
                $scope.Ex_Done = 0;
                $scope.Ex_Canceled = 0;


                $scope.OrderByRoute_route = [];
                $scope.OrderByRoute_order = [];
                $scope.PickingByRound_round = [];
                $scope.PickingByRound_pickQty = [];
                $scope.PickingByZone_zone = [];
                $scope.PickingByZone_pickQty = [];


                service.overallPerformanceSearch($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $scope.model = res.data;

                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Total_Order').forEach(function (item, key) {
                        $scope.Total_Order = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'New_Order').forEach(function (item, key) {
                        $scope.New_Order = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Preparing').forEach(function (item, key) {
                        $scope.Preparing = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Picking-Marshal').forEach(function (item, key) {
                        $scope.PickingMarshal = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'POS').forEach(function (item, key) {
                        $scope.POS = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Customer_Service').forEach(function (item, key) {
                        $scope.Customer_Service = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Done').forEach(function (item, key) {
                        $scope.Done = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Canceled').forEach(function (item, key) {
                        $scope.Canceled = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Ex_Total_Order').forEach(function (item, key) {
                        $scope.Ex_Total_Order = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Ex_Done').forEach(function (item, key) {
                        $scope.Ex_Done = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Ex_Canceled').forEach(function (item, key) {
                        $scope.Ex_Canceled = item.qty;
                    });

                    $scope.model.orderByRouteViewModel.forEach(function(item, key) {
                        $scope.OrderByRoute_route.push(item.route);
                        $scope.OrderByRoute_order.push(item.order);
                    });

                    $scope.model.pickingByRoundViewModel.forEach(function(item, key) {
                        $scope.PickingByRound_round.push(item.round);
                        $scope.PickingByRound_pickQty.push(parseFloat(item.pickQty).toFixed(2));
                    });

                    $scope.model.pickingByZoneViewModel.forEach(function(item, key) {
                        $scope.PickingByZone_zone.push(item.zone);
                        $scope.PickingByZone_pickQty.push(parseFloat(item.pickQty).toFixed(2));
                    });

                    //Pie Chart
                    var ctxD = document.getElementById("orderByRoundChart").getContext('2d');
                    var myLineChart = new Chart(ctxD, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.OrderByRoute_route,
                            datasets: [{
                                data: $scope.OrderByRoute_order,
                                backgroundColor: ["#FF6666", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360","#66CC33"],
                                hoverBackgroundColor: ["#FF3366", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774","#669933"]
                            }],
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Order Performance By Route',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },
                            showAllTooltips: false,
                        }, 
                    });

                    var ctxD2 = document.getElementById("pickingByRoundChart").getContext('2d');
                    var myLineChart2 = new Chart(ctxD2, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.PickingByRound_round,
                            datasets: [{
                                data: $scope.PickingByRound_pickQty,
                                backgroundColor: ["#FF6666", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360","#66CC33"],
                                hoverBackgroundColor: ["#FF3366", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774","#669933"]
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Order Performance By Round',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },
                            showAllTooltips: false,
                        }
                    });

                    var ctxD3 = document.getElementById("pickingByZoneChart").getContext('2d');
                    var myLineChart3 = new Chart(ctxD3, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.PickingByZone_zone,
                            datasets: [{
                                data: $scope.PickingByZone_pickQty,
                                backgroundColor: ["#46BFBD", "#FDB45C", "#949FB1", "#4D5360","#66CC33"],
                                hoverBackgroundColor: ["#5AD3D1", "#FFC870", "#A8B3C5", "#616774","#669933"]
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Picking Performance By Zone',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },
                            showAllTooltips: false,
                        }
                    });
                    //End Pie Chart

                    // pageLoading.hide();
                }).catch(function () {
                    // pageLoading.hide();

                    dpMessageBox.alert({
                        ok: 'OK',
                        titile: 'Error',
                        message: "Page load failed."
                    });
                });
            }

            $scope.TotalOrderByRound_Order = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.order);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalOrderByRound_Done = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.done);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalOrderByRound_Canceled = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.canceled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalOrderByRound_Remain = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.remain);
                    });
                }
                return total.toFixed(2);
            }

            $scope.TotalPickingByRound_PickQty = function () {
                var total = 0.00;

                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.pickQty);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByRound_Fulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.fulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByRound_UnFulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.unFulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByRound_Remain = function () {
                var total = 0.00;
                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.remain);
                    });
                }
                return total.toFixed(2);
            }

            $scope.TotalPickingByZone_PickQty = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.pickQty);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByZone_Fulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.fulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByZone_UnFulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.unFulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByZone_Remain = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.remain);
                    });
                }
                return total.toFixed(2);
            }

            $scope.$watch('filterModel.OverallDate', function (value) {
                $scope.search();
            });

            //Chart function
            Chart.pluginService.register({
                beforeRender: function (chart) {
                    if (chart.config.options.showAllTooltips) {
                        // create an array of tooltips
                        // we can't use the chart tooltip because there is only one tooltip per chart
                        chart.pluginTooltips = [];
                        chart.config.data.datasets.forEach(function (dataset, i) {
                            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                                chart.pluginTooltips.push(new Chart.Tooltip({
                                    _chart: chart.chart,
                                    _chartInstance: chart,
                                    _data: chart.data,
                                    _options: chart.options.tooltips,
                                    _active: [sector]
                                }, chart));
                            });
                        });

                        // turn off normal tooltips
                        chart.options.tooltips.enabled = false;
                    }
                },
                afterDraw: function (chart, easing) {
                    if (chart.config.options.showAllTooltips) {
                        // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                        if (!chart.allTooltipsOnce) {
                            if (easing !== 1)
                                return;
                            chart.allTooltipsOnce = true;
                        }

                        // turn on tooltips
                        chart.options.tooltips.enabled = true;
                        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                            tooltip.initialize();
                            tooltip.update();
                            // we don't actually need this since we are not animating tooltips
                            tooltip.pivot();
                            tooltip.transition(easing).draw();
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }
            });
            //

            function init() {
                $scope.filterModel = {
                    OverallDate: $filter('date')(new Date(), 'yyyyMMdd')
                };
            }
            init();


            function tastdata (){
                return {
                    "overallDate": "20200226",
                    "overallStatusViewModel": [
                      {
                        "statusName": "Canceled",
                        "qty": 12
                      },
                      {
                        "statusName": "Done",
                        "qty": 435
                      },
                      {
                        "statusName": "New_Order",
                        "qty": 1
                      },
                      {
                        "statusName": "Picking-Marshal",
                        "qty": 68
                      },
                      {
                        "statusName": "POS",
                        "qty": 135
                      },
                      {
                        "statusName": "Preparing",
                        "qty": 9
                      },
                      {
                        "statusName": "Total_Order",
                        "qty": 664
                      },
                      {
                        "statusName": "Ex_Canceled",
                        "qty": 5
                      },
                      {
                        "statusName": "Ex_Done",
                        "qty": 49
                      },
                      {
                        "statusName": "Ex_Picking-Marshal",
                        "qty": 6
                      },
                      {
                        "statusName": "Ex_POS",
                        "qty": 19
                      },
                      {
                        "statusName": "Ex_Preparing",
                        "qty": 4
                      },
                      {
                        "statusName": "Ex_Total_Order",
                        "qty": 91
                      }
                    ],
                    "orderByRoundViewModel": [
                      {
                        "round": "รอบที่ 0",
                        "order": 43,
                        "done": 42,
                        "canceled": 1,
                        "remain": 0
                      },
                      {
                        "round": "รอบที่ 1",
                        "order": 130,
                        "done": 126,
                        "canceled": 4,
                        "remain": 0
                      },
                      {
                        "round": "รอบที่ 2",
                        "order": 114,
                        "done": 112,
                        "canceled": 1,
                        "remain": 1
                      },
                      {
                        "round": "รอบที่ 3",
                        "order": 113,
                        "done": 108,
                        "canceled": 5,
                        "remain": 0
                      },
                      {
                        "round": "รอบที่ 4",
                        "order": 112,
                        "done": 88,
                        "canceled": 2,
                        "remain": 22
                      },
                      {
                        "round": "รอบที่ 5",
                        "order": 118,
                        "done": 6,
                        "canceled": 2,
                        "remain": 110
                      },
                      {
                        "round": "รอบที่ 6",
                        "order": 109,
                        "done": 1,
                        "canceled": 1,
                        "remain": 107
                      },
                      {
                        "round": "รอบที่ 7",
                        "order": 5,
                        "done": 0,
                        "canceled": 0,
                        "remain": 5
                      },
                      {
                        "round": "รอบที่ 8",
                        "order": 3,
                        "done": 0,
                        "canceled": 0,
                        "remain": 3
                      },
                      {
                        "round": "รอบที่ 9",
                        "order": 6,
                        "done": 1,
                        "canceled": 0,
                        "remain": 5
                      },
                      {
                        "round": "รอบที่ 10",
                        "order": 1,
                        "done": 0,
                        "canceled": 0,
                        "remain": 1
                      },
                      {
                        "round": "รอบที่ 11",
                        "order": 1,
                        "done": 0,
                        "canceled": 0,
                        "remain": 1
                      },
                      {
                        "round": "รอบที่ 12",
                        "order": 0,
                        "done": 0,
                        "canceled": 0,
                        "remain": 0
                      },
                      {
                        "round": "ไม่ระบุ",
                        "order": 0,
                        "done": 0,
                        "canceled": 0,
                        "remain": 0
                      }
                    ],
                    "pickingByRoundViewModel": [
                      {
                        "round": "รอบที่ 0",
                        "pickQty": "1721.000000",
                        "fulfilled": "1677.236000",
                        "unFulfilled": "34.000000",
                        "remain": "9.764000"
                      },
                      {
                        "round": "รอบที่ 1",
                        "pickQty": "6121.192000",
                        "fulfilled": "5899.802000",
                        "unFulfilled": "163.000000",
                        "remain": "58.390000"
                      },
                      {
                        "round": "รอบที่ 2",
                        "pickQty": "5601.000000",
                        "fulfilled": "5160.700000",
                        "unFulfilled": "77.000000",
                        "remain": "363.300000"
                      },
                      {
                        "round": "รอบที่ 3",
                        "pickQty": "5234.000000",
                        "fulfilled": "5028.888000",
                        "unFulfilled": "177.000000",
                        "remain": "28.112000"
                      },
                      {
                        "round": "รอบที่ 4",
                        "pickQty": "4765.000000",
                        "fulfilled": "3670.360000",
                        "unFulfilled": "51.000000",
                        "remain": "1043.640000"
                      },
                      {
                        "round": "รอบที่ 5",
                        "pickQty": "4675.000000",
                        "fulfilled": "317.210000",
                        "unFulfilled": "46.000000",
                        "remain": "4311.790000"
                      },
                      {
                        "round": "รอบที่ 6",
                        "pickQty": "4569.000000",
                        "fulfilled": "24.000000",
                        "unFulfilled": "78.000000",
                        "remain": "4467.000000"
                      },
                      {
                        "round": "รอบที่ 7",
                        "pickQty": "239.000000",
                        "fulfilled": "0.000000",
                        "unFulfilled": "0.000000",
                        "remain": "239.000000"
                      },
                      {
                        "round": "รอบที่ 8",
                        "pickQty": "56.000000",
                        "fulfilled": "0.000000",
                        "unFulfilled": "0.000000",
                        "remain": "56.000000"
                      },
                      {
                        "round": "รอบที่ 9",
                        "pickQty": "88.000000",
                        "fulfilled": "18.000000",
                        "unFulfilled": "0.000000",
                        "remain": "70.000000"
                      },
                      {
                        "round": "รอบที่ 10",
                        "pickQty": "24.000000",
                        "fulfilled": "0.000000",
                        "unFulfilled": "0.000000",
                        "remain": "24.000000"
                      },
                      {
                        "round": "รอบที่ 11",
                        "pickQty": "25.000000",
                        "fulfilled": "0.000000",
                        "unFulfilled": "0.000000",
                        "remain": "25.000000"
                      },
                      {
                        "round": "รอบที่ 12",
                        "pickQty": "0",
                        "fulfilled": "0",
                        "unFulfilled": "0",
                        "remain": "0"
                      },
                      {
                        "round": "ไม่ระบุ",
                        "pickQty": "0",
                        "fulfilled": "0",
                        "unFulfilled": "0",
                        "remain": "0"
                      }
                    ],
                    "pickingByZoneViewModel": [
                      {
                        "zone": "Ambient",
                        "pickQty": "11369.000000",
                        "fulfilled": "6867.000000",
                        "unFulfilled": "200.000000",
                        "remain": "4302.000000"
                      },
                      {
                        "zone": "Bulky",
                        "pickQty": "19951.000000",
                        "fulfilled": "14016.000000",
                        "unFulfilled": "413.000000",
                        "remain": "5522.000000"
                      },
                      {
                        "zone": "Chill",
                        "pickQty": "1798.192000",
                        "fulfilled": "913.196000",
                        "unFulfilled": "13.000000",
                        "remain": "871.996000"
                      },
                      {
                        "zone": "Frozen",
                        "pickQty": "0",
                        "fulfilled": "0",
                        "unFulfilled": "0",
                        "remain": "0"
                      }
                    ],
                    "orderByRouteViewModel": [
                      {
                        "route": "สายเกษตร",
                        "order": 113
                      },
                      {
                        "route": "สายดินแดง",
                        "order": 89
                      },
                      {
                        "route": "สายพระประแดง",
                        "order": 18
                      },
                      {
                        "route": "สายสุขุมวิท (พระราม 3)",
                        "order": 161
                      },
                      {
                        "route": "สายพระรามสอง",
                        "order": 65
                      },
                      {
                        "route": "สายบางรัก",
                        "order": 75
                      },
                      {
                        "route": "สายพระนคร",
                        "order": 73
                      },
                      {
                        "route": "สายสาทร",
                        "order": 123
                      },
                      {
                        "route": "สายอื่นๆ",
                        "order": 0
                      },
                      {
                        "route": "ไม่ระบุ",
                        "order": 0
                      }
                    ]
                  }
            }


        }
    })
})();