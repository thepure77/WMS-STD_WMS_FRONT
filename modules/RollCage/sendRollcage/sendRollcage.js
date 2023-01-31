'use strict'
app.component('sendRollcage', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/RollCage/sendRollcage/sendRollcage.html";

    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataRow: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, sendRollcageFactory, webServiceAPI, logsFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = sendRollcageFactory;
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $scope.filterModel = {};

        var MessageBox = dpMessageBox;
        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.ScanRollCage = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Id == "" || $scope.filterModel.rollCage_Id == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กำลังรอข้อมูลตอบกลับจากรถ AGV กรุณารอซักครู่."
                })
                $scope.filterModel.rollCage_Id = "";
                return;
            }

            pageLoading.show();
            //viewModel.scanRollCageActiveEmptyChute($scope.filterModel).then(function success(res) {
            viewModel.scanRollCageBUF($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                
                if (res.data.length > 0) {
                    // $scope.filterModel.lstPickProduct = res.data;
                    // let totalQty = 0;
                    // angular.forEach($scope.filterModel.lstPickProduct, function (v, k) {
                    //     $scope.filterModel.lstPickProduct[k].pick = $scope.filterModel.lstPickProduct[k].binBalance_QtyBal - $scope.filterModel.lstPickProduct[k].binBalance_QtyReserve;
                    //     totalQty += (parseInt($scope.filterModel.lstPickProduct[k].binBalance_QtyBal) - parseInt($scope.filterModel.lstPickProduct[k].binBalance_QtyReserve));
                    // });

                    //$vm.searchResultModel = res.data;
                    //$vm.filterModel.locationName = res.data[0].location_Name;
                    
                    //$scope.filterModel.productCount = res.data.length;
                    $scope.filterModel.rollCage_Index = res.data[0].rollCage_Index;
                    $scope.filterModel.rollCage_Name = res.data[0].rollCage_Name;
                    $scope.filterModel.rollCage_Status = res.data[0].rollCage_Status;
                    // debugger
                    // $scope.filterModel.create_By = $scope.userName;
                    // $scope.filterModel.update_By = $scope.userName;
                    //$scope.SumQty($scope.filterModel);
                    // setTimeout(() => {
                    //     var focusElem = jQuery('input[ng-model="filterModel.TagNoNew"]');
                    //     if (focusElem[0].focus != undefined) {
                    //         focusElem[0].focus();

                    //     }

                    // }, 200);
                    //$scope.checkLocationBalance();

                    document.getElementById("sourceLocation").focus();
                    //document.getElementById("locationNew").focus();
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่พบตะกร้า"
                    })
                    $scope.filterModel.rollCage_Id = "";
                    document.getElementById("rollCageId").focus();
                }
            },
            function error(res) {
                document.getElementById("rollCageId").focus();
            });
        }

        $scope.scanLocation = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Id == "" || $scope.filterModel.rollCage_Id == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาแสกนตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
                document.getElementById("rollCageId").focus();
                return;
            }

            if ($scope.filterModel.location_Name != "" || $scope.filterModel.location_Name != undefined) {
                let location_check = {};
                location_check.location_Name = $scope.filterModel.location_Name;
                viewModel.checkLocation(location_check).then(function success(res) {
                    if (res.data.length == 0) {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "ไม่พบ Location ที่กำหนด"
                        })
                        $scope.filterModel.location_Name = "";
                        $scope.filterModel.location_Name_To = "";
                        document.getElementById("sourceLocation").focus();
                        return;
                    }
                    else
                    {
                        pageLoading.show();
                        viewModel.scanLocation($scope.filterModel).then(function success(res) {
                            pageLoading.hide();
                            
                            if (res.data.length > 0) {
            
                                // $scope.filterModel.rollCage_Index = res.data[0].rollCage_Index;
                                // $scope.filterModel.rollCage_Name = res.data[0].rollCage_Name;
                                // $scope.filterModel.rollCage_Status = res.data[0].rollCage_Status;
                                $scope.filterModel.location_Index = res.data[0].location_Index;
                                $scope.filterModel.location_Id = res.data[0].location_Id;
                                $scope.filterModel.location_Name = res.data[0].location_Name;
                                
                                $scope.filterModel.create_By = $scope.userName;
                                //$scope.filterModel.update_By = $scope.userName;
            
                                // viewModel.suggestionStagingArea($scope.filterModel).then(function success(res) {
                                    
                                //     if (res.data != undefined) {
                                //         $scope.filterModel.location_Index_To = res.data.location_Index;
                                //         $scope.filterModel.location_Id_To = res.data.location_Id;
                                //         $scope.filterModel.location_Name_To = res.data.location_Name;
                                //     } else {
                                //         dpMessageBox.alert({
                                //             ok: 'Close',
                                //             title: 'แจ้งเตือน',
                                //             message: "ไม่พบตำแหน่ง"
                                //         })
                                //         $scope.filterModel.location_Id = "";
                                //         document.getElementById("sourceLocation").focus();
                                //     }
                                // },
                                // function error(res) {
                                //     document.getElementById("sourceLocation").focus();
                                // });
            
            
                                //document.getElementById("sourceLocation").focus();
                                //document.getElementById("locationNew").focus();
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: "กำลังรอข้อมูลตอบกลับจากรถ AGV กรุณารอซักครู่."
                                })
                                // $scope.filterModel.location_Id = "";
                                // $scope.filterModel.location_Id_To = "";
                                $scope.filterModel.location_Name = "";
                                $scope.filterModel.location_Name_To = "";
                                document.getElementById("sourceLocation").focus();
                            }
                        },
                        function error(res) {
                            document.getElementById("sourceLocation").focus();
                        });
                    }
                });
            }
        }

        $scope.sendToStagingArea = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Id == "" || $scope.filterModel.rollCage_Id == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาแสกนตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
                document.getElementById("rollCageId").focus();
                return;
            }

            pageLoading.show();
            viewModel.sendToStagingArea($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data == true) {
                    $scope.filterModel = {}; 

                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ระบบกำลังรอคิวงานส่งตะกร้า"
                    })
                    
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่สามารถส่งข้อมูลได้"
                    })
                    $scope.filterModel.location_Id = "";
                    $scope.filterModel.location_Id_To = "";
                    //document.getElementById("sourceLocation").focus();
                }
            },
            function error(res) {
                document.getElementById("sourceLocation").focus();
            });
        }


        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            setTimeout(() => {
                $("#rollCageId").removeAttr("readonly");
                document.getElementById("rollCageId").focus();
            }, 200);

            //document.getElementById("rollCageId").focus();
            // $scope.userName = localStorageService.get('userTokenStorage');

            // $scope.checkChute = angular.fromJson($window.localStorage['isChute']);

            // if($scope.checkChute.chute_Id == null)
            // {
            //     $state.go('wms.chute');
            //     dpMessageBox.alert({
            //         ok: 'Close',
            //         title: 'แจ้งเตือน',
            //         message: "เลือก Chute ก่อน"
            //     })
            // }

        };
        init();

        $("#rollCageId").bind("focus", function () {
            setTimeout(() => {
                $("#rollCageId").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#rollCageId").attr("readonly", "readonly");
        });

        $("#sourceLocation").bind("focus", function () {
            setTimeout(() => {
                $("#sourceLocation").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#sourceLocation").attr("readonly", "readonly");
        });

    }
});