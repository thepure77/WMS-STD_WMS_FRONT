(function () {
    'use strict'

    app.component('dashboard9', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard9/dashboard9.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            // $scope.items = [{inbound:20,outbound:68}];

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard9() {
                $scope.items = [];
                viewModel.GetBashboard9(getToday()).then(function (res) {
                    $scope.items.inbound = res.data[0].inbound;
                    $scope.items.outbound = res.data[0].outbound;
              
                });
            };

            var _refresh = setInterval(function () { GetBashboard9(); }, 95000);


            var init = function () {
                GetBashboard9();
            }

            init();
        }
    })
})();