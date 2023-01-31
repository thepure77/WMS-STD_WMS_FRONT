(function () {
    'use strict'

    app.component('taskcyclecountCount', {
        controllerAs: '$vm',
        bindings: {
            isCount: '=?',
            isFormTaskCycleCountSummary: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TaskCyclecount/TaskCyclecountCount.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, taskcyclecountFactory) {
            var $vm = this;

            var viewModel = taskcyclecountFactory;
            $scope.isFilter = true;
            $scope.isCount = false;
            $scope.model = {};
            var defer = {};

            $scope.filterModel = {
                currentPage: 0,
                PerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                chkinitpage: false,
                maxSize: 10,
                num: 1,
            };

            $vm.isCount = function (model) {

                $scope.isCount = true;
                defer = $q.defer();

                if (model != undefined) {
                    $scope.filterModel = model;
                    $scope.filterModel.count = null;
                    $scope.filterModel.location_Name = null;

                }

                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.location_Name"]');
                    focusElem.focus();
                }, 200);
                // document.getElementById("Lpn").disabled = true;
                document.getElementById("Barcode").disabled = true;

                return defer.promise;
            }

            $scope.ScanLoc = function (param) {
                $scope.filterModel.location_Name = param.location_Name;

                var deferred = $q.defer();
                viewModel.scanLoc($scope.filterModel).then(
                    function success(res) {
                        $scope.filterModel.location_Index = res.data.loc_Index;

                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ระบุตำแหน่งไม่ตรงกับใบงาน'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            document.getElementById("Barcode").disabled = false;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.productConvertionBarcode"]');
                                focusElem.focus();
                            }, 200);
                            $scope.filterModel.location_Index = res.data.loc_Index;

                        }
                        // else if (res.data.message == true && res.data.active == false) {
                        //     document.getElementById("Lpn").disabled = false;

                        //     setTimeout(() => {
                        //         var focusElem = jQuery('input[ng-model="filterModel.lpn_No"]');
                        //         focusElem.focus();
                        //     }, 200);
                        // }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            // $scope.ScanLpn = function (param) {
            //     $scope.filterModel.location_Name = param.location_Name;

            //     var deferred = $q.defer();
            //     viewModel.scanLpn($scope.filterModel).then(
            //         function success(res) {
            //             if (res.data.message == false) {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'Error',
            //                         message: 'ไม่พบ Lpn ใน Location นี้'
            //                     }
            //                 )
            //             }
            //             else if (res.data.message == true) {
            //                 document.getElementById("Barcode").disabled = false;

            //                 setTimeout(() => {
            //                     var focusElem = jQuery('input[ng-model="filterModel.productConvertionBarcode"]');
            //                     focusElem.focus();
            //                 }, 200);
            //             }
            //         },
            //         function error(response) {
            //         });
            //     return deferred.promise;
            // }

            $scope.ScanBarcode = function (param) {
                $scope.filterModel.location_Name = param.location_Name;
                var deferred = $q.defer();
                viewModel.scanBarcode($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่พบสินค้าในตำแหน่งนี้'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            $scope.filterModel.product_Index = res.data.listBinresult[0].product_Index;
                            $scope.filterModel.product_Id = res.data.listBinresult[0].product_Id;
                            $scope.filterModel.product_Name = res.data.listBinresult[0].product_Name;
                            $scope.filterModel.productConversion_Index = res.data.listBinresult[0].productConversion_Index;
                            $scope.filterModel.productConversion_Id = res.data.listBinresult[0].productConversion_Id;
                            $scope.filterModel.productConversion_Name = res.data.listBinresult[0].productConversion_Name;
                            // $scope.filterModel.sumCountQty = res.data.listBinresult[0].sumCountQty;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.count"]');
                                focusElem.focus();
                            }, 200);

                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.ScanCount = function (param) {
                $scope.filterModel.create_by = $scope.userName;
                var deferred = $q.defer();
                $scope.SaveDetail();
                // $scope.popupMaster.onClick($scope.filterModel);
            }

            $scope.SaveDetail = function () {
                $scope.filterModel.create_by = $scope.userName;
                $scope.filterModel.operations = "SCAN_COUNT";
                var deferred = $q.defer();
                viewModel.scanCount($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'สแกนตรวจนับไม่สำเร็จ'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            $scope.filterModel.location_Name = null;
                            $scope.filterModel.lpn_No = null;
                            $scope.filterModel.count = null;
                            $scope.filterModel.productConvertionBarcode = null;
                            $scope.filterModel.product_Index = null;
                            $scope.filterModel.product_Id = null;
                            $scope.filterModel.product_Name = null;
                            $scope.filterModel.productConversion_Index = null;
                            $scope.filterModel.productConversion_Id = null;
                            $scope.filterModel.productConversion_Name = null;
                            $scope.filterModel.sumCountQty = null;

                       

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.location_Name"]');
                                focusElem.focus();
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'นับสินค้าสำเร็จ'
                                    }
                                )
                            }, 200);
                            // document.getElementById("Lpn").disabled = true;
                            document.getElementById("Barcode").disabled = true;
                         

                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.ConfirmTask = function (param) {
                $scope.filterModel.userAssign = $scope.userName;
                $scope.filterModel.operations = "CONFIRM_TASK";
                var deferred = $q.defer();
                viewModel.confirmTask($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'สแกนตรวจนับไม่สำเร็จ'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'สแกนตรวจนับสำเร็จ'
                                }
                            )
                            $scope.isCount = false;
                            defer.resolve();

                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            // $scope.popupMaster = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupMaster.onShow = !$scope.popupMaster.onShow;
            //         $scope.popupMaster.delegates.masterRequirePopup(param, index);
            //     },
            //     config: {
            //         title: "masterRequire"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.mFG_Date = param.mFG_Date;
            //             $scope.filterModel.eXP_Date = param.eXP_Date;
            //             $scope.filterModel.product_Lot = param.lot;
            //             $scope.filterModel.itemStatus_Index = param.itemStatus_Index;
            //             $scope.filterModel.itemStatus_Id = param.itemStatus_Id;
            //             $scope.filterModel.itemStatus_Name = param.itemStatus_Name;
            //             $scope.filterModel.isExpDate = param.isExpDate;
            //             $scope.filterModel.isMfgDate = param.isMfgDate;
            //             $scope.SaveDetail();
            //         }
            //     }
            // };

            this.$onInit = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            }



            $("#location_Name").bind("focus", function () {
                setTimeout(() => {
                    $("#location_Name").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#location_Name").attr("readonly", "readonly");
            });


            $("#Barcode").bind("focus", function () {
                setTimeout(() => {
                    $("#Barcode").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#Barcode").attr("readonly", "readonly");
            });

            $scope.back = function () {
                $scope.isCount = false;
                defer.resolve();
            }
        }
    })
})();