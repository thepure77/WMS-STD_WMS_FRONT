
(function () {
    'use strict'
    app.directive('pickTicketPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/component/pickTicketPopup/pickTicketPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'pickTicketFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, pickTicketFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = pickTicketFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.ref_Document_No = "";
                            param.tagOutPick_No = "";
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
                        $scope.delegates.pickTicketPopup = function (pickTicket) {
                            // $scope.dataset = angular.copy(param);
                            $scope.pickTicket = angular.copy(pickTicket);
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                              var deferred = $q.defer();                            
                                
                                viewModel.FilterPick(model).then(
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
                            viewModel.filterSearch(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function (data){                            
                            $scope.pickTicket = $scope.pickTicket || {};
                            $scope.pickTicket.ref_Document_No = data;
                            $scope.search($scope.pickTicket).then(function success(res) {
                                
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsTag;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsTag,res.data.pagination);
                            }, function error(res) { });
                        }

                        $scope.filter = function () {
                            $scope.pickTicket = $scope.pickTicket || {};
                            $scope.pickTicket.advanceSearch = true;
                            $scope.pickTicket.currentPage = 0;
                            $scope.pickTicket.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.pickTicket).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.pickTicket = $scope.pickTicket || {};
                            // $scope.pickTicket.key = $scope.model.key;
                            // $scope.pickTicket.advanceSearch = false;
                            // $scope.pickTicket.currentPage = 0;
                            // $scope.pickTicket.GoodsReceiveIndex = $scope.pickTicket;
                            $scope.pickTicket.currentPage = 1;                           
                            $scope.pickTicket.perPage = $scope.model.numPerPage;                            
                            $scope.search($scope.pickTicket).then(function success(res) {
                                
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsTag;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsTag,res.data.pagination);
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
                                    $scope.pickTicket = $scope.pickTicket || {};
                                    $scope.pickTicket.currentPage = param.currentPage;
                                    $scope.pickTicket.perPage = param.numPerPage;
                                    $scope.search($scope.pickTicket).then(function success(res) {                                                                         
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsTag, res.data.pagination,$scope.showchkbox);
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
