(function () {
    'use strict'

    app.component('dashboard8', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard8/dashboard8.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            // $scope.H = ["1/9/2020", "2/9/2020", "3/9/2020", "4/9/2020", "5/9/2020", "6/9/2020"];
            // $scope.items = [];
            // $scope.items.Checkin = [20, 16, 27, 34, 4,12];
            // $scope.items.CheckOut = [4,6,9,4,1,1];
            // $scope.items.Total = [24, 22, 36, 38, 5,13];

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard8() {
                $scope.H = [];
                $scope.items = [];
                $scope.items.Checkin = [];
                $scope.items.CheckOut = [];
                $scope.items.Total = [];
                viewModel.GetBashboard8(getToday()).then(function (res) {

                    for (let index = 0; index < res.data.length; index++) {
                        $scope.H.push(res.data[index].date);
                        $scope.items.Checkin.push(res.data[index].count_CheckedIn);
                        $scope.items.CheckOut.push(res.data[index].count_CheckedOut);
                        $scope.items.Total.push(res.data[index].count_Total);
                    }
                    var ctxD3 = document.getElementById("id8").getContext('2d');
                    new Chart(ctxD3, {
                        type: 'bar',
                        data: {
                            labels: $scope.H,
                            datasets: [
                                {
                                    label: "Check In",
                                    backgroundColor: "#FF9900",
                                    data: $scope.items.Checkin
                                }, {
                                    label: "Check Out",
                                    backgroundColor: "#FFD700",
                                    data: $scope.items.CheckOut
                                }, {
                                    label: "Total",
                                    backgroundColor: "#32CD32",
                                    data: $scope.items.Total
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
                                display: false,
                                text: 'Check In - Check Out'
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'left'
                            },
                        }
                    });
                });
            };

            var _refresh = setInterval(function () { GetBashboard8(); }, 90000);
   
            var init = function () {
                GetBashboard8();

            }
            init();
        }
    })
})();