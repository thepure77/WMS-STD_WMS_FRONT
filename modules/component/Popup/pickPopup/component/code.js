
(function () {
    'use strict'
    app.directive('transferPickPopupForm', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/pickPopup/component/view.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?'
            },
            controller: ['$scope', 'commonService', '$filter', 'dpMessageBox', function ($scope, commonService, $filter, dpMessageBox) {
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
                    set: function (model, dropdownProductconversion) {
                        debugger
                        $scope.dropdownProductconversion = dropdownProductconversion;
                        model.unit = $scope.dropdownProductconversion.find(f => f.productConversion_Name.toUpperCase() == model.sale_unit)
                        $scope.model = model;
                        $scope.model.sale_qty = $scope.model.qty / $scope.model.unit.productconversion_Ratio;
                        $scope.model.sale_qty = ($scope.model.qty / $scope.model.unit.productconversion_Ratio).toFixed(0);
                    },
                    filter: function (model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function (index) { },
                    selected: function (index) {

                    },
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

                $scope.selected = function (model) {
                    if (!model.unit) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณาเลือกหน่วย'
                            }
                        )
                    }
                    else {
                        if ($scope.invokes.selected)
                            $scope.invokes.selected(model);
                    }
                }

                $scope.detectcheck = function (item) {
                    if (item == 1) {
                        $scope.disable1 = false;
                        $scope.disable2 = true;
                    }
                    if (item == 2) {

                        $scope.disable1 = true;
                        $scope.disable2 = false;

                    }
                    if ($scope.filterModel.IsAccept != true && $scope.filterModel.IsDissmiss != true) {
                        {
                            $scope.disable1 = false;
                            $scope.disable2 = false;
                        }
                    }
                }

                var init = function () {
                    if ($scope.config.pageMode == "Search") {
                        $scope.pageMode = "Search";
                    }
                }
                $scope.changeTableSize = function () {
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
            link: function ($scope, $element, $attributes) { }
        }
    });
}());
