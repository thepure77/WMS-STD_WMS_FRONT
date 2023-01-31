(function() {
    'use strict'
    app.directive('reportPrintTagPopup', function() {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/reportPrintTagPopup/reportPrintTagPopup.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?',
                onShow: '='
            },
            controller: ['$scope', 'commonService', '$filter', 'dpMessageBox', function($scope, commonService, $filter, dpMessageBox) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = $scope.items || [];
                $scope.onShow = false;

                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function(model) {
                        $scope.items.size = "";
                        $scope.items = model;
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
                $scope.Yes = function() {
                    if (!$scope.items.size) {
                        return dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกขนาด'
                        });
                    }
                    $scope.onShow = false;
                    if ($scope.invokes.selected)
                        $scope.invokes.selected($scope.items);
                }
                $scope.onClose = function(param) {
                    $scope.onShow = false;
                };
                var init = function() {
                    $scope.items = {};
                    $scope.items.isRecipent = false;
                    $scope.items.isRecorder = false;
                }

                init();

            }],
            link: function($scope, $element, $attributes) {}
        }
    });
}());