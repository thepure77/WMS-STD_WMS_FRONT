(function () {
    'use strict'

    app.component('taskCyclecountFormV2', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/TaskCyclecountV2/component/taskCyclecountFormV2.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http,$location,$anchorScroll, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, taskcyclecountFactory, scanPickItemFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = taskcyclecountFactory;
            var paramLocation;
            $scope.filterModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.isConfrimlocation = false;
            $scope.filterModel.isBarcode = true;

            $vm.onShow = function (param) {debugger;
                defer = $q.defer();
                $vm.isFilterTable = true;
                $scope.onShow = true;
                $scope.filterModel.log_udf_2 = getToday();
                $scope.filterModel.log_udf_3 = getTime();
                if (param != undefined) {
                    search(param);
                }
                return defer.promise;
            };


            //#region Count
            //ScanLocation
            $scope.scanLocation = function () {
                pageLoading.show();debugger;
                viewModel.ScanLocation($scope.filterModel).then(function (res) {
                    pageLoading.hide();debugger;
                    if (res.data.message) {

                        $scope.filterModel.isconfirmlocation = true;
                    }
                    else {
                        $scope.filterModel.confirmlocation_Name = '';
                        $scope.filterModel.isconfirmlocation = false;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ตำแหน่งที่ยืนยันต้องเป็นตำแหน่งเดียวกันเท่านั้น'
                            }
                        )
                    }
                },
                    function error(response) {pageLoading.hide();debugger;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
                
            }

            //ScanBarcode
            // $scope.scanBarcode = function () {
            //     pageLoading.show();
            //     viewModel.ScanBarcode($scope.filterModel).then(function (res) {
            //         pageLoading.hide();debugger;
            //         if (res.data.message) {

            //             $scope.filterModel.isconfirmbarcode = true;
            //         }
            //         else {
            //             $scope.filterModel.confirmBarcode = '';
            //             $scope.filterModel.isconfirmbarcode = false;
            //             return dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'แจ้งเตือน',
            //                     message: 'บาร์โค้ดที่ยืนยันต้องเป็นบาร์โค้ดเดียวกันเท่านั้น'
            //                 }
            //             )
            //         }
            //     },
            //         function error(response) {pageLoading.hide();
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'แจ้งเตือน',
            //                     message: 'Error'
            //                 }
            //             )
            //         })
            // }

            //confirmTask
            $scope.confirmTask = function () {debugger;
                $scope.filterModel.operations = "CONFIRM TASK "+$scope.filterModel.task_no;
                $scope.filterModel.log_udf_4 = getToday();
                $scope.filterModel.log_udf_5 = getTime();
                if ($scope.filterModel.confirmlocation_Name == undefined || $scope.filterModel.confirmlocation_Name == null) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณายืนยัน ตำแหน่ง ใหม่อีกครั้ง !'
                        }
                    )
                }

                if ($scope.filterModel.Qty_Count == undefined || $scope.filterModel.Qty_Count == null) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาใส่จำนวน !'
                        }
                    )
                }
                pageLoading.show()
                $scope.filterModel.userName = $scope.userName;
                viewModel.confirmTask($scope.filterModel).then(function (res) {
                    pageLoading.hide()
                    $vm.isFilterTable = true;
                    $scope.isConfirm = false;
                    $scope.isShortPick = false;
                    defer.resolve(true);
                    $('#location_Name').val('');
                    $scope.filterModel.isconfirmlocation = false;
                    $('#Qty').val('');
                    debugger;
                    viewModel.savelogsRequest($scope.filterModel).then(function () {
                    });

                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'แสกน เสร็จสิ้น'
                        }
                    )
                    
                },
                    function error(response) {
                        $scope.isBlock = false;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
                
            }

            //clearScan
            $scope.clearScan = function () {
                $('#location_Name').val('');
                $scope.filterModel.isconfirmlocation = false;
                $('#Qty').val('');
            }

            //#endregion


            function search(param) {
                $vm.isFilterTable = true;debugger;
                $scope.isConfirm = false;
                $scope.onShow = true;
                pageLoading.show()
                let whereconfirmlocation = angular.copy(param);
                
                viewModel.find(param).then(function (res) {
                    pageLoading.hide()
                    debugger;
                    if (res.data.result) {
                        if (res.data.result.Document_Status != 0) {
                            $scope.filterModel.task_index = res.data.result.task_Index;
                            $scope.filterModel.task_no = res.data.result.task_No;
                            $scope.filterModel.location_Index = res.data.result.location_Index;
                            $scope.filterModel.location_Id = res.data.result.location_Id;
                            $scope.filterModel.location_Name = res.data.result.location_Name;
                            $scope.filterModel.locationType_Index = res.data.result.locationType_Index;
                            $scope.filterModel.locationType_Id = res.data.result.locationType_Id;
                            $scope.filterModel.locationType_Name = res.data.result.locationType_Name;
                            $scope.filterModel.product_Index = res.data.result.product_Index;
                            $scope.filterModel.product_Id = res.data.result.product_Id;
                            $scope.filterModel.product_Name = res.data.result.product_Name;
                            $scope.filterModel.product_Lot = res.data.result.product_Lot;
                            $scope.filterModel.eRP_Location = res.data.result.eRP_Location;
                            $scope.filterModel.goodsReceive_MFG_Date = res.data.result.goodsReceive_MFG_Date;
                            $scope.filterModel.goodsReceive_EXP_Date = res.data.result.goodsReceive_EXP_Date;
                            $scope.filterModel.goodsReceive_ProductConversion_Index = res.data.result.goodsReceive_ProductConversion_Index;
                            $scope.filterModel.goodsReceive_ProductConversion_Id = res.data.result.goodsReceive_ProductConversion_Id;
                            $scope.filterModel.goodsReceive_ProductConversion_Name = res.data.result.goodsReceive_ProductConversion_Name;

                            

                            $scope.initialData = angular.copy($scope.filterModel)
                            document.getElementById("location_Name").focus();
                        }else{
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'แสกน เสร็จสิ้น'
                                }
                            )
                        }
                    }
                    else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(response) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Save Error'
                            }
                        )
                    })
            }

            //back
            $scope.back = function () {
                $vm.isFilterTable = true;
                $scope.isConfirm = false;
                $scope.isShortPick = false;
                $scope.filterModel.isconfirmlocation = false;
                defer.resolve(true);
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

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();

                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }


            var init = function () {
                $scope.isBlock = false;
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();

            $("#location_Name").bind("focus", function () {
                setTimeout(() => {
                    $("#confirmlocation_Name").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#confirmlocation_Name").attr("readonly", "readonly");
            });

            $("#Qty").bind("focus", function () {
                setTimeout(() => {
                    $("#tagOut_No").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#tagOut_No").attr("readonly", "readonly");
            });

        }
    })
})();