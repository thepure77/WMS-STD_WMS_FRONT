
(function () {
    'use strict'
    app.directive('masterRequirePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/component/masterRequire/masterRequirePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        // var viewModel = masterRequireFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                            $scope.invokes.close($scope.masterRequire);
                        };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.invokes.close($scope.masterRequire);
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            masterRequireId: ''
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
                        $scope.delegates.masterRequirePopup = function (param, index, masterRequire) {
                            
                            $scope.masterRequire = $scope.masterRequire || {};
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.productyear = masterRequire.productyear;
                            $scope.productmonth = masterRequire.productmonth;
                            $scope.productday = masterRequire.productday;
                            $scope.isExpDate = masterRequire.isExpDate;
                            $scope.isMfgDate = masterRequire.isMfgDate;
                            $scope.isLot = masterRequire.isLot;
                            $scope.documentTypeIndex = masterRequire.documentTypeIndex;
                            $scope.isCatchWeight = masterRequire.isCatchWeight;          
                                              
                            if (masterRequire.isExpDate == 0) {
                                $scope.masterRequire.ExpDate = "";                                
                            }
                            else
                            {
                                
                                if(masterRequire.documentTypeIndex.toUpperCase() == '9AC3C7F0-EB96-4E4E-AD6C-CA796CD03A54')
                                {
                                    
                                    $scope.masterRequire.ExpDate = getExpDate();
                                }
                                else
                                {
                                    $scope.masterRequire.ExpDate = "";    
                                }
                                // $scope.masterRequire.ExpDate = getExpDate();
                            }
                            if(masterRequire.isMfgDate == 0)
                            {
                                $scope.masterRequire.MfgDate = "";                               
                            }
                            else
                            {
                                $scope.masterRequire.MfgDate = "";    
                                // $scope.masterRequire.MfgDate = getExpDate();
                            }
                            // $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        // $scope.search = function (model) {
                        //     var deferred = $q.defer();
                        //     viewModel.filter(model).then(
                        //         function success(res) {
                        //             deferred.resolve(res);
                        //         },
                        //         function error(response) {
                        //             deferred.reject(response);
                        //         });
                        //     return deferred.promise;
                        // }

                        // $scope.searchFilter = function (model) {
                        //     var deferred = $q.defer();
                        //     viewModel.search(model).then(
                        //         function success(res) {
                        //             deferred.resolve(res);
                        //         },
                        //         function error(response) {
                        //             deferred.reject(response);
                        //         });
                        //     return deferred.promise;
                        // }

                        // $scope.filterSearch = function (){

                        //     $scope.masterRequire = $scope.masterRequire || {};
                        //     $scope.searchFilter($scope.masterRequire).then(function success(res) {
                        //         $scope.datalist.config.paginations = res.data.pagination;
                        //         $scope.datalist.items = res.data;
                        //         if ($scope.datalist.delegates.set)
                        //         $scope.datalist.delegates.set(res.data);
                        //     }, function error(res) { });
                        // }

                        // $scope.filter = function () {                            
                        //     $scope.masterRequire = $scope.masterRequire || {};
                        //     $scope.masterRequire.currentPage = 0;
                        //     $scope.masterRequire.numPerPage = $scope.model.numPerPage;
                        //     $scope.search($scope.masterRequire).then(function success(res) {
                        //         $scope.datalist.config.paginations = res.data.pagination;
                        //         $scope.datalist.items = res.data;
                        //         if ($scope.datalist.delegates.set)
                        //         $scope.datalist.delegates.set(res.data);
                        //     }, function error(res) { });
                        // }
                        // $scope.find = function () {
                        //     $scope.masterRequire = $scope.masterRequire || {};
                        //     $scope.masterRequire.key = $scope.model.key;
                        //     $scope.masterRequire.advanceSearch = false;
                        //     $scope.masterRequire.currentPage = 0;
                        //     $scope.masterRequire.numPerPage = $scope.model.numPerPage;
                        //     $scope.search($scope.masterRequire).then(function success(res) {
                        //         $scope.datalist.items = res.data;
                        //         if ($scope.datalist.delegates.set)
                        //             $scope.datalist.delegates.set(res.data);
                        //     }, function error(res) { });
                        // };
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
                                    
                                    $scope.masterRequire = $scope.masterRequire || {};
                                    $scope.masterRequire.currentPage = param.currentPage;
                                    $scope.masterRequire.numPerPage = param.numPerPage;
                                    $scope.search($scope.masterRequire).then(function success(res) {
                                        
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.pagination);
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
                                    $scope.masterRequire = {};
                                    $scope.onShow = false;
                                }
                            }
                        };

                        $scope.selected = function () {
                            // if (($scope.masterRequire.ExpDate == undefined || $scope.masterRequire.ExpDate == "") && $scope.isExpDate == 1) {
                            //     dpMessageBox.alert({
                            //         ok: 'Close',
                            //         title: 'Alert',
                            //         message: 'กรุณากรอกวัน EXP Date'
                            //     })
                            //     return "";
                            // }
                            // if (($scope.masterRequire.MfgDate == undefined || $scope.masterRequire.MfgDate == "") && $scope.isMfgDate == 1) {
                            //     dpMessageBox.alert({
                            //         ok: 'Close',
                            //         title: 'Alert',
                            //         message: 'กรุณากรอกวัน MFG Date'
                            //     })
                            //     return "";
                            // }
                            // if (($scope.masterRequire.Lot == undefined || $scope.masterRequire.Lot == "") && $scope.isLot == 1) {
                            //     dpMessageBox.alert({
                            //         ok: 'Close',
                            //         title: 'Alert',
                            //         message: 'กรุณากรอก Lot'
                            //     })
                            //     return "";
                            // } 
                            // if (($scope.masterRequire.CatchWeight == undefined || $scope.masterRequire.CatchWeight == "") && $scope.isCatchWeight == 1) {
                            //     dpMessageBox.alert({
                            //         ok: 'Close',
                            //         title: 'Alert',
                            //         message: 'กรุณากรอก CatchWeight'
                            //     })
                            //     return "";
                            // } 
                            // else {
                            
                            if ($scope.invokes.selected != undefined)
                                $scope.invokes.selected($scope.masterRequire);
                                $scope.masterRequire = {};
                            $scope.onShow = false;
                            // }

                        }

                        function getExpDate() {
                            
                            var date = moment();
                            var today = date.toDate();

                            var mm = today.getMonth() + 1;
                            var yyyy = today.getUTCFullYear() + 10;
                            var dd = today.getDate();

                            // var a = today.setMonth(m);
                            // var dd = today.getDate() + d;
                            // var mm = today.setMonth(today.getMonth() + m);
                            // var yyyy = today.getUTCFullYear() + y;



                            if (dd < 10) dd = '0' + dd;
                            if (mm < 10) mm = '0' + mm;

                            return yyyy.toString() + mm.toString() + dd.toString();
                        }

                        function getToday() {
                            var today = new Date();

                            var mm = today.getMonth() + 1;
                            var yyyy = today.getUTCFullYear();
                            var dd = today.getDate();


                            if (dd < 10) dd = '0' + dd;
                            if (mm < 10) mm = '0' + mm;

                            return yyyy.toString() + mm.toString() + dd.toString();
                        }


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
