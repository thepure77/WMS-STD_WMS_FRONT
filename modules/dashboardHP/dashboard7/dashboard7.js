(function () {
    'use strict'

    app.component('dashboard7', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard7/dashboard7.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            // $scope.H = ["1-7/6/2020", "8-14/6/2020", "15-21/6/2020","22-28/6/2020", "29-31/6/2020"];
            // $scope.items = [];
            // $scope.items.outbound = [23, 5, 9, 4, 5];
            // $scope.items.inbound = [20, 15, 6, 8, 11];
            
            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard7() {
                $scope.H = [];
                $scope.items = [];
                $scope.items.outbound = [];
                $scope.items.inbound = [];
                viewModel.GetBashboard7(getToday()).then(function (res) {
                    for (let index = 0; index < res.data.length; index++) {
                        $scope.H.push(res.data[index].minDate.substring(0,2)+"-"+res.data[index].maxDate);
                        $scope.items.inbound.push(res.data[index].count_GoodsReceive_NO);
                        $scope.items.outbound.push(res.data[index].count_GoodsIssue_No);
                    }

                    var ctxD3 = document.getElementById("id7").getContext('2d');
                    new Chart(ctxD3, {
                        type: 'line',
                        data: {
                            labels: $scope.H,
                            datasets: [{
                                    data: $scope.items.outbound,
                                    label: "outbound",
                                    borderColor: "#FF9900",
                                    fill: false
                                }, {
                                    data: $scope.items.inbound,
                                    label: "inbound",
                                    borderColor: "#6600FF",
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        userCallback: function(label, index, labels) {
                                            // when the floored value is the same as the value we have a whole number
                                            if (Math.floor(label) === label) {
                                                return label;
                                            }
                       
                                        },
                                    }
                                }],
                            },
                            title: {
                                display: true,
                                text: 'Volume In-Out'
                            }
                        }
                    });
                });
            };

            // var _refresh = setInterval(function () { GetBashboard7(); }, 85000);

            var init = function () {
                GetBashboard7();
         
            }
            init();
        }
    })
})();