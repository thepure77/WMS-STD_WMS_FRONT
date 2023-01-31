
(function () {
    'use strict'
    app.directive('manyToOnePopupForm', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/LPNmanyToOnePopup/component/view.html",
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
                    set: function (model, paginations) {
                        $scope.items = model;
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

                $scope.detectCheckAll = function () {
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

                $scope.selected = function (model) {
                    let ischeckalert = true;
                    model.forEach(element => {
                        if (!(!isNaN(parseFloat(element.remainingQty)) && angular.isNumber(parseFloat(element.remainingQty)))) {
                            ischeckalert = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Please insert number qty !'
                                }
                            )
                        }
                        if (parseFloat(element.remainingQty) <= 0) {
                            ischeckalert = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Please insert number more than 0 !'
                                }
                            )
                        }

                        if (parseFloat(element.remainingQty) > parseFloat(element.remainQty)) {
                            ischeckalert = false;
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'QTY Assigned Is More Than The Remaining !'
                                }
                            )
                            return "";
                        }
                    });
                    if (ischeckalert) {
                        if ($scope.invokes.selected)
                            $scope.invokes.selected(model);
                    }

                }

                $scope.alert = function () {

                    alert("chkAlert");
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
