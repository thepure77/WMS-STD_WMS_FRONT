app.component('rePrintTag', {
    controllerAs: '$vm',
    templateUrl: 'modules/GR/rePrintTag/rePrintTag.html',
    controller: function ($scope, $q, lpnFactory, $state, lpnItemFactory, dpMessageBox, localStorageService, pageLoading, webServiceAPI, rePrintTagFactory, kMessageBox) {
        var $vm = this;
        var defer = {};
        var viewModel = rePrintTagFactory;
        var viewItemModel = lpnItemFactory;

        $vm.isFilterTable = true;
        $scope.chkAll = {};



        $scope.show = {
            pagination: true
        }

        $scope.menu = [{
            "step": "1",
            "active": "active",
            "completed": "",
            "name": "Select item"
        },
        {
            "step": "2",
            "active": "",
            "completed": "",
            "name": "Gen Tag"
        }
        ];

        $scope.checkRePrint = function () {
            $scope.formData = $scope.formData || {};

            $scope.formData.lpnRunning = null;
            $scope.formData.lpnRunningEnd = null;
        }


        $scope.filterSearch = function (param) {
            $scope.filterModel = $scope.filterModel || {};
            $scope.model = param;
            pageLoading.show();
            viewModel.filterTagItem($scope.model).then(function (res) {
                $scope.listTag = res.data;
                // listTag = res.data;

            },
                function error(response) {
                    pageLoading.hide();
                });
        };

        $scope.filterSearchTransfer = function (param) {
            $scope.filterModel = $scope.filterModel || {};
            $scope.model = param;
            pageLoading.show();
            viewModel.filterTagTransfer($scope.model).then(function (res) {
                $scope.listTagTransfer = res.data;
                // listTag = res.data;

            },
                function error(response) {
                    $scope.listTagTransfer = {};
                    pageLoading.hide();
                });
        };

        $scope.clearData = function () {

            $scope.filterModel.PrintNumber = "";
        }

        $scope.printTagPutaway = function (param) {
            var validateChk = "";

            for (let index = 0; index < $scope.listTag.length; index++) {
                if ($scope.listTag[index].selected) {
                    validateChk = validateChk + ' ' + $scope.listTag[index].tag_No;
                }
            }
            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'กรุณาเลือกเลขที่พาเลท'
                });
                return;
            } else {
                pageLoading.show();
                var modelTagP = $scope.listTag.filter(c => c.selected == true)
                $scope.tagModel = $scope.tagModel || {};
                $scope.tagModel.listLPNItemViewModel = modelTagP;
                viewItemModel.PrintReportTagPutaway($scope.tagModel).then(
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

        $scope.printTagPutawayTransfer = function (param) {

            var validateChk = $scope.listTagTransfer.filter(c => c.selected == true)
            if (validateChk.length == 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'กรุณาเลือกเลขที่พาเลท'
                });
                return;
            } else {
                pageLoading.show();
                var modelTagP = $scope.listTagTransfer.filter(c => c.selected == true)
                $scope.tagModel = $scope.tagModel || {};
                $scope.tagModel.listTagPutawayTransferViewModel = modelTagP;
                console.log($scope.tagModel);
                viewModel.printReportTagPutawayTransfer($scope.tagModel).then(
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

        $scope.checkTagItems = function (param, isuse) {
            if ($scope.listTag[param].isCheck == true && $scope.chkAll.checkAllTagItems == false) {
                $scope.listTag[param].isCheck = false;
            } else {
                $scope.listTag[param].isCheck = true;
                $scope.listTag[param].isGenTag = false;
            }
            $scope.listTag[param].isCheck = isuse;
        }

        $scope.detectCheckAllTagItems = function () {

            if ($scope.chkAll.checkAllTagItems === true) {
                angular.forEach($scope.listTag, function (v, k) {
                    $scope.listTag[k].selected = true;
                    $scope.checkTagItems(k, true);
                });
            } else {
                angular.forEach($scope.listTag, function (v, k) {
                    $scope.listTag[k].selected = false;
                    $scope.checkTagItems(k, false);
                });
            }
        }

        $scope.detectCheckAllTagTransfer = function () {
            if ($scope.chkAll.checkAllTagItems === true) {
                angular.forEach($scope.listTagTransfer, function (v, k) {
                    $scope.listTagTransfer[k].selected = true;
                    $scope.checkTagTransfer(k, true);
                });
            } else {
                angular.forEach($scope.listTagTransfer, function (v, k) {
                    $scope.listTagTransfer[k].selected = false;
                    $scope.checkTagTransfer(k, false);
                });
            }
        }
        $scope.checkTagTransfer = function (param, isuse) {
            if ($scope.listTagTransfer[param].isCheck == true && $scope.chkAll.checkAllTagItems == false) {
                $scope.listTagTransfer[param].isCheck = false;
            } else {
                $scope.listTagTransfer[param].isCheck = true;
                $scope.listTagTransfer[param].isGenTag = false;
            }
            $scope.listTagTransfer[param].isCheck = isuse;
        }

        $scope.$watch("model.tag_No", function () {
            if ($scope.model.tag_No == undefined
                || $scope.model.tag_No == null
                || $scope.model.tag_No == "") {
                $scope.model.tag_Index = null;
                $scope.model.tag_No = null;
            }
        });

        $scope.$watch("model.location_Name", function () {
            if ($scope.model.location_Name == undefined
                || $scope.model.location_Name == null
                || $scope.model.location_Name == "") {
                $scope.model.location_Index = null;
                $scope.model.location_Name = null;
            }
        });

        $scope.$watch("model.goodsReceive_No", function () {
            if ($scope.model.goodsReceive_No == undefined
                || $scope.model.goodsReceive_No == null
                || $scope.model.goodsReceive_No == "") {
                $scope.model.goodsReceive_Index = null;
                $scope.model.goodsReceive_No = null;
            }
        });

        $scope.$watch("model.product_Name", function () {
            if ($scope.model.product_Name == undefined
                || $scope.model.product_Name == null
                || $scope.model.product_Name == "") {
                $scope.model.product_Index = null;
                $scope.model.product_Id = null;
                $scope.model.product_Name = null;
            }
        });

        $scope.$watch("model.product_Id", function () {
            if ($scope.model.product_Id == undefined
                || $scope.model.product_Id == null
                || $scope.model.product_Id == "") {
                $scope.model.product_Index = null;
                $scope.model.product_Id = null;
                $scope.model.product_Name = null;
            }
        });



        function validate() {
            let defer = $q.defer();
            let valid = true;

            defer.resolve(valid);

            return defer.promise;
        }

        $scope.autoComplete = {
            GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",
            productName: "GoodsReceive/autoProduct",
            productId: "GoodsReceive/autoSKU",
            autoTag:"LPN/autoTag",
            location:"GoodsReceive/autoLocationFilter",
            GoodsTransferTask_No: "AssignJob/autoGoodTaskTransferNo",
            locationTransfer:"RePrintTag/autoLocationFilter",
            autoTagTransfer:"RePrintTag/autoTagFilter",
            autoGoodsTransfer:"RePrintTag/autoGoodsTransferFilter",
        };


        $scope.url = {
            GR: webServiceAPI.GR,
            GT: webServiceAPI.GT,
        };
        
        $vm.$onInit = function () {
            $scope.formData = {};
            $scope.model = {};
            $scope.userName = localStorageService.get('userTokenStorage');
        }

    }
})