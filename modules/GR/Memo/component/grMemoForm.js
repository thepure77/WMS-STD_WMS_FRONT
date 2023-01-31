(function () {
    'use strict';
    app.component('grMemoForm', {
        controllerAs: '$vm',
        templateUrl: function () {
            return "modules/GR/Memo/component/grMemoForm.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $state, $window, pageLoading, localStorageService, dpMessageBox, commonService, goodsReceiveFactory, MemoFactory, webServiceAPI) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = MemoFactory;
            var _viewModel = goodsReceiveFactory;
            var model = $scope.filterModel;
            $scope.find = 0;
            $scope.sum = 0;

            //-------------------------------------------------------------
            $scope.addDetailItem = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.addDetailItem.onShow = !$scope.addDetailItem.onShow;
                    if (param) {
                        param.rowItemIndex = index;
                    }
                    $scope.addDetailItem.delegates(param);
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

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModels).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                    // $scope.find = 1;
                });
            };

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
                $scope.sum = 1;
            }

            this.$onInit = function () {
                $scope.model = {};
                $scope.modelDefault = {};
                $scope.formData = {};
                $scope.filterModel = {};
                $scope.filterModels = {};
                $scope.filterItemsModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownDocumentType();
                let item = _viewModel.getParam();
                let itemData = _viewModel.getData();
                _viewModel.setParam(undefined);
                _viewModel.setDate(undefined);
                $scope.item = item;
                $scope.itemData = itemData;
                $scope.filterModel = undefined;
                $scope.model.Index = $scope.item;
                $scope.modelDefault = $scope.itemData;
                if ($scope.model.Index != undefined) {
                    $scope.filterMEMO($scope.model, $scope.modelDefault);
                }
            };

            $scope.filterMEMO = function (param, data) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.model = param;
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if ($scope.model != undefined) {
                    pageLoading.show();
                    viewModel.filterMEMO($scope.model).then(function (res) {
                        if (res.data.memo_No == null) {
                            $scope.filterModel.ref_Document_No = data.goodsReceive_No;
                            $scope.filterModel.index = data.goodsReceive_Index;
                            $scope.filterModel.owner_Index = data.owner_Index;
                            $scope.filterModel.owner_Id = data.owner_Id;
                            $scope.filterModel.owner_Name = data.owner_Name;
                            $scope.filterModel.memo_Date = getToday();
                            $scope.filterModel.total_amount = 0;
                        } else {
                            debugger
                            pageLoading.hide();
                            $scope.filterModel = res.data;
                            pageLoading.show();
                            viewModel.filterMEMOItem($scope.filterModel.memo_Index).then(function (res) {
                                $scope.filterModel.listItemViewModels = res.data
                                $scope.sum = 1;
                                // $scope.filterModel.documentType_Index = res.data.documentType_Index;
                                $scope.find =1 ;
                            }, function error(response) {
                                pageLoading.hide();
                            });
                        }
                    }, function error(response) {
                        pageLoading.hide();
                    });
                }
            };

            $scope.$watch("find", function () {
                if ($scope.find == 1) {
                    var documentType = $scope.dropdownDocumentType
                    const resultsDocumentType = documentType.filter((documentType) => {
                        return documentType.documentType_Index == $scope.filterModel.documentType_Index;
                    })
                    $scope.dropdownDocumentType.model = resultsDocumentType[0];
                    $scope.find = 0;
                }
            });

            $scope.$watch("sum", function () {
                if ($scope.sum == 1) {
                    $scope.amount = 0;
                    for (let index = 0; index < $scope.filterModel.listItemViewModels.length; index++) {
                        $scope.amount = parseInt($scope.amount) + parseInt($scope.filterModel.listItemViewModels[index].amount);
                    }
                    $scope.filterModel.total_amount = $scope.amount;
                    $scope.sum = 0;
                }
            });

            $scope.addDetailItem = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.addDetailItem.onShow = !$scope.addDetailItem.onShow;
                    if (param) {
                        param.rowItemIndex = index;
                    }
                    $scope.addDetailItem.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listItemViewModels == undefined) {
                            $scope.filterModel.listItemViewModels = $scope.filterModel.listItemViewModels || []
                            $scope.filterModel.listItemViewModels.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listItemViewModels[param.rowItemIndex] = param;
                        }
                        else {
                            $scope.filterModel.listItemViewModels.push(angular.copy(param));
                        }
                        let dataList = $scope.filterModel.listItemViewModels;
                        for (var i = 0; i <= dataList.length - 1; i++) {
                            $scope.filterModel.listItemViewModels[i].qty = $scope.filterModel.listItemViewModels[i].qty.toFixed(2);
                            $scope.filterModel.listItemViewModels[i].qty = parseFloat($scope.filterModel.listItemViewModels[i].qty);
                        }
                        $scope.sum = 1;
                    }
                }
            };

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.add = function () {
                if (!$scope.filterModel.memo_Date) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือกวันที่สร้างเอกสาร!'
                        }
                    )
                    return "";
                }

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
                if ($scope.filterModel.listItemViewModels == undefined || $scope.filterModel.listItemViewModels.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Error: Add at least 1 Item !'
                        }
                    )
                    return "";
                }

                var model = $scope.filterModel;
                model.userAssignKey = $window.localStorage['userGuidPlanReceive'];
                model.create_by = localStorageService.get('userTokenStorage');
                model.Process = "5F147725-520C-4CA6-B1D2-2C0E65E7AAAA";
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    viewModel.add(model).then(
                        function success(res) {
                            if (res.data == "true") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'บันทึกสำเร็จ',
                                    message: ' บันทึกสำเร็จ '
                                })
                                $scope.back();

                            } else {
                                dpMessageBox.alert({
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่สามารถบันทึกข้อมูลได้'
                                })
                            }
                        },
                        function error(response) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'ไม่สามารถบันทึกข้อมูลได้'
                                }
                            )
                        }
                    );
                }, function error(param) {
                });
            };

            $scope.back = function () {
                $state.go('wms.gr_summary', {});
            }

            $scope.url = {
                BinBalance: webServiceAPI.BinBalance,
            };
        }
    });

})();