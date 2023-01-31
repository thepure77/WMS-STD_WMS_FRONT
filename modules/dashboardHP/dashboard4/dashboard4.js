(function () {
    'use strict'

    app.component('dashboard4', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/dashboardHP/dashboard4/dashboard4.html";
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

            function GetBashboard4() {
                $scope.H = [];
                $scope.items = [];
                viewModel.GetBashboard4(getToday()).then(function (res) {
                    $scope.data.items = angular.copy(res.data);
                    let datashow = paginate(res.data, $scope.data.perPage, $scope.data.currentPage);
                    for (let index = 0; index < 5; index++) {
                        $scope.H.push((index+(($scope.data.currentPage - 1) * $scope.data.perPage)+1).toString() + ". " + datashow[index].owner_Id  + " " + datashow[index].owner_Name);
                        $scope.items.push(datashow[index].appointment_Date);
                    }
                });
            };

            $scope.changePage = function(){
                $scope.H = [];
                $scope.items = [];
                let datashow = paginate($scope.data.items, $scope.data.perPage, $scope.data.currentPage);
                for (let index = 0; index < 5; index++) {
                    $scope.H.push((index+(($scope.data.currentPage - 1) * $scope.data.perPage)+1).toString() + ". " + datashow[index].owner_Id  + " " + datashow[index].owner_Name);
                    $scope.items.push(datashow[index].appointment_Date);
                }
            }
    
            function paginate(array, page_size, page_number) {
                // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
                $scope.data.totalRow = array.length;
               
                return array.slice((page_number - 1) * page_size, page_number * page_size);
              }

            var _refresh = setInterval(function () { GetBashboard4(); }, 75000);

            var init = function () {
                $scope.data = {
                    currentPage: 1,
                    perPage: 5,
                    totalRow: 0,
                  };
                GetBashboard4();
            }

            init();
        }
    })
})();