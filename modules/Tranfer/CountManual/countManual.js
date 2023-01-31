(function () {
    'use strict'

    app.component('countManual', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/CountManual/countManual.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, countManualFactory) {
            var $vm = this;

            $scope.isFilter = true;
            var viewModel = countManualFactory;

            $scope.filterModel = {
                currentPage: 0,
                PerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                chkinitpage: false,
                maxSize: 10,
                num: 1,
            };

            $scope.filterModel = {};


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            }

            $scope.scanLoc = function (param) {
                document.getElementById("Lpn").disabled = true;
                $scope.filterModel = param;
                var deferred = $q.defer();
                viewModel.scanLoc($scope.filterModel).then(
                    function success(res) {
                        $scope.listModel = res.data;
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.scanLpn = function (param) {
                document.getElementById("location").disabled = true;
                $scope.filterModel = param;
                var deferred = $q.defer();
                viewModel.scanLpn($scope.filterModel).then(
                    function success(res) {
                        $scope.listModel = res.data;
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.add = function () {

                var model = {};
                $scope.Cymodel = {};
                $scope.Cymodel.warehouse_Index = $scope.listModel[0].warehouse_Index;
                $scope.Cymodel.warehouse_Id = $scope.listModel[0].warehouse_Id;
                $scope.Cymodel.warehouse_Name = $scope.listModel[0].warehouse_Name;
                // $scope.Cymodel.listCycleCountItem = [];
                $scope.Cymodel.listCycleCountItem = {};
                // $scope.Cymodel.listCycleCountItem = $scope.listModel;
                $scope.Cymodel.listCycleCountItem[0].location_Index = $scope.listModel[0].location_Index;
                $scope.Cymodel.listCycleCountItem[0].location_Id = $scope.listModel[0].location_Id;
                $scope.Cymodel.listCycleCountItem[0].location_Name = $scope.listModel[0].location_Name;
                $scope.Cymodel.listCycleCountItem[0].zone_Index = $scope.listModel[0].zone_Index;
                $scope.Cymodel.listCycleCountItem[0].zone_Id = $scope.listModel[0].zone_Id;
                $scope.Cymodel.listCycleCountItem[0].zone_Name = $scope.listModel[0].zone_Name;
                model.listCycleCount = model.listCycleCount || []
                model.listCycleCount.push(angular.copy($scope.Cymodel));

                model.create_By = $scope.userName;
                viewModel.SaveCycleCount(model).then(function (res) {

                    if (res.data.message == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: res.data.document_No
                            }
                        )

                        $scope.filterModel = {};
                        $scope.listModel = [];
                        document.getElementById("location").disabled = false;
                        document.getElementById("Lpn").disabled = false;

                    }
                    else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: 'Save Error'
                            }
                        )
                    }
                }, function error(model) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Save Error'
                        }
                    )
                });
            }

            $scope.$watch("filterModel.location_Name", function () {
                if ($scope.filterModel.location_Name == "" ) {
                    document.getElementById("Lpn").disabled = false;
                }
            });

            
            $scope.$watch("filterModel.tag_No", function () {
                if ($scope.filterModel.tag_No == "" ) {
                    document.getElementById("location").disabled = false;
                }
            });

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();