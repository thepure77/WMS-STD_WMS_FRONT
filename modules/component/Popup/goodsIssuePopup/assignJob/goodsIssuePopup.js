
(function () {
    'use strict'
app.directive('goodsIssuePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        templateUrl: "modules/component/Popup/goodsIssuePopup/assignJob/goodsIssuePopup.html",
        scope: {
            onShow: '=',
            delegates: '=?',
            invokes: '=?',
            config: '=?'
        },
        controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'goodsIssuePopupFactory','webServiceAPI',
            function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, goodsIssuePopupFactory,webServiceAPI) {
                $scope.delegates = {};
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                var viewModel = goodsIssuePopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
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
                            totalRow: 1,
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
                        $scope.delegates.goodsIssuePopup = function (param, showchkbox) {
                            $scope.dataset = angular.copy(param);
                            $scope.showchkbox = showchkbox;
                            $scope.find();

                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            var id = model.Chk;
                            
                            viewModel.search(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();
                            model.Chk = $scope.index;
                            $scope.gi = model;

                            viewModel.search(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function () {
                            $scope.gi = $scope.gi || {};
                            $scope.searchFilter($scope.gi).then(function success(res) {

                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsgi;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsgi, res.data.pagination);
                            }, function error(res) { });
                            // $scope.gi = {};

                        }
                        $scope.filter = function () {
                            $scope.gi = $scope.gi || {};
                            $scope.gi.Chk = $scope.index;
                            $scope.search($scope.gi).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;                      
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsgi, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function (data) {
                            
                            $scope.gi = $scope.gi || {};
                            $scope.gi.Chk = $scope.index;
                            $scope.gi.planGoodsReceive_No = data;
                            $scope.gi.DocumentType_Index = $scope.documentTypeIndex;
                            $scope.gi.currentPage = 1;
                            $scope.gi.perPage = $scope.model.numPerPage;
                            $scope.gi.owner_Index = $scope.ownerIndex;

                            $scope.search($scope.gi).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;                      
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data);
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
                                    $scope.gi = $scope.gi || {};
                                    $scope.gi.currentPage = param.currentPage;
                                    $scope.gi.perPage = param.numPerPage;
                                    $scope.searchFilter($scope.gi).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data);
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

                        $scope.autoComplete = {
                            GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                        };
            
                        $scope.url = {
                            GI: webServiceAPI.GI,
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
