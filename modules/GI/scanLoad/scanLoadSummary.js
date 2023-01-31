(function () {
    'use strict';
    app.component('scanLoadSummary', {
        controllerAs: '$vm',
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/scanLoad/scanLoadSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, scanLoadFactory, webServiceAPI, logsFactory) {
            var $vm = this;
            var viewModel = scanLoadFactory;
            $scope.msg = dpMessageBox;
            $scope.filterModel = {};


            // $scope.delete = function (param, index) {
            //     var deferred = $q.defer();
            //     pageLoading.show();
            //     $scope.filterModel.update_By = $scope.userName;
            //     viewModel.deleteItem($scope.filterModel).then(
            //         function success(res) {
            //             param.splice(index, 1);
            //             pageLoading.hide();
            //         },
            //         function error(response) {
            //             dpMessageBox.alert({
            //                 ok: 'Close',
            //                 title: 'แจ้งเตือน',
            //                 message: "ERROR"
            //             })
            //             deferred.reject(response);
            //         });
            //     return deferred.promise;
            // }

            // $scope.deleteItem = function () {
            //     var deferred = $q.defer();
            //     pageLoading.show();
            //     viewModel.deleteItem($scope.filterModel).then(
            //         function success(res) {

            //             pageLoading.hide();
            //         },
            //         function error(response) {
            //             dpMessageBox.alert({
            //                 ok: 'Close',
            //                 title: 'แจ้งเตือน',
            //                 message: "ERROR"
            //             })
            //             deferred.reject(response);
            //         });
            //     return deferred.promise;
            // }


            $scope.ScanLoadNo = function (model) {
                var deferred = $q.defer();
                $scope.filterModel = model;
                pageLoading.show();
                viewModel.scanLoadNo($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.truckLoad_Index == null
                            || res.data.truckLoad_Index == undefined
                            || res.data.truckLoad_Index == "00000000-0000-0000-0000-000000000000") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "ไม่พบเลข Dispatching นี้"
                            })
                        }
                        else {
                            $scope.filterModel.truckLoad_Index = res.data.truckLoad_Index;
                            $scope.filterModel.truckLoad_No = res.data.truckLoad_No;
                            $scope.filterModel.documentRef_No1 = res.data.documentRef_No1;
                            $scope.filterModel.vehicle_Registration = res.data.vehicle_Registration;
                            $scope.filterPlanSN($scope.filterModel);

                            document.getElementById("SoNo").focus();

                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ไม่พบเลข Dispatching นี้"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.ScanSoNo = function (model) {
                var deferred = $q.defer();
                $scope.filterModel.planGoodsIssue_No = model.planGoodsIssue_No;
                $scope.filterModel.create_By = $scope.userName;
                pageLoading.show();
                viewModel.scanSoNo($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        // $scope.filterModel.planGoodsIssue_No = NULL;
                        // if (res.data.message == false) {
                        //     dpMessageBox.alert({
                        //         ok: 'Close',
                        //         title: 'ALERT',
                        //         message: res.data.msg
                        //     })
                        // }
                        // $scope.filterPlanSN($scope.filterModel);
                        // $scope.filterModel.planGoodsIssue_No = null;
                        
                        $scope.filterModel.listTruckLoadItemViewModel = res.data;

                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ไม่พบเลข So นี้"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }


            $scope.ScanProduct = function (model) {
                var deferred = $q.defer();
                $scope.filterModel.productConvertionBarcode = model.productConvertionBarcode;
                pageLoading.show();
                viewModel.scanProduct($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.product_Id == null) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "ไม่พบ Barcode สินค้านี้"
                            })
                        }
                        else {
                            document.getElementById("SN").focus();
                            $scope.filterModel.product_Id = res.data.product_Id;
                            $scope.filterModel.product_Name = res.data.product_Name;

                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ไม่พบ Barcode สินค้านี้"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }



            $scope.ScanSN = function (model) {
                var deferred = $q.defer();
                $scope.filterModel.planGoodsIssueItem_SN = model.planGoodsIssueItem_SN;
                $scope.filterModel.create_By = $scope.userName;
                pageLoading.show();
                viewModel.scanSN($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.message == false) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.msg
                            })
                            $scope.filterModel.planGoodsIssue_No = null;
                            $scope.filterModel.productConvertionBarcode = null;
                            $scope.filterModel.planGoodsIssueItem_SN = null;
                            $scope.filterModel.product_Name = null;
                            $scope.filterModel.shipTo_Name = null;
                            $scope.filterModel.product_Id = null;

                            document.getElementById("SoNo").focus();

                        }
                        else {
                            document.getElementById("shipNo").focus();
                            $scope.filterPlanSN($scope.filterModel);
                            $scope.filterModel.productConvertionBarcode = null;
                            $scope.filterModel.planGoodsIssueItem_SN = null;

                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.filterPlanSN = function (model) {
                var deferred = $q.defer();
                pageLoading.show();
                viewModel.filterPlanSN($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        
                        $scope.filterModel.listTruckLoadItemViewModel = res.data;

                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }


            $scope.confirmScan = function () {
                var deferred = $q.defer();
                
                $scope.filterModel.update_By = $scope.userName;
                pageLoading.show();
                // var getfrist = $scope.filterModel.listTruckLoadItemViewModel.filter(c => c.plan_check == true);
                // $scope.confirm = getfrist[0];
                $scope.confirm = {};
                $scope.confirm.truckLoad_Index = $scope.filterModel.truckLoad_Index;
                $scope.confirm.truckLoad_No = $scope.filterModel.truckLoad_No;
                viewModel.confirmScan($scope.confirm).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.message == false) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.msg
                            })
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'confirm success !! '
                            })
                            $scope.filterModel.planGoodsIssue_No = undefined
                            // setTimeout(() => {
                            //     var focusElem = jQuery('input[ng-model="filterModel.planGoodsIssue_No"]');
                            //     focusElem[0].focus();

                            // }, 200);
                        }
                        $scope.filterPlanSN($scope.filterModel);
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }



            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();
        }
    })
})();
// (function () {
//     'use strict';
//     app.component('scanLoadSummary', {
//         controllerAs: '$vm',
//         bindings: {
//             isLoading: '=?',
//             onShow: '=?',
//         }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
//             return "modules/GI/scanLoad/scanLoadSummary.html";
//         },
//         controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, truckLoadFactory, webServiceAPI, logsFactory) {
//             var $vm = this;
//             var viewModel = truckLoadFactory;
//             $scope.msg = dpMessageBox;
//             $scope.filterModel = {};


//             $scope.delete = function (param, index) {
//                 var deferred = $q.defer();
//                 pageLoading.show();
//                 $scope.filterModel.update_By = $scope.userName;
//                 viewModel.deleteItem($scope.filterModel).then(
//                     function success(res) {
//                         param.splice(index, 1);
//                         pageLoading.hide();
//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ERROR"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }

//             $scope.deleteItem = function () {
//                 var deferred = $q.defer();
//                 pageLoading.show();
//                 viewModel.deleteItem($scope.filterModel).then(
//                     function success(res) {

//                         pageLoading.hide();
//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ERROR"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }


//             $scope.ScanLoadNo = function (model) {
//                 var deferred = $q.defer();
//                 $scope.filterModel = model;
//                 pageLoading.show();
//                 viewModel.scanLoadNo($scope.filterModel).then(
//                     function success(res) {
//                         pageLoading.hide();
//                         if (res.data.truckLoad_Index == null
//                             || res.data.truckLoad_Index == undefined
//                             || res.data.truckLoad_Index == "00000000-0000-0000-0000-000000000000") {
//                             dpMessageBox.alert({
//                                 ok: 'Close',
//                                 title: 'แจ้งเตือน',
//                                 message: "ไม่พบเลข Dispatching นี้"
//                             })
//                         }
//                         else {
//                             $scope.filterModel.truckLoad_Index = res.data.truckLoad_Index;
//                             $scope.filterModel.truckLoad_No = res.data.truckLoad_No;
//                             $scope.filterModel.documentRef_No1 = res.data.documentRef_No1;
//                             $scope.filterModel.vehicle_Registration = res.data.vehicle_Registration;
//                             $scope.filterPlanSN($scope.filterModel);

//                             document.getElementById("SoNo").focus();

//                         }
//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ไม่พบเลข Dispatching นี้"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }

