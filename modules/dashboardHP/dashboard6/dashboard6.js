(function () {
    'use strict'

    app.component('dashboard6', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard6/dashboard6.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            $scope.H = ["On Time", "Late Time", "Canceled"];
            $scope.items = ["64", "25", "11"];

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard6() {
                $scope.items = [];
                viewModel.GetBashboard6(getToday()).then(function (res) {
                    if (res.data.length > 0) {
                        // $scope.items.push((Math.round(res.data[0].percents_CheckIn_Ontime * 100) / 100).toFixed(2));
                        // $scope.items.push((Math.round(res.data[0].percents_CheckIn_NotOntime * 100) / 100).toFixed(2));
                        // $scope.items.push((Math.round(res.data[0].percents_Cancel * 100) / 100).toFixed(2));
                        $scope.items.push(res.data[0].checkIn_Ontime);
                        // $scope.items.push(res.data[0].checkIn_Beforetime);
                        $scope.items.push(res.data[0].checkIn_NotOntime);
                        $scope.items.push(res.data[0].cancel);
                    }
                    else {
                        $scope.items.push(0);
                        $scope.items.push(0);
                        $scope.items.push(0);
                    }

                    var ctxD3 = document.getElementById("id6").getContext('2d');
                    var myLineChart = new Chart(ctxD3, {
                        type: 'doughnut',
                        data: {
                            // labels: $scope.H,
                            datasets: [{
                                // labels: { fontColor: 'black' },
                                backgroundColor: ["#33FF00", "#00FFFF", "#FF3333"],
                                data: $scope.items
                            }],
                            labels: [
                                $scope.H[0] + " " + (res.data.length > 0 ? (res.data[0].percents_CheckIn_Ontime * 100 / 100).toFixed(2) + "%" : " 0%"),
                                // $scope.H[1] + " " +(Math.round(res.data[0].percents_CheckIn_Beforetime * 100) / 100).toFixed(2) + "%",
                                $scope.H[1] + " " + (res.data.length > 0 ? (res.data[0].percents_CheckIn_NotOntime * 100 / 100).toFixed(2) + "%" : " 0%"),
                                $scope.H[2] + " " + (res.data.length > 0 ? (res.data[0].percents_Cancel * 100 / 100).toFixed(2) + "%" : " 0%"),
                              ]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Appointment',
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
                                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                                start_angle = model.startAngle,
                                                end_angle = model.endAngle,
                                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                                            var x = mid_radius * Math.cos(mid_angle);
                                            var y = mid_radius * Math.sin(mid_angle);

                                            // ctx.fillStyle = '#fff';
                                            // if (i == 3) { // Darker text color for lighter background
                                                ctx.fillStyle = '#444';
                                            // }
                                            
                                            // var percent = Math.round(dataset.data[i] / total * 100).toFixed(2) + "%";
                                            // var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                                            var percent = total == 0 ? "0%" : (dataset.data[i] / total * 100).toFixed(2) + "%";
                                            // var percent = dataset.data[i] + "%";
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

            var _refresh = setInterval(function () { GetBashboard6(); }, 80000);

            var init = function () {
                GetBashboard6();

            }

            init();
        }
    })
})();