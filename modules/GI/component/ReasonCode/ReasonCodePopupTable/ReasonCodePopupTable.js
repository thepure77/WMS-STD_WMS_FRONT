
(function () {
    'use strict'
    app.directive('reasonCodePopupTable', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/GI/component/ReasonCode/ReasonCodePopupTable/ReasonCodePopupTable.html",
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

                $scope.checkReason = function (param) {

                    for (let index = 0; index < $scope.items.length; index++) {
                        if(index != param)
                        {
                            $scope.items[index].check = false;
                        }
                        
                    }

                }

                $scope.selected = function (param, model) {


                    const result = param.filter((param) => {
                        return param.check == true
                    })

                    if ($scope.invokes.selected)

                        $scope.invokes.selected(result, model);
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