//             $scope.ScanSoNo = function (model) {
//                 var deferred = $q.defer();
//                 $scope.filterModel.planGoodsIssue_No = model.planGoodsIssue_No;
//                 $scope.filterModel.create_By = $scope.userName;
//                 pageLoading.show();
//                 viewModel.scanSoNo($scope.filterModel).then(
//                     function success(res) {
//                         pageLoading.hide();
//                         if (res.data.message == false) {
//                             dpMessageBox.alert({
//                                 ok: 'Close',
//                                 title: 'ALERT',
//                                 message: res.data.msg
//                             })
//                         }
//                         $scope.filterPlanSN($scope.filterModel);
//                         $scope.filterModel.planGoodsIssue_No = null;

//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ไม่พบเลข So นี้"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }


//             $scope.ScanProduct = function (model) {
//                 var deferred = $q.defer();
//                 $scope.filterModel.productConvertionBarcode = model.productConvertionBarcode;
//                 pageLoading.show();
//                 viewModel.scanProduct($scope.filterModel).then(
//                     function success(res) {
//                         pageLoading.hide();
//                         if (res.data.product_Id == null) {
//                             dpMessageBox.alert({
//                                 ok: 'Close',
//                                 title: 'แจ้งเตือน',
//                                 message: "ไม่พบ Barcode สินค้านี้"
//                             })
//                         }
//                         else {
//                             document.getElementById("SN").focus();
//                             $scope.filterModel.product_Id = res.data.product_Id;
//                             $scope.filterModel.product_Name = res.data.product_Name;

//                         }
//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ไม่พบ Barcode สินค้านี้"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }



//             $scope.ScanSN = function (model) {
//                 var deferred = $q.defer();
//                 $scope.filterModel.planGoodsIssueItem_SN = model.planGoodsIssueItem_SN;
//                 $scope.filterModel.create_By = $scope.userName;
//                 pageLoading.show();
//                 viewModel.scanSN($scope.filterModel).then(
//                     function success(res) {
//                         pageLoading.hide();
//                         if (res.data.message == false) {
//                             dpMessageBox.alert({
//                                 ok: 'Close',
//                                 title: 'แจ้งเตือน',
//                                 message: res.data.msg
//                             })
//                             $scope.filterModel.planGoodsIssue_No = null;
//                             $scope.filterModel.productConvertionBarcode = null;
//                             $scope.filterModel.planGoodsIssueItem_SN = null;
//                             $scope.filterModel.product_Name = null;
//                             $scope.filterModel.shipTo_Name = null;
//                             $scope.filterModel.product_Id = null;

//                             document.getElementById("SoNo").focus();

//                         }
//                         else {
//                             document.getElementById("shipNo").focus();
//                             $scope.filterPlanSN($scope.filterModel);
//                             $scope.filterModel.productConvertionBarcode = null;
//                             $scope.filterModel.planGoodsIssueItem_SN = null;

//                         }
//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ERROR"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }

//             $scope.filterPlanSN = function (model) {
//                 var deferred = $q.defer();
//                 pageLoading.show();
//                 viewModel.filterPlanSN($scope.filterModel).then(
//                     function success(res) {
//                         pageLoading.hide();
//                         $scope.filterModel.listTruckLoadItemViewModel = res.data;

//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ERROR"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }


//             $scope.confirmScan = function (model) {
//                 var deferred = $q.defer();
//                 $scope.filterModel.update_By = $scope.userName;
//                 pageLoading.show();
//                 viewModel.confirmScan($scope.filterModel).then(
//                     function success(res) {
//                         pageLoading.hide();
//                         $scope.filterModel = {};
//                         if (res.data.message == false) {
//                             dpMessageBox.alert({
//                                 ok: 'Close',
//                                 title: 'แจ้งเตือน',
//                                 message: 'confirm error !! '
//                             })
//                         }
//                         else {
//                             dpMessageBox.alert({
//                                 ok: 'Close',
//                                 title: 'แจ้งเตือน',
//                                 message: 'confirm success !! '
//                             })
//                             $scope.filterModel = {};
//                         }

//                     },
//                     function error(response) {
//                         dpMessageBox.alert({
//                             ok: 'Close',
//                             title: 'แจ้งเตือน',
//                             message: "ERROR"
//                         })
//                         deferred.reject(response);
//                     });
//                 return deferred.promise;
//             }



//             var init = function () {
//                 $scope.filterModel = {};
//                 $scope.userName = localStorageService.get('userTokenStorage');
//             };
//             init();
//         }
//     })
// })();