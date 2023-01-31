(function () {
    'use strict'

    app.directive('popupLotNo', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/ModuleOms/widgets/dirPopup/popupLotNo/view.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?',
                },
                controller: ['$scope', '$http', 'ngAuthSettings', '$state', 'authService', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', '$q', 'dpMessageBox',
                    function ($scope, $http, ngAuthSettings, $state, authService, pageLoading, $window, commonService, $timeout, $translate, $q, MessageBox) {


                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.title = $scope.config.title || 'Demo Popup';

                        $scope.onHide = function (param) {


                        };

                        $scope.onClose = function () {
                            $scope.onShow = false;
                        };

                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {

                            }
                        });

                        $scope.delegate = {
                            filter: function (param) {


                            },
                            add: function () {

                            },
                            edit: function (item) {

                            },
                            cancel: function () {

                            }
                        };

                        $scope.items = [{ id: '1', name: 'Lot1' }, { id: '2', name: 'Lot2' }, 
                        { id: '3', name: 'Lot3' }, {id: '4',name: 'Lot4'}, {id: '5',name: 'Lot5'}];


                        $scope.onSelect = function (item) {
                            if ($scope.invokes.selected)
                                $scope.invokes.selected(item);
                            $scope.onShow = false;
                        }


                        var init = function () {

                        }


                        init();
                        $scope.delegates = $scope.delegate;
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) {

                }
            };
        }
    ]);

}());