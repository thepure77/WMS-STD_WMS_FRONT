(function () {
    'use strict'

    app.component('packForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/Pack/component/packForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, packFactory) {
            var $vm = this;
            var a = a ? a : 0;
            var defer = {};
            var modelItem = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = packFactory;
            $scope.isLoading = false;
            $scope.chkscan = false;
            $scope.checkAll = false;
            $scope.modelPack = {};
            $scope.modelPack.itemlist = [];
            $scope.model = {};
            $scope.packSize = [{
                value: 'S',
                display: 'S'
            },
            {
                value: 'M',
                display: 'M'
            },
            {
                value: 'L',
                display: 'L'
            }
            ]
            $scope.itemScan = [];
            // $scope.model.packSize = 'S';
            $vm.isLoading = function (param, list, listPack) {
                $scope.model.packSize = 'S';
                $scope.model.packQty = 1;
                var model = param;
                $scope.modelPack = param;
                $scope.filterModel = {};
                $scope.filterModelItems = {};
                $scope.packReceiveModel = {};
                $scope.filterModelItems = list;
                $scope.packReceiveModel = listPack;
                $scope.filterModel.planGoodsIssue_No = model.planGoodsIssue_No;
                defer = $q.defer();
                $scope.isLoading = true;
                viewModel.getPack(model).then(
                    function success(res) {
                        $scope.modelPack.ref_Document_Index = $scope.modelPack.planGoodsIssue_Index
                        $scope.filterPack($scope.modelPack);
                        $scope.filterSum($scope.modelPack);

                        $scope.filterModel.items = res.data;
                    },
                    function error(response) {
                        $scope.model = {};
                    });
                return defer.promise;
            };


            $scope.checkScanBarcode = function (model) {
                $scope.Scanmodel = {};
                $scope.Scanmodel.ref_Document_Index = $scope.filterModelItems[0].planGoodsIssue_Index;
                $scope.Scanmodel.productBarcode = model.productBarcode;
                $scope.Scanmodel.create_by = $scope.userName;
                $scope.Scanmodel.packQty = model.packQty;
                $scope.Scanmodel.owner_Index = $scope.modelPack.owner_Index;
                // if ($scope.itemScan.length != 0) {
                //     for (let index = 0; index < $scope.itemScan.length; index++) {
                //         if ($scope.itemScan[index].product_Id == model.productBarcode) {
                //             $scope.Scanmodel.packQty = $scope.Scanmodel.packQty + $scope.itemScan[index].packTotalQty;
                //         }
                //     }
                // }
                var x = $scope.itemScan.filter(c => c.ref_DocumentItem_Index == model.ref_DocumentItem_Index)
                if (x.length > 0) {
                    x.forEach(element => {
                        $scope.Scanmodel.packQty = $scope.model.packQty + element.packTotalQty;
                    });

                }
                pageLoading.show();
                viewModel.checkScanBarcode($scope.Scanmodel).then(
                    function success(res) {
                        
                        // $scope.model.productBarcode = "";
                        if (res.data.barcode.length > 1) {
                            $scope.popupPackProduct.onClick(res.data.barcode);
                        }
                        else if (res.data.barcode.length == 1) {
                            $scope.ScanBarcode(res.data.barcode[0]);
                        }
                        else {
                            
                            return;
                        }
                    },
                    function error(response) {
                        $scope.model = {};
                    });
            }

            $scope.ScanBarcode = function (model) {

                $scope.Scanmodel = {};
                $scope.Scanmodel.ref_Document_Index = $scope.filterModelItems[0].planGoodsIssue_Index;
                $scope.Scanmodel.productBarcode = $scope.model.productBarcode;
                $scope.Scanmodel.create_by = $scope.userName;
                $scope.Scanmodel.packQty = $scope.model.packQty;
                $scope.Scanmodel.owner_Index = $scope.modelPack.owner_Index;
                $scope.Scanmodel.ref_DocumentItem_Index = (model == undefined) ? "" : model.ref_DocumentItem_Index;
                // if ($scope.itemScan.length != 0) {
                //     for (let index = 0; index < $scope.itemScan.length; index++) {
                //         if ($scope.itemScan[index].product_Id == $scope.model.productBarcode) {
                //         }
                //     }
                // }

                var x = $scope.itemScan.filter(c => c.ref_DocumentItem_Index == model.ref_DocumentItem_Index)
                if (x.length > 0) {
                    x.forEach(element => {
                        $scope.Scanmodel.packQty = $scope.model.packQty + element.packTotalQty;
                    });

                }
                pageLoading.show();
                viewModel.scanBarcode($scope.Scanmodel).then(
                    function success(res) {
                        debugger
                        if (res.data.msg == 'กรุณาตรวจสอบบาร์โค้ด') {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msg
                            })
                        }
                        else if (res.data.msg == 'จำนวนเกิดไม่สามารถ Scan ได้') {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msg
                            })
                        }
                        else {
                            if ($scope.itemScan.length != 0) {

                                var x = $scope.itemScan.filter(c => c.ref_DocumentItem_Index == res.data.barcode[0].ref_DocumentItem_Index)
                                if (x.length > 0) {
                                    x.forEach(element => {
                                        element.packQty = res.data.barcode[0].packQty;
                                        element.packTotalQty = res.data.barcode[0].packTotalQty;
                                    });

                                }
                                else {
                                    $scope.itemScan.push(res.data.barcode[0]);
                                    $scope.chkscan = true;
                                }
                            }
                            else {
                                $scope.itemScan.push(res.data.barcode[0]);
                                $scope.chkscan = true;
                            }
                        }
                    },
                    function error(response) {
                        $scope.model = {};
                    });
            }
            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }
            $scope.pageMode = 'Master';

            $scope.checkbox = {
                Show: true
            };
            $scope.detectCheckAll = function () {

                if ($scope.checkAll === true) {
                    $scope.checkAll = false;
                    angular.forEach($scope.packReceiveModel, function (v, k) {
                        $scope.packReceiveModel[k].selected = false;

                    });
                } else {
                    $scope.checkAll = true;
                    angular.forEach($scope.packReceiveModel, function (v, k) {
                        $scope.packReceiveModel[k].selected = true;
                    });
                }
            }

            $scope.clearpack = function () {
                $scope.itemScan = [];
                a = 0
                $scope.chkscan = false;
            }

            $scope.closepack = function () {
                $scope.modelPack;
                $scope.modelPack.packSize = $scope.model.packSize;
                $scope.modelPack.listPackItemViewModel = $scope.itemScan;
                $scope.modelPack.create_by = $scope.userName;
                if ($scope.itemScan.length != 0) {
                    pageLoading.show()
                    viewModel.CreatePackHeader($scope.modelPack).then(
                        function success(res) {
                            $scope.Scanmodel.pack_Index = res.data.pack_Index;
                            modelItem.planGoodsIssue_Index = res.data.ref_Document_Index;
                            modelItem.ref_Document_Index = res.data.ref_Document_Index;
                            if (res.data.message == "จำนวนเกินไม่สามารถทำการ แพ๊คสินค้าได้") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Pick up',
                                    message: res.data.message
                                });
                                return;
                            }
                            else {
                                viewModel.selectItem(modelItem).then(
                                    function success(res) {
                                        
                                        $scope.filterModelItems = res.data.listitems
                                        viewModel.findPackItem(modelItem).then(
                                            function success(res) {
                                                $scope.packReceiveModel = res.data;
                                                
                                                $scope.print($scope.Scanmodel.pack_Index);
                                                $scope.filterPack($scope.modelPack);
                                                $scope.filterSum($scope.modelPack);

                                            },
                                            function error(response) {
                                                $scope.model = {};
                                            });
                                    },
                                    function error(response) {
                                        $scope.model = {};
                                    });
                            }

                        },
                        function error(response) {
                            $scope.model = {};
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Pick up',
                        message: 'Please Scan Barcode'
                    });
                    return;
                }
            }


            $scope.deletechk = function (param, index) {
                angular.forEach($scope.itemScan, function (v, k) {
                    if ($scope.itemScan[k].selected == true) {
                        var index = $scope.itemScan.findIndex(c => c.selected == true);
                        $scope.itemScan.splice(index, 1)
                    }
                });

                if ($scope.itemScan.length == 0) {
                    $scope.chkscan = false;
                }
            }

            $scope.CheckAll = function () {
                if ($scope.checkAll === true) {
                    $scope.checkAll = false;
                    angular.forEach($scope.itemScan, function (v, k) {
                        $scope.itemScan[k].selected = false;

                    });
                } else {
                    $scope.checkAll = true;
                    angular.forEach($scope.itemScan, function (v, k) {
                        if ($scope.itemScan[k].selected == true) {
                            a = $scope.itemScan[k].index();
                        }
                    });
                }
            }

            $scope.check = function (param) {
                $scope.filterModelItems.items = {};
                $scope.filterModel.pack_No = "";
                $scope.btnPrint = false;
                $scope.btnDelete = false;
                for (let index = 0; index < $scope.filterModel.items.length; index++) {
                    if (index != param) {
                        $scope.filterModel.items[index].check = false;
                    }
                    else {
                        var model = $scope.filterModel.items[index];
                        if ($scope.filterModel.items[index].check == true) {
                            $scope.filterModel.pack_No = model.pack_No;
                            viewModel.getPackItem(model).then(
                                function success(res) {
                                    $scope.filterModelItems.items = res.data;
                                    $scope.btnPrint = true;
                                    $scope.btnDelete = true;
                                },
                                function error(response) {
                                    $scope.model = {};
                                });
                        }
                    }
                }
            };

            $scope.print = function (data) {
                var modelPack = {};
                pageLoading.show()
                modelPack.pack_Index = data;
                viewModel.printPack(modelPack).then(
                    function success(res) {
                        $scope.popupReport.onClick(res);
                    },
                    function error(response) {
                        $scope.model = {};
                    });

            }


            $scope.IsDeletePack = function (data) {
                $scope.modelPack.pack_No = data.pack_No;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Delete Pack ?'
                }).then(function success() {
                    viewModel.deleteIsPack(data).then(function (res) {
                        
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Close Document',
                            message: res.data.msg
                        });

                        $scope.filterPack($scope.modelPack);
                        $scope.filterSum($scope.modelPack);
                    }, function error(res) { });
                });

            }



            $scope.filterPack = function (data) {
                viewModel.filterPack(data).then(
                    function success(res) {
                        $scope.filterModelItems2 = res.data;
                    },
                    function error(response) {
                        $scope.model = {};
                    });

            }

            $scope.filterSum = function (data) {
                
                viewModel.filterSum(data).then(
                    function success(res) {
                        $scope.filterModelItemsSum = res.data;
                    },
                    function error(response) {
                        $scope.model = {};
                    });

            }


            $scope.delete = function (data) {
                var validateChk = "";
                for (let index = 0; index < $scope.packReceiveModel.length; index++) {
                    if ($scope.packReceiveModel[index].selected) {
                        validateChk = validateChk + ' ' + $scope.packReceiveModel[index].pack_No;
                    }
                }

                if (validateChk == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Close Document',
                        message: 'Please choose pack No'
                    });
                    return;
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'Do you want to Delete Pack ?'
                    }).then(function success() {
                        pageLoading.show();
                        var m = {};
                        // m = param;
                        m.listPackItemViewModel = [];
                        for (let index = 0; index < $scope.packReceiveModel.length; index++) {
                            if ($scope.packReceiveModel[index].selected)

                                m.listPackItemViewModel.push($scope.packReceiveModel[index]);
                        }
                        m.cancel_By = $scope.userName;
                        // pageLoading = true;
                        viewModel.deletePack(m).then(
                            function success(res) {
                                modelItem.planGoodsIssue_Index = res.data.planGoodsIssue_Index;
                                modelItem.ref_Document_Index = res.data.planGoodsIssue_Index;
                                viewModel.selectItem(modelItem).then(
                                    function success(res) {
                                        $scope.filterModelItems = res.data.listitems
                                        viewModel.findPackItem(modelItem).then(
                                            function success(res) {
                                                $scope.packReceiveModel = res.data;
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'Delete Pack',
                                                    message: 'Delete pack success.'
                                                });
                                                pageLoading.hide()
                                            },
                                            function error(response) {
                                            });
                                    },
                                    function error(response) {
                                    });
                            },
                            function error(response) {
                            });
                    });
                }
            }


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
                    selected: function (param) {
                    }
                }
            };

            $scope.popupPackProduct = {
                onShow: false,
                delegates: {},
                onClick: function (packScan) {
                    $scope.popupPackProduct.onShow = !$scope.popupPackProduct.onShow;
                    $scope.popupPackProduct.delegates.productLineitemPopup(packScan);

                },
                config: {
                    title: "Product LineItem"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if (param.close == true) {

                        }
                        else {
                            $scope.ScanBarcode(param);
                        }
                    }
                }
            };

            $scope.back = function () {
                $scope.isLoading = false;
                $scope.btnPrint = false;
                $scope.btnDelete = false;
                // $vm.isFilterTable = true;
                $scope.filterModel = {};
                $scope.Scanmodel = {};
                $scope.filterModelItems = [];
                $scope.itemScan = [];
                $scope.model.productBarcode = "";
                defer.resolve();
            }

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
            };
            init();
        }

    })
})();