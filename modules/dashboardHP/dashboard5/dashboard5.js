(function () {
    'use strict'

    app.component('dashboard5', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard5/dashboard5.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            // $scope.H = ["User", "Reserve", "Block", "Empty"];
            $scope.H = ["Empty", "Use", "Reserve", "Block"];
            $scope.total = 0;
            // $scope.items = ["36", "14", "6", "44"];

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard5() {
                $scope.items = [];
                viewModel.GetBashboard5(getToday()).then(function (res) {

                    $scope.items.push(res.data[0].location_Empty);
                    $scope.items.push(res.data[0].location_USE);
                    $scope.items.push(res.data[0].location_RESV);
                    $scope.items.push(res.data[0].location_BLOCK);
                    $scope.total = res.data[0].location_Total;
                    $scope.sumqty = $scope.items[0] + $scope.items[1] + $scope.items[2] + $scope.items[3];

                    var ctxD3 = document.getElementById("id1").getContext('2d');
                    var myLineChart = new Chart(ctxD3, {
                        type: 'pie',
                        data: {
                            // labels: $scope.H,
                            labels: [
                                $scope.H[0] + " " + ($scope.items[0] / $scope.sumqty * 100).toFixed(2) + "%",
                                $scope.H[1] + " " +($scope.items[1] / $scope.sumqty * 100).toFixed(2) + "%",
                                $scope.H[2] + " " +($scope.items[2] / $scope.sumqty * 100).toFixed(2) + "%",
                                $scope.H[3] + " " +($scope.items[3] / $scope.sumqty * 100).toFixed(2) + "%",
                              ],
                            datasets: [{
                                labels: { fontColor: 'black' },
                                borderColor:'rgba(0, 0, 0, 0.1)',
                                // backgroundColor: ["#32CD32", "#1E90FF", "#FF0000", "#FFFF00"],
                                backgroundColor: ["#FFFF00", "#32CD32", "#1E90FF", "#FF0000"],
                                data: $scope.items
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Space Utillization',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },

                            animation: {
                                // duration: 500,
                                // easing: "easeOutQuart",
                                onComplete: function () {
                                    var ctx = this.chart.ctx;
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';

                                    this.data.datasets.forEach(function (dataset) {
                                        for (var i = 0; i < dataset.data.length; i++) {
                                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) - 20,
                                                start_angle = model.startAngle,
                                                end_angle = model.endAngle,
                                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                                            var x = mid_radius * Math.cos(mid_angle);
                                            var y = mid_radius * Math.sin(mid_angle);

                                            // ctx.fillStyle = '#fff';
                                            // if (i == 3) { // Darker text color for lighter background
                                                ctx.fillStyle = '#444';
                                            // }
                                            var percent = (dataset.data[i] / total * 100).toFixed(2) + "%";
                                            // ctx.fillText($scope.H[i], model.x + x, model.y + y);
                                            // Display percent in another line, line break doesn't work for fillText
                                            ctx.fillText(percent, model.x + x, model.y + y + 15);
                                        }
                                    });
                                }
                            }
                        }
                    });
                });
            };


            var _refresh = setInterval(function () { GetBashboard5(); }, 75000);

            var init = function () {
                GetBashboard5();

            }

            init();
        }
    })
})();