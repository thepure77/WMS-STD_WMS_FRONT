
(function () {
    'use strict'
    app.directive('vendorPopupFilter', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/Pallets/onHandSummary/component/vendorPopupFilter.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'onHandSummaryFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, onHandSummaryFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = onHandSummaryFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () { 
                            $scope.onShow = false;
                        };

                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 100,
                            totalRow: 1,
                            key: '',
                            advanceSearch: false
                        };
                      
                        $scope.delegates = function (param) {
                            $scope.items = [];
                            $scope.selectlist = [];
                            //$scope.selectlist_temp =  angular.copy(param);
                            $scope.selectlist =  angular.copy(param);
                            $scope.model.key = '';
                            $scope.onShow = true;
                        }

                        $scope.filter = function (param) {
                            var model = {};
                            model.key = param;
                            pageLoading.show();
                            viewModel.dropdownVendor(model).then(function (res) {                               
                                $scope.items = res.data;
                                $scope.checkSeach();
                                pageLoading.hide();
                            }, function error(res) { });                       
                        };

                        // $scope.datalist = {
                        //     delegates: {},
                        //     config: {
                        //         paginations: {},
                        //         currentPage: $scope.model.currentPage,
                        //         numPerPage: $scope.model.numPerPage,
                        //         totalRow: 0,
                        //     },
                        //     items: {},
                        //     invokes: {
                        //         page: function (param) {
                        //             $scope.filterModel = $scope.filterModel || {};
                        //             $scope.filterModel.currentPage = param.currentPage;
                        //             $scope.filterModel.perPage = param.numPerPage;
                        //         },
                        //         delete: function (param) {
                        //             if ($scope.invokes.delete != undefined)
                        //                 $scope.invokes.delete(param);
                        //         },
                        //         edit: function (param) {
                        //             if ($scope.invokes.edit != undefined)
                        //                 $scope.invokes.edit(param);
                        //         },
                        //         selected: function (param) {
                        //             if ($scope.invokes.selected != undefined)
                        //                 $scope.invokes.selected(param);
                        //             $scope.onShow = false;
                        //         },
                        //         confirm: function (param) {
                        //             let items = param.filter(c => c.selected);
                        //             if ($scope.invokes.selected)
                        //                 $scope.invokes.selected(items);
                        //             $scope.onShow = false;
                        //         }
                        //     }
                        // };

                        $scope.confirm = function () {
                            if ($scope.invokes.selected)
                            {
                                var param_test = angular.copy($scope.selectlist);
                                $scope.invokes.selected(param_test);
                                $scope.onShow = false;
                            }
                        }

                        $scope.checkSelect = function (data,row) {
                            if(!data.selected)
                            {                               
                                angular.forEach($scope.selectlist, function (item, index) {
                                    if(item.index == data.index)
                                    {                                    
                                        $scope.selectlist.splice(index, 1);
                                    }
                                });
                            }
                            else
                            {                                
                                if($scope.selectlist.filter( a => a.index == data.index).length == 0)
                                {
                                    $scope.selectlist.push(data);
                                }
                                else
                                {
                                    data.selected = false;
                                }                               
                            }
                        }

                        $scope.checkSelect_top = function (data,row) {
                            if(!data.selected)
                            {
                                $scope.selectlist.splice(row,1);
                                angular.forEach($scope.items.filter(a => a.index == data.index), function (items, index) {
                                    items.selected = false;
                                });                                
                            }                            
                        }

                        $scope.checkSeach = function(){
                            angular.forEach($scope.selectlist, function (item, index) {
                                angular.forEach($scope.items.filter(a => a.index == item.index), function (items, index) {
                                    items.selected = true;
                                });
                                                                  
                            });
                        }

                        var init = function () {
                        };

                        init();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
