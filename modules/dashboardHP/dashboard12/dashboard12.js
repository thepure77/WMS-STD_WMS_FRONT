(function () {
    'use strict'

    app.component('dashboard12', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard12/dashboard12.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            $scope.H = ["VD_ON_TIME", "LATE_TIME", "CANCELED"];
            // $scope.H = ["VD_ON_TIME", "LATE_TIME", "CANCELED", "ACCURACY", "DAMAGE"];
            // $scope.items = ["xx.xx%", "xx.xx%", "xx.xx%", "xx.xx%", "xx.xx%"];

            $scope.color = function (p) {
                if (p == "VD_ON_TIME") {
                    return "#33FF00";
                // } else if (p == "BEFORE_TIME") {
                //     return "#ADD8E6";
                } else if (p == "LATE_TIME") {
                    return "#00FFFF";
                } else if (p == "CANCELED") {
                    return "#FF3333";
                // } else if (p == "ACCURACY") {
                //     return "#32CD32";
                // } else if (p == "DAMAGE") {
                //     return "#FFD700";
                } else {
                    return "#FFFFFF";
                }
            }


            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard12() {
                $scope.items = [];
                viewModel.GetBashboard12(getToday()).then(function (res) {
                    $scope.items.push(res.data[0].percents_CheckIn_Ontime.toFixed(2) + "%");
                    // $scope.items.push(res.data[0].percents_CheckIn_Beforetime.toFixed(2) + "%");
                    $scope.items.push(res.data[0].percents_CheckIn_NotOntime.toFixed(2) + "%");
                    $scope.items.push(res.data[0].percents_Cancel.toFixed(2) + "%");
                    $scope.items.push(res.data[0].percents_Product_Goods.toFixed(2) + "%");
                    $scope.items.push(res.data[0].percents_Product_Damage.toFixed(2) + "%");
                });
            };

            var _refresh = setInterval(function () { GetBashboard12(); }, 115000);

            var init = function () {
                GetBashboard12();
            }

            init();
        }
    })
})();