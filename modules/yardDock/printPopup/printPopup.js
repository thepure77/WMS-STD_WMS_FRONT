
(function () {
    'use strict'
    app.directive('printPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/printPopup/printPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'webServiceAPI',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, webServiceAPI) {

                        $scope.delegates = $scope.delegates || {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;


                        $scope.onHide = function () {
                        };

                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $window.localStorage.setItem("displayHead", "");
                            $window.localStorage.setItem("marginHead", "");
                            $window.localStorage.setItem("marginmenu", "120px");
                        };

                        $scope.bkItem = {}


                        $scope.delegate = {
                            set: function (param) {
                                $scope.ownerItems = {}
                                $scope.bkItem = param;
                            }
                        }
                        $scope.delegates = $scope.delegate;

                        function formatDate(date) {

                            var d = new Date(date),
                                month = '' + (d.getMonth() + 1),
                                day = '' + d.getDate(),
                                year = d.getFullYear();
            
                            if (month.length < 2)
                                month = '0' + month;
                            if (day.length < 2)
                                day = '0' + day;
            
                            return [year, month, day].join('');
                        }
                        function convertDate(param) {
                            var year = param.substring(0, 4);
                            var month = param.substring(4, 6);
                            var day = param.substring(6, 8);
                            month = parseInt(month) - 1;
                            var a = new Date(year, month, day);
                            return a;
                        }
                        
                        $scope.add = function () {
                            var items = $scope.bkItem;
                            if (items.ref_Document_Date != null) {
                                var de = convertDate(items.ref_Document_Date);
                                $scope.bkItem.ref_Document_Date = de;
                            }
                            $scope.bkItem = {};
                            if ($scope.invokes.add) {

                                if (items.dropdownGeneration != undefined) {
                                    items.generation_Name = items.dropdownGeneration.generation_Name;
                                }
                                if ($scope.dropdownTypeCar.model != undefined) {
                                    items.vehicleType_Name = $scope.dropdownTypeCar.model.vehicleType_Name;
                                    items.vehicleType_Index = $scope.dropdownTypeCar.model.vehicleType_Index;
                                    items.vehicleType_Id = $scope.dropdownTypeCar.model.vehicleType_Id;
                                }
                                
                                $scope.dropdownTypeCar = []

                                $scope.invokes.add(items);
                            }

                        }
                        $scope.url = {
                            // Master: webServiceAPI.Master,
                            PlanGI: webServiceAPI.PlanGI,
                        };

                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            viewModel.filter(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.autoComplete = {
                            owner: "AutoPlanGoodIssue/AutoOwnerfilter",
                        };

                        $scope.filterProductType = function (code) {
                            $scope.criteria = {};
                            viewModel.service.searchProductType($scope.criteria).then(function (res) {
                                $scope.itemsProductType = res.data;
                                $scope.itemsProductType.forEach(c => {
                                    c.name = c.text
                                });
                                $scope.loading.item = false;
                            }, function error(res) {
                                $scope.response = "M_ERROR";
                                if (res.Message.data != null) {
                                    $scope.message = res.Message.data.Message;
                                }
                                else {
                                    $scope.message = "Data not found";
                                }
                            })

                        }
                        $scope.filterUnit = function (code) {
                            $scope.criteria = {};
                            viewModel.service.searchProductConversion($scope.criteria).then(function (res) {
                                $scope.itemsUnit = res.data;
                                $scope.itemsUnit.forEach(c => {
                                    c.name = c.text
                                });
                                $scope.loading.item = false;
                            }, function error(res) {
                                $scope.response = "M_ERROR";
                                if (res.Message.data != null) {
                                    $scope.message = res.Message.data.Message;
                                }
                                else {
                                    $scope.message = "Data not found";
                                }
                            })
                        }

                        $scope.selectOwner = function (param) {
                            if (param.owner_Name != undefined) {
                                $scope.bkItem.owner_Id = param.owner_Id;
                                $scope.bkItem.owner_Index = param.owner_Index;
                                $scope.bkItem.owner_Name = param.owner_Name;
                            }
                        }
                        
                        function initial() {
                            // dropdownGeneration();
                            // $scope.filterProductType();
                            // $scope.filterUnit();
                        }

                        initial();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }]);
}());