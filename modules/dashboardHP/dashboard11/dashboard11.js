(function () {
    'use strict'

    app.component('dashboard11', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard11/dashboard11.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard11() {
                $scope.items = [];
                viewModel.GetBashboard11(getToday()).then(function (res) {
                    $scope.items = res.data;
                });
            };

            var _refresh = setInterval(function () { GetBashboard11(); }, 110000);


            var init = function () {
                GetBashboard11();
            }

            init();
        }
    })
})();