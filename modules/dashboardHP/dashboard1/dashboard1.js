(function () {
    'use strict';
    app.component('dashboard1', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard1/dashboard1.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            $scope.H = ["PO", "RECEIVING_D", "PICKING", "SHIPPING"];
            // $scope.items = ["20", "1532", "854", "8"];

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function GetBashboard1() {
                $scope.items = [];
                viewModel.GetBashboard1(getToday()).then(function (res) {
                    $scope.items.push(res.data[0].count_PlanGoodsReceive_No + " " + "PO");
                    $scope.items.push(res.data[0].sum_GR_TotalQty + " " + "EA");
                    $scope.items.push(res.data[0].sum_GI_TotalQty + " " + "EA");
                    $scope.items.push(res.data[0].count_TL_PlanGoodsIssue_No  + " " + "DN");
                });
            };

            var _refresh = setInterval(function () { GetBashboard1(); }, 60000);

            var init = function () {
                GetBashboard1();
            }

            init();
        }
    })
})();