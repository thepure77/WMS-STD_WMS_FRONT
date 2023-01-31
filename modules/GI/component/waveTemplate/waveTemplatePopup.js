
(function () {
    'use strict'
    app.directive('waveTemplatePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/component/waveTemplate/waveTemplatePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'waveTemplateFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, waveTemplateFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = waveTemplateFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.waveIndex = "";
                            param.waveId = "";
                            param.waveName = "";
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 30,
                            totalRow: 0,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }
                        $scope.delegates.waveTemplatePopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findwaveTemplate();
                        }

                        $scope.findwaveTemplate = function (model) {
                            $scope.waveTemplate = $scope.waveTemplate || {};
                            $scope.waveTemplate.advanceSearch = true;
                            $scope.waveTemplate.currentPage = 1;
                            $scope.waveTemplate.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.waveTemplate).then(function success(res) {
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemswaveTemplate != undefined && res.data.itemswaveTemplate.length != 0 ){
                                        $scope.datalist.delegates.set(res.data.itemswaveTemplate, res.data.pagination);
                                    } 
                                    else {
                                        $scope.datalist.delegates.set(res.data);
                                    }
                                    
                                }
                                    
                            }, function error(res) { });
                        }


                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            
                            var deferred = $q.defer();
                            if (model.provinceIndex != "" && model.provinceIndex != null && model.waveTemplateName == null) {
                                viewModel.getId(model.provinceIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.waveTemplateName != null) {
                                    $scope.waveTemplate = {};
                                }
                                viewModel.filter(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            };
                            return deferred.promise;
                        }
                        $scope.filter = function () {
                            $scope.waveTemplate = $scope.waveTemplate || {};
                            $scope.waveTemplate.advanceSearch = true;
                            $scope.waveTemplate.currentPage = 1;
                            $scope.waveTemplate.numPerPage = $scope.model.numPerPage;
                            $scope.waveTemplate.waveTemplateName = $scope.waveTemplate.waveTemplateName;
                            $scope.search($scope.waveTemplate).then(function success(res) {
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemswaveTemplate, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.waveTemplate = $scope.waveTemplate || {};
                            $scope.waveTemplate.key = $scope.model.key;
                            $scope.waveTemplate.advanceSearch = false;
                            $scope.waveTemplate.currentPage = 1;
                            $scope.waveTemplate.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.waveTemplate).then(function success(res) {
                                if (res.data.length != 0) {
                                    $scope.datalist.items = res.data;
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data);
                                }
                            }, function error(res) { });
                        };
                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    $scope.waveTemplate = $scope.waveTemplate || {};
                                    $scope.waveTemplate.currentPage = param.currentPage;
                                    $scope.waveTemplate.numPerPage = param.numPerPage;
                                    viewModel.getwaveTemplate($scope.waveTemplate).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemswaveTemplate, res.data.pagination);
                                    }, function error(res) { });
                                },
                                delete: function (param) {
                                    if ($scope.invokes.delete != undefined)
                                        $scope.invokes.delete(param);
                                },
                                edit: function (param) {
                                    if ($scope.invokes.edit != undefined)
                                        $scope.invokes.edit(param);
                                },
                                selected: function (param) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param);
                                    $scope.onShow = false;
                                }
                            }
                        };
                        var init = function () {

                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
