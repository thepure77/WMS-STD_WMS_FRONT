
 (function() {
    'use strict'
    app.directive('ownerPopupTableV2', function() {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/masterData/component/ownerPopupV2/ownerPopupTableV2/ownerPopupTableV2.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?'
            },
            controller: ['$scope', 'commonService', '$filter','dpMessageBox','localStorageService','pageLoading','ownerFactory','productOwnerFactory','$q', function($scope, commonService, $filter,dpMessageBox,localStorageService,pageLoading,ownerFactory,productOwnerFactory,$q) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = [];
                $scope.items = $scope.items || [];
                var xObj = commonService.objects;
                var eFindItem = $filter('findItem');
                var viewModel = ownerFactory;
                var viewModelProductOwner = productOwnerFactory;
                
                $scope.model = {
                    currentPage: $scope.config.currentPage + 1,
                    numPerPage: $scope.config.numPerPage,
                    totalRow: 0
                };
                $scope.show = {
                    action: true,
                    pagination: true,
                    checkBox: false
                }
                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function(model, productIndex, dataProduct) {
                        $scope.items = model;
                        $scope.product_Index = productIndex
                        $scope.productModel = dataProduct
                    },
                    filter: function(model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function(index) {},
                    selected: function(index) {},
                    edit: function(index) {},
                    add: function(model) {
                        var a = eFindItem({ items: $scope.items, filed: 'id', value: model.id });
                        if (!xObj.IsArray($scope.items)) {
                            $scope.items = [];
                        }
                        if (a == null)
                            $scope.items.push(model);
                    }
                };
                $scope.delegates = $scope.delegate;
                $scope.selected = function(param) {
                    if ($scope.invokes.selected)
                        $scope.invokes.selected(param);
                }

                $scope.add = function () {
                    var select = $scope.items.filter(c => c.selected);
                    
                    if (select.length == 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Please select the item !!'
                            }
                        )
                        return "";
                    }


                    else if($scope.invokes.selected) {
                      dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function () {
                        pageLoading.show();
                        Add(select).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == "Done") {
                                debugger
                                $scope.filterModel = {};
                                $scope.invokes.selected(select);
                            }
                        }, function error(param) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'error',
                                    message: 'Save error'
                                }
                            )
                        });
                    });  
                    }
                }

                function Add(select) {
                    $scope.dataItem = {};
                    $scope.dataItem.product_Index = $scope.productModel.product_Index;
                    $scope.dataItem.product_Id = $scope.productModel.product_Id;
                    $scope.dataItem.product_Name = $scope.productModel.product_Name;
                    $scope.dataItem.create_By = $scope.userName;
                    $scope.dataItem.listProductOwnerViewModel = select;
                    var deferred = $q.defer();
                    viewModelProductOwner.SaveProductOwnerList($scope.dataItem).then(
                        function success(results) {
                            deferred.resolve(results);
                        },
                        function error(response) {
                            deferred.resolve(response);
                        }
                    );
                    return deferred.promise;
                }


                var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');

                    if ($scope.config.pageMode == "Search") {
                        $scope.pageMode = "Search";
                    }
                }
                $scope.changeTableSize = function() {
                    if ($scope.invokes.page) {
                        var p = {
                            currentPage: $scope.pagging.num,
                            numPerPage: $scope.model.numPerPage
                        };
                        $scope.invokes.page(p);
                    }
                }
                $scope.pagging = {
                    num: 1,
                    totalRow: 0,
                    currentPage: 1,
                    maxSize: 10,
                    perPage: $scope.config.numPerPage,
                    change: function() {
                        if ($scope.invokes.page) {
                            var p = {
                                currentPage: $scope.pagging.currentPage - 1,
                                numPerPage: $scope.pagging.perPage
                            };
                            var all = {
                                currentPage: 0,
                                numPerPage: 0
                            };
                            $scope.invokes.page(p);
                        }
                    }
                };
                $scope.pageOption = [
                    { 'value': 10 },
                    { 'value': 30 },
                    { 'value': 50 },
                    { 'value': 100 },
                    { 'value': 500 },
                ];
                init();
              
            }],
            link: function($scope, $element, $attributes) {}
        }
    });
}());
