
(function () {
    'use strict'
    app.directive('unpackPopupOfU', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/UnpackPopupOfU/UnpackPopupTable/UnpackPopupTable.html",
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
                
                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function (model) {
                        $scope.items = model;
                    },
                    filter: function (model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function (index) { },
                    selected: function (index) {
                        $scope.invokes.confirm($scope.items);
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
                $scope.selected = function (param) {
                    if ($scope.invokes.selected)
                        $scope.invokes.selected(param);
                }
                var init = function () {
                    if ($scope.config.pageMode == "Search") {
                        $scope.pageMode = "Search";
                    }
                }
             
            

                init();

            }],
            link: function ($scope, $element, $attributes) { }
        }
    });
}());
