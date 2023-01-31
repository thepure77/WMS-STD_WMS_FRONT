
 (function() {
    'use strict'
    app.directive('shipToPopupTableV2', function() {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/masterData/component/shipToPopupV2/shipToPopupTableV2/shipToPopupTableV2.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?'
            },
            controller: ['$scope', 'commonService', '$filter','dpMessageBox','shipToFactory','soldToShipToFactory','$q', function($scope, commonService, $filter,dpMessageBox,shipToFactory,soldToShipToFactory,$q) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = [];
                $scope.items = $scope.items || [];
                var xObj = commonService.objects;
                var eFindItem = $filter('findItem');
                var viewModel = shipToFactory;
                var viewModelSoldToShipTo = soldToShipToFactory;
                
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
                    set: function(model, soldToIndex) {
                        $scope.items = model;
                        $scope.soldTo_Index = soldToIndex
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
                      
                        Add(select).then(function success(res) {
                            
                            if (res.data == "Done") {
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
                    $scope.dataItem.soldTo_Index = $scope.soldTo_Index;
                    $scope.dataItem.listSoldToShipToViewModel = select;
                    var deferred = $q.defer();
                    viewModelSoldToShipTo.SaveSoldToShipToList($scope.dataItem).then(
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
