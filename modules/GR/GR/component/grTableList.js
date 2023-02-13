'use strict'
app.component('grTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/GR/component/grTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, goodsReceiveFactory, goodsReceiveItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = goodsReceiveFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;

        $vm.$onInit = function () {

        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.checkAll = false;
                $scope.detectCheckAll();
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };


        $scope.editItem = function (param) {
            pageLoading.show();
            viewModel.getId(param.goodsReceive_Index).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined ||
                    res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    $vm.filterModel.docfile = res.data.docfile;
                    param.create_Date = null;
                    param.update_Date = null;
                    param.cancel_Date = null;
                    viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.checkAll = false;
                            $scope.detectCheckAll();
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                                $vm.triggerSearch();
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    }, function error(res) { })
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        $scope.checkAll = false;
                        $scope.detectCheckAll();
                        param.create_Date = null;
                        param.update_Date = null;
                        param.cancel_Date = null;
                        viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {
                                    $vm.isFilter = true;
                                    $vm.triggerSearch();
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }, function error(res) { });
                    });
                }
            });
        }

        $scope.getColour = function (param) {
            if (param == '1' || param == '-1')
                return '#C6C0C0';
        }


        var MessageBox = dpMessageBox;
        $scope.dragHead = '';
        $scope.dragImageId = "dragtable";
        $scope.revisionList = {};
        $scope.handleDrop = function (draggedData, targetElem) {

            var swapArrayElements = function (array_object, index_a, index_b) {
                var temp = array_object[index_a];
                array_object[index_a] = array_object[index_b];
                array_object[index_b] = temp;
            };
            var srcInd = $scope.tblHeader.findIndex(x => x.name === draggedData);
            var destInd = $scope.tblHeader.findIndex(x => x.name === targetElem.textContent);
            swapArrayElements($scope.tblHeader, srcInd, destInd);
        };
        $scope.handleDrag = function (columnName) {
            $scope.dragHead = columnName.replace(/["']/g, "");
        };

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.pageMode = 'Master';

        $scope.checkbox = {
            Show: true
        };

        $scope.hide = function (param) {
            var setHideButton = false;
            angular.forEach($vm.searchResultModel, function (v, k) {
                if (!setHideButton) {
                    if ($vm.searchResultModel[k].selected == true) {
                        setHideButton = true;
                    }
                }
            });
            $scope.checkbox.Show = (setHideButton == true) ? false : true;

        };

        $scope.comfirmAllSelected = function () {
            angular.forEach($vm.searchResultModel, function (v, k) {
                if ($vm.searchResultModel[k].selected == true) {
                    if ($vm.searchResultModel[k].document_Status == 0) {
                        $vm.searchResultModel[k].update_By = localStorageService.get('userTokenStorage');
                        $vm.searchResultModel[k].operations = "CONFIRM";
                        pageLoading.show();
                        viewModel.confirmStatus($vm.searchResultModel[k]).then(function success(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ยืนยันเอกสาร',
                                message: 'การยืนยันเอกสารสำเร็จ!'
                            });
                            $vm.triggerSearch();

                        }, function error(res) { });
                    }
                }
            });
        };


        var init = function () {
            if ($scope.config.pageMode == "Search") {
                $scope.pageMode = "Search";
            }
        }


        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };




        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }


        $scope.model = {
            currentPage: $vm.filterModel.currentPage + 1,
            perPage: $vm.filterModel.perPage,
            totalRow: 0,
            advanceSearch: false
        };

        $scope.calColor = function (value) {
            // if (isNumber(value)) {
            //     if (value > 10) return '#C1FDC2';
            //     else if (value > 0) return '#FBFDC0';
            //     else return '#FF7777';
            // }
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
        };

        // coload toggle
        $scope.showCoload = false;



        $scope.delete = function (param) {
            // if (param.document_Status != 1) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่'
            }).then(function success() {
                param.cancel_By = localStorageService.get('userTokenStorage');
                param.operations = "DELETE";
                param.create_Date = null;
                param.update_Date = null;
                param.cancel_Date = null;

                pageLoading.show();
                viewModel.getDelete(param).then(function success(res) {
                    pageLoading.hide();
                    let msg = res.data.split(',');
                    if (msg[0] == "Confirm") {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'แจ้งเตือน',
                            message: msg[1]
                        }).then(function success() {
                            pageLoading.show();
                            viewModel.getDeletePGR(param).then(function success(res) {
                                pageLoading.hide();
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                            }, function error(res) { });
                        }, function error(res) { });
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: res.data
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
                $vm.triggerSearch();

            }, function error(res) { });
            // } else {
            //     dpMessageBox.alert({
            //         ok: 'Close',
            //         title: 'Alert',
            //         message: 'ไม่สามารถลบออเดอร์ที่ยืนยันแล้วได้'
            //     })
            // }
        };

        $scope.deletes = function (param) {

            var m = {};
            m = param;
            m.index = [];
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected)
                    m.index.push("'" + $vm.searchResultModel[index].goodsReceive_Index + "'");
            }
            // m.cancel_By = localStorageService.get('userTokenStorage');

            if (param.document_Status != 1) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Cancel ?'
                }).then(function success() {

                    m.cancel_By = localStorageService.get('userTokenStorage');
                    m.operations = "DELETE";
                    pageLoading.show();
                    viewModel.getDelete(m).then(function success(res) {
                        if (res.data.length > 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: res.data
                            })
                        }
                        $vm.triggerSearch();
                    }, function error(res) { });
                    $vm.triggerSearch();

                });
            } else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: 'ไม่สามารถลบออเดอร์ที่ยืนยันแล้วได้'
                })
            }

        };

        $scope.Make_AMZ = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                viewModel.makeAMZ(param).then(function (res) {
                    if (res.data) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: "Success"
                            }
                        )
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error"
                            }
                        )
                    }
                    pageLoading.hide()
                },
                    function error(response) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error API"
                            }
                        )
                    });
            });
        };

        $scope.Sales_return = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                viewModel.Sales_return(param).then(function (res) {
                    if (res.data) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: "Success"
                            }
                        )
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error"
                            }
                        )
                    }
                    pageLoading.hide()
                },
                    function error(response) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error API"
                            }
                        )
                    });
            });
        };



        $scope.GoodsReceiveConfirm = function (param) {
            pageLoading.show();
            param.create_Date = null;
            param.update_Date = null;
            param.cancel_Date = null;
            viewModel.checkUserAssign(param).then(function (data) {
                pageLoading.hide();
                if (data.data == "" || data.data == $scope.userName) {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'แจ้งเตือน',
                        message: 'คุณต้องการยืนยันการรับสินค้าใช่หรือไม่'
                    }).then(function success() {

                        param.create_By = localStorageService.get('userTokenStorage');
                        param.operations = "CONFIRM";
                        pageLoading.show();
                        viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == false) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'แจ้งเตือน',
                                    message: 'การรับสินค้าไม่สำเร็จ!!'
                                });
                                $vm.triggerSearch();
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'แจ้งเตือน',
                                    message: 'การรับสินค้าสำเร็จ'
                                });
                                $vm.triggerSearch();
                            }

                        }, function error(res) { });
                    });
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำการ Scan Receive อยู่ ต้องการ Confirm Receive หรือไม่'
                    }).then(function success() {
                        param.create_By = localStorageService.get('userTokenStorage');
                        param.operations = "CONFIRM";
                        pageLoading.show();
                        viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == false) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Confirm Receive',
                                    message: 'ไม่สามารถ Confirm Receiving ได้!'
                                });
                                $vm.triggerSearch();
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Confirm Receive',
                                    message: 'Confirm Receiving Success !'
                                });
                                $vm.triggerSearch();
                            }

                        }, function error(res) { });
                    });
                }
            });
        };

        $scope.AutoScanReceive = function (model) {
            $scope.model.GoodsReceiveIndex = model.goodsReceiveIndex;
            $scope.model.MFGDate = "19000101";
            $scope.model.EXPDate = "19000101";

            var param = $scope.model;
            if (model.documentStatus == "1") {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm Status',
                    message: 'Do you want to Confirm ?'
                }).then(function success() {

                    param.createBy = localStorageService.get('userTokenStorage');
                    param.updateBy = localStorageService.get('userTokenStorage');
                    param.operations = "AUTOSCAN_RECEIVE";
                    viewModel.AutoScanReceive(param).then(function success(res) {

                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Auto Receive',
                            message: res.data
                        });
                        $vm.triggerSearch($vm.filterModel);

                    }, function error(res) { });
                });
            } else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Confirm Status',
                    message: 'กรุณาทำการ Confirm Document !'
                })
            }
        };

        $scope.comfirmStatus = function (param) {

            if (param.document_Status == 0)
                dpMessageBox.confirm({
                    title: 'ยืนยันสถานะ',
                    message: 'ยืนยันการรับสินค้าเข้าใช่หรือไม่ ?'
                }).then(function success() {
                    param.create_Date = null;
                    param.update_Date = null;
                    param.cancel_Date = null;
                    param.update_By = localStorageService.get('userTokenStorage');
                    param.operations = "CONFIRM";
                    pageLoading.show();
                    viewModel.confirmStatus(param).then(function success(res) {
                        dpMessageBox.alert({
                            title: 'ยืนยันสถานะ',
                            message: 'การยืนยันเอกสารสำเร็จ !'
                        });
                        $vm.triggerSearch();

                    }, function error(res) { });
                });
            else
                dpMessageBox.alert({
                    title: 'ยืนยันสถานะ',
                    message: 'Status has been Confirmed !!!'
                })
        };


        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) { }
            }
        };

        $scope.popupSigner = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupSigner.onShow = !$scope.popupSigner.onShow;
                $scope.popupSigner.delegates.set(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    pageLoading.show();
                    param.operations = "PRINT";
                    param.user = $scope.userName;
                    viewModel.PrintReceipt(param).then(
                        function success(results) {
                            pageLoading.hide();
                            $scope.popupReport.onClick(results);
                            deferred.resolve(results);
                        },
                        function error(response) {
                            pageLoading.hide();
                            dpMessageBox.alert({
                                title: 'Information.',
                                message: "Connect Service Fail."
                            })
                            deferred.reject(response);
                        });
                }
            }
        };


        $scope.print = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintGR(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Connect Service Fail."
                    })
                    deferred.reject(response);
                }
            );

        }

        $scope.printPutaway = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintGRPutaway(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Connect Service Fail."
                    })
                    deferred.reject(response);
                });
        }

        $scope.printPutawayGR = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintReportPutawayGR(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Connect Service Fail."
                    })
                    deferred.reject(response);
                });
        }

        $scope.printOutGR = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintReportPrintOutGR(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Connect Service Fail."
                    })
                    deferred.reject(response);
                });
        }

        $scope.changeTableSize = function (perPage, tab) {
            if (tab == 1) {
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#97bee7";

            } else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#97bee7";

                $scope.fronttab1 = "#97bee7";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }
            // var p = {
            //     currentPage: 0, //$scope.pagging.num,
            //     perPage: $vm.filterModel.perPage
            // };
            $vm.filterModel.perPage = perPage;
            $scope.changePage();
        };

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 10,
            perPage: $vm.filterModel.perPage,
        };

        $scope.changePage = function () {
            // $vm.filterModel.productIndex = ($vm.filterModel.productName === undefined || $vm.filterModel.productName == "") ? $vm.filterModel.productIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.productIndex;
            // $vm.filterModel.documentTypeIndex = ($vm.filterModel.documentTypeName === undefined || $vm.filterModel.documentTypeName == "") ? $vm.filterModel.documentTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.documentTypeIndex;
            // $vm.filterModel.ownerIndex = ($vm.filterModel.ownerName === undefined || $vm.filterModel.ownerName == "") ? $vm.filterModel.ownerIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.ownerIndex;
            // $vm.filterModel.processStatusIndex = ($vm.filterModel.processStatusName === undefined || $vm.filterModel.processStatusName == "") ? $vm.filterModel.processStatusIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.processStatusIndex;
            // $vm.filterModel.warehouseIndex = ($vm.filterModel.warehouseName === undefined || $vm.filterModel.warehouseName == "") ? $vm.filterModel.warehouseIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndex;
            // $vm.filterModel.warehouseIndexTo = ($vm.filterModel.warehouseNameTo === undefined || $vm.filterModel.warehouseNameTo == "") ? $vm.filterModel.warehouseIndexTo = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndexTo;
            // $vm.filterModel.documentStatus = ($vm.filterModel.processStatusName === undefined || $vm.filterModel.processStatusName == "") ? $vm.filterModel.documentStatus = null : $vm.filterModel.documentStatus;
            // $vm.filterModel.RefDocumentindex = ($vm.filterModel.RefDocumentNo === undefined || $vm.filterModel.RefDocumentNo == "") ? $vm.filterModel.RefDocumentindex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.RefDocumentindex;
            // $vm.filterModel.planGoodsReceiveIndex = ($vm.filterModel.planGoodsReceiveNo === undefined || $vm.filterModel.planGoodsReceiveNo == "") ? $vm.filterModel.planGoodsReceiveIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.planGoodsReceiveIndex;
            // $vm.filterModel.dockDoorIndex = ($vm.filterModel.dockDoorName === undefined || $vm.filterModel.dockDoorName == "") ? $vm.filterModel.dockDoorIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.dockDoorIndex;
            // $vm.filterModel.vehicleTypeIndex = ($vm.filterModel.vehicleTypeName === undefined || $vm.filterModel.vehicleTypeName == "") ? $vm.filterModel.vehicleTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.vehicleTypeIndex;
            // $vm.filterModel.containerTypeIndex = ($vm.filterModel.containerTypeName === undefined || $vm.filterModel.containerTypeName == "") ? $vm.filterModel.containerTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.containerTypeIndex;
            // $vm.filterModel.goodsReceiveDate = ($scope.filterModel.goodsReceiveDate === undefined || $scope.filterModel.goodsReceiveDate == null) ? $scope.filterModel.goodsReceiveDate : getToday();
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }

        function serchPage(data) {

            if (data != null) {

                pageLoading.show();

                viewModel.grSearch(data).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    } else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsGR;

                        }
                    }
                })
            }
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        // $scope.clearCheck = function (param) {
        //     
        //     for (let index = 0; index < $vm.searchResultModel.length; index++) {

        //         if (index != param)
        //         $vm.searchResultModel[index].selected = false;

        //     }
        // }
        // $scope.select = function (param) {
        //     
        //     var item = param.filter(c => c.selected);

        //     if ($vm.providers.invokes)
        //         $vm.providers.invokes.set(item);

        //     $vm.isCheck = true;

        //     // defer.resolve(item);
        // }

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = true;
                    $scope.hide(k);
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                    $scope.hide(k);
                });
            }
        }

        $scope.genTag = function (param, data) {
            if (data.document_Status == 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'กรุณายืนยันเอกสาร!'
                })
            }
            else {
                viewModel.setParam(param);
                $state.go('wms.lpn_management', {});
            }

        }

        $scope.memo = function (param, data) {
            viewModel.setParam(param);
            viewModel.setDate(data);
            $state.go('wms.gr_memo', {});
        }

        $scope.SentToSap = function () {
            let items = $vm.searchResultModel.filter(f => f.selected);
            items.userName = localStorageService.get('userTokenStorage');
            pageLoading.show();
            viewModel.SentToSap({ items: items }).then(function (res) {
                pageLoading.hide();
                let msg = res.data.split(',');
                dpMessageBox.alert({
                    title: 'แจ้งเตือน',
                    messageNewLine: msg
                })
            })
        };


        $scope.puyawayPopupTable = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.puyawayPopupTable.onShow = !$scope.puyawayPopupTable.onShow;
                $scope.puyawayPopupTable.delegates(param);
            },
            config: {
                title: ""
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {

                }
            }
        };

        function validate(param) {
            var msg = "";
            return msg;
        }
        var initForm = function () { };
        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});