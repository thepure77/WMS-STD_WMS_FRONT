(function () {
    'use strict'

    app.component('dashboard3', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard3/dashboard3.html";
        },
        controller: function ($scope, $interval, dashboardHPFactory) {
            var $vm = this;
            var viewModel = dashboardHPFactory;

            // $scope.H = ["VD", "RECEIVING", "PICKING", "SHIPPING"];
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

            function GetBashboard3() {
                $scope.H = [];
                $scope.items = [];
                viewModel.GetBashboard3(getToday()).then(function (res) {
                    for (let index = 0; index < res.data.length; index++) {
                        $scope.H.push((index+1).toString() + ". " + res.data[index].owner_Id + " " + res.data[index].owner_Name);
                        $scope.items.push(res.data[index].count_Location + " Loc ," + (Math.round(res.data[index].percents * 100) / 100).toFixed(2)  + "%");
                    }
                });
            };

            var _refresh = setInterval(function () { GetBashboard3(); }, 70000);


            var init = function () {
                GetBashboard3();
            }

            init();
        }
    })
})();