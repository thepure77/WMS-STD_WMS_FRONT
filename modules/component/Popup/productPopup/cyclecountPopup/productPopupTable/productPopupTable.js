
(function () {
    'use strict'
    app.directive('productPopTableCy', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/productPopup/cyclecountPopup/productPopupTable/productPopupTable.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?'
            },
            controller: ['$scope', 'commonService', '$filter', function ($scope, commonService, $filter) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = [];
                $scope.items = $scope.items || [];
                var xObj = commonService.objects;
                var eFindItem = $filter('findItem');
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
                    set: function (model, paginations) {
                        // $scope.items = model;            

                        if (model.length != 0) {

                            if (model.pagination != null) {
                                $scope.pagging.totalRow = model.pagination.totalRow;
                            }

                            else if (model[0] != undefined) {
                                //$scope.pagging.totalRow = model[0].count;
                                $scope.pagging.totalRow = model.length;
                            }
                            else if (model.itemsProduct.length != 0) {
                                if ($scope.pagging.totalRow == 0) {
                                    $scope.pagging.totalRow = model.itemsProduct.length;
                                }

                            }

                            if (model.itemsProduct == undefined) {
                                $scope.items = model;
                            }
                            else {
                                $scope.items = model.itemsProduct;
                            }

                            $scope.product = {};
                        }
                        else {

                            $scope.items = model;
                            $scope.pagging.totalRow = model.paginations.totalRow;
                        }
                    },
                    filter: function (model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function (index) { },
                    selected: function (index) { },
                    edit: function (index) { },
                    add: function (model) {
                        var a = eFindItem({ items: $scope.items, filed: 'id', value: model.id });
                        if (!xObj.IsArray($scope.items)) {
                            $scope.items = [];
                        }
                        if (a == null)
                            $scope.items.push(model);
                    }
                };
                $scope.delegates = $scope.delegate;
                $scope.selected = function (param) {
                    if ($scope.invokes.selected)
                        $scope.invokes.selected(param);
                }
                var init = function () {
                    if ($scope.config.pageMode == "Search") {
                        $scope.pageMode = "Search";
                    }
                    $scope.selectedTable = 1;
                }
                // $scope.changeTableSize = function () {
                //     let ChangeTable = 1;
                //     if ($scope.invokes.page) {
                //         if ($scope.model.numPerPage == undefined) {
                //             $scope.model.numPerPage = $scope.pagging.perPage;
                //         }
                //         var p = {
                //             currentPage: ChangeTable,
                //             numPerPage: $scope.pagging.perPage
                //         };
                //         $scope.invokes.page(p);
                //     }
                // }


                $scope.changeTableSize = function (perPage, tab) {
                    if (tab == 1) {
                        $scope.colortab1 = "#ec7229";
                        $scope.colortab2 = "#FFFFFF";

                        $scope.fronttab1 = "#FFFFFF";
                       $scope.fronttab2 = "#ec7229";

                    }
                    else if (tab == 2) {
                        $scope.colortab1 = "#FFFFFF";
                        $scope.colortab2 = "#ec7229";

                       $scope.fronttab1 = "#ec7229";
                        $scope.fronttab2 = "#FFFFFF";
                    }

                    $scope.selectedTable = tab;
                    let ChangeTable = 1;

                    if ($scope.invokes.page) {
                        if ($scope.model.numPerPage == undefined) {
                            $scope.model.numPerPage = $scope.pagging.perPage;
                        }
                        var p = {
                            currentPage: ChangeTable,
                            numPerPage: perPage
                        };
                        $scope.invokes.page(p);
                        // $scope.model = $vm.filterModel;
                        // if (perPage != null || perPage != undefined) {
                        //     $scope.model.perPage = perPage;
                        // }

                        // var p = $scope.model;
                        // $scope.invokes.page(p);
                    }
                };

                $scope.pagging = {
                    num: 1,
                    maxSize: 4,
                    perPage: $scope.config.numPerPage,
                    change: function () {
                        if ($scope.invokes.page) {
                            var p = {
                                currentPage: $scope.pagging.currentPage - 1,
                                numPerPage: $scope.pagging.perPage
                            };
                            var all = {
                                currentPage: 0,
                                numPerPage: 0
                            };
                            if ($scope.pagging.currentPage != 0) {
                                p.currentPage = p.currentPage + 1
                            }
                            $scope.invokes.page(p);
                        }
                    }
                };



                $scope.pageOption = [
                    { 'value': 30 },
                    { 'value': 50 },
                    { 'value': 100 },

                ];


                $scope.select = function () {
                    var select = $scope.items.filter(c => c.selected);

                    if (select.length == 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'โปรดเลือกรายการ!!'
                            }
                        )
                        return "";
                    }
                    else {
                        if ($scope.invokes.selected)
                            $scope.invokes.selected(select);
                    }
                }

                $scope.chkAll = function () {
                    $scope.checkAll = !$scope.checkAll;
                    if ($scope.checkAll === true) {
                        angular.forEach($scope.items, function (v, k) {
                            $scope.items[k].selected = true;
                        });
                    } else {
                        angular.forEach($scope.items, function (v, k) {
                            $scope.items[k].selected = false;
                        });
                    }
                }

                init();

            }],
            link: function ($scope, $attributes) { }
        }
    });
}());
