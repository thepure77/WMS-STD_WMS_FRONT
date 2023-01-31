(function () {
    'use strict'

    app.component('dashboard10', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard10/dashboard10.html";
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

            function GetBashboard10() {
                $scope.items = [];
                viewModel.GetBashboard10(getToday()).then(function (res) {
                    $scope.items = res.data;
                });
            };

            var _refresh = setInterval(function () { GetBashboard10(); }, 105000);

            var init = function () {
                GetBashboard10();
            }

            init();
        }
    })
})();