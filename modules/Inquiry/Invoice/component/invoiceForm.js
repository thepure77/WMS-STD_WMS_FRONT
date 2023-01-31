(function () {
    'use strict'

    app.component('invoiceForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/Invoice/component/invoiceForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, webServiceAPI, invoiceFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = invoiceFactory;
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.header = {
                show: true
            };

            $scope.ShowHeader = function () {
                $scope.header.show = $scope.header.show === false ? true : false;
            };



            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.onShow = true;
                $scope.filterModel = {};
                $scope.filterModel.invoice_Date = getToday();
                $scope.filterModel.due_Date = getToday();
                if (param != undefined) {
                    pageLoading.show();
                    $scope.filterModel = param;
                    var documentType = $scope.dropdownDocumentType
                    const resultsDocumentType = documentType.filter((documentType) => {
                        return documentType.documentType_Index == $scope.filterModel.documentType_Index;
                    })
                    $scope.dropdownDocumentType.model = resultsDocumentType[0];

                    var dropdownCurrency = $scope.dropdownCurrency
                    const resultsDropdownCurrency = dropdownCurrency.filter((dropdownCurrency) => {
                        return dropdownCurrency.currency_Index == $scope.filterModel.currency_Index;
                    })
                    $scope.dropdownCurrency.model = resultsDropdownCurrency[0];

                    $scope.filterModel.new = 0;
                    viewModel.filterInvoiceItem($scope.filterModel).then(function (res) {
                        pageLoading.hide();


                        $scope.filterModel.listInvoice = res.data.listInvoice;
                        $scope.filterModel.listStorage = res.data.listStorage;
                    });

                }
                else {
                    $scope.filterModel.doc_Date = getToday();
                    $scope.filterModel.doc_DateTo = getToday();
                    $scope.filterModel.new = 1;
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage')
                }
                return defer.promise;
            };

            $scope.selectedTabTable = function (t) {
                if (t == 1) {
                    $scope.colortable1 = "#0d449d";
                    $scope.colortable2 = "#D3D3D3";
                    $scope.colortable3 = "#D3D3D3";

                }
                else if (t == 2) {
                    $scope.colortable1 = "#D3D3D3";
                    $scope.colortable2 = "#0d449d"
                    $scope.colortable3 = "#D3D3D3";
                }
                else if (t == 3) {
                    $scope.colortable1 = "#D3D3D3";
                    $scope.colortable2 = "#D3D3D3";
                    $scope.colortable3 = "#0d449d";

                }
                $scope.selectedTable = t;
            }


            $vm.invoiceStorageCharge = function (param) {
                if (!$scope.filterModel.owner_Index) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.doc_Date == "" || $scope.filterModel.doc_DateTo == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_doc_Date'
                        }
                    )
                    return "";
                }

                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading($scope.filterModel).then(function (result) {
                        $vm.isFilterTable = true;

                        if(result.listBinBalanceServiceCharge[0].amount != null)
                        {
                            if(result.listBinBalanceServiceCharge != undefined)
                            {
                                if (result.listBinBalanceServiceCharge.length > 0) {
                                    $scope.filterModel.listBinBalanceServiceCharge = result.listBinBalanceServiceCharge;
                                    pageLoading.show();
                                    viewModel.groupInvoice($scope.filterModel).then(function (res) {
                                        pageLoading.hide();
                                        $scope.filterModel.serviceCharge_Index = result.serviceCharge_Index;
                                        $scope.filterModel.serviceCharge_Id = result.serviceCharge_Id;
                                        $scope.filterModel.serviceCharge_Name = result.serviceCharge_Name;
        
                                        $scope.filterModel.doc_Date = result.doc_Date;
                                        $scope.filterModel.doc_DateTo = result.doc_DateTo;

                                        let dataList = res.data;
                                        for (var i = 0; i <= dataList.length - 1; i++) {
                                            res.data[i].serviceCharge_Index = result.serviceCharge_Index;
                                            res.data[i].serviceCharge_Id = result.serviceCharge_Id;
                                            res.data[i].serviceCharge_Name = result.serviceCharge_Name;
                                        }
                                        if($scope.filterModel.listInvoice != undefined)
                                        {
                                            if($scope.filterModel.listInvoice.length > 0)
                                            {
                                                angular.forEach(res.data, function (vv, kk) {
                                                    $scope.filterModel.listInvoice.push(angular.copy(vv));
                                                });
                                            }
                                        }
                                        else{
                                            $scope.filterModel.listInvoice = $scope.filterModel.listInvoice || []
                                            $scope.filterModel.listInvoice = res.data;
                                        }

                                        pageLoading.show();
                                        viewModel.groupStorage($scope.filterModel).then(function (res) {
                                            pageLoading.hide();
                                            let dataList = res.data;
                                            for (var i = 0; i <= dataList.length - 1; i++) {
                                                res.data[i].serviceCharge_Index = result.serviceCharge_Index;
                                                res.data[i].serviceCharge_Id = result.serviceCharge_Id;
                                                res.data[i].serviceCharge_Name = result.serviceCharge_Name;
                                            }
                                            $scope.filterModel.listStorage = res.data;

                                        });
                                    });
                                }
                            }
                        }

                    })
                    // .catch(function (error) {
                    //     defer.reject({ 'Message': error });
                    // });
                }
            }

            $scope.saveInvoice = function () {
                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_DocumentType'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownCurrency.model != null) {
                    $scope.filterModel.currency_Index = $scope.dropdownCurrency.model.currency_Index;
                    $scope.filterModel.currency_Id = $scope.dropdownCurrency.model.currency_Id;
                    $scope.filterModel.currency_Name = $scope.dropdownCurrency.model.currency_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Currency'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.listInvoice != undefined) {
                    if ($scope.filterModel.listInvoice.length == 0) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'InformaTion',
                            message: 'Please Do StorageCharge Doc. First',
                        })
                        return "";

                    }
                }
                else{
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'InformaTion',
                        message: 'Please Do StorageCharge Doc. First',
                    })
                    return "";
                }
                $scope.filterModel.start_Date = $scope.filterModel.doc_Date;
                $scope.filterModel.end_Date = $scope.filterModel.doc_DateTo;

                pageLoading.show();
                $scope.filterModel.create_By = $scope.userName;
                viewModel.saveInvoice($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: res.data.msg
                        }
                    )
                    defer.resolve('1');
                });
            };

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }

            $scope.deleteItemStorage = function (param, index) {
                param.splice(index, 1);
            }



            // $scope.deleteItem = function () {
            //     dpMessageBox.confirm({
            //         ok: 'ใช่',
            //         cancel: 'ไม่',
            //         title: 'ลบ',
            //         message: 'Do you want to Delete ?'
            //     }).then(function success() {
            //         $scope.filterModel.cancel_By = localStorageService.get('userTokenStorage');
            //         viewModel.deleteInvoiceItem($scope.filterModel).then(function success(res) {
            //             if (res.data == true) {
            //                 dpMessageBox.alert({
            //                     ok: 'OK',
            //                     title: 'InformaTion',
            //                     message: 'Delete success',
            //                 })
            //                 $scope.filterModel.listInvoice = {};
            //                 $scope.filterModel.listStorage = {};
            //                 $scope.filterModel.new = 1;

            //             }
            //         }, function error(res) { });
            //     });
            // };

            $scope.back = function () {
                debugger
                defer.resolve('1');
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

            $scope.autoComplete = {
                owner: "PickBinbalance/AutoCompleterOwnerId",
            };

            $scope.url = {
                BinBalance: webServiceAPI.BinBalance,
            };

            $scope.loadMemo = function () {

                viewModel.loadMemo($scope.filterModel).then(function (res) {
                    if (res.data.length > 0) {
                        // let dataList = res.data;
                        // for (var i = 0; i <= dataList.length - 1; i++) {
                        //     res.data[i].serviceCharge_Index = $scope.filterModel.serviceCharge_Index;
                        //     res.data[i].serviceCharge_Id = $scope.filterModel.serviceCharge_Id;
                        //     res.data[i].serviceCharge_Name = $scope.filterModel.serviceCharge_Name;
                        //     $scope.filterModel.listInvoice = $scope.filterModel.listInvoice || []
                        //     $scope.filterModel.listInvoice.push(angular.copy(res.data[i]));
                        // }
                        $scope.filterModel.listInvoice = $scope.filterModel.listInvoice || []
                        angular.forEach(res.data, function (vv, kk) {
                            $scope.filterModel.listInvoice.push(angular.copy(vv));
                        });
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'InformaTion',
                            message: 'Can not find Data!!',
                        })
                    }
                });
            };

            $scope.dropdownCurrency = function () {
                viewModel.dropdownCurrency($scope.filterModel).then(function (res) {
                    $scope.dropdownCurrency = res.data;
                    $scope.dropdownCurrency.model = $scope.dropdownCurrency[0];
                });
            };
            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.manual = {
                onShow: false,
                delegates: {},
                onClick: function () {

                    $scope.manual.onShow = !$scope.manual.onShow;

                    $scope.manual.delegates($scope.filterModel);
                },
                config: {
                    title: "Manual"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listInvoice == undefined) {
                            $scope.filterModel.listInvoice = $scope.filterModel.listInvoice || []
                            $scope.filterModel.listInvoice.push(angular.copy(param));
                        }
                        else {
                            $scope.filterModel.listInvoice.push(angular.copy(param));

                        }
                    }
                }
            };


                     // Export Excel
                    $scope.exportFile = {

                        ExportStorage: function () {
                            dpMessageBox.confirm({
                                title: 'Confirm.',
                                message: 'Do you want to download?'
                            }).then(function success() {
                                ExportStorage();
                            })
                        },
                    }
        
                    function ExportStorage() {
        
                        var deferred = $q.defer();
                        $scope.filterModel.excelName = $scope.filterModel.invoice_No;
                        viewModel.ExportStorage($scope.filterModel).then(
                            function success(results) {
                                deferred.resolve(results);
                            },
                            function error(response) {
        
                                dpMessageBox.alert({
                                    title: 'Information.',
                                    message: "Connect Service Fail."
                                })
                                deferred.reject(response);
                            }
                        );
                        return deferred.promise;
                    }



            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.selectedTabTable(1);
                $scope.dropdownDocumentType();
                $scope.dropdownCurrency();

                // $scope.selectedTable = 1;
            };
            init();
        }
    })
})();