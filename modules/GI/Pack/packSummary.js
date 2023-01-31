(function () {
    'use strict'

    app.component('packSummary', {
        controllerAs: '$vm',
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/Pack/packSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, packFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = packFactory;
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.isFilter = true;
            $scope.Scanmodel = {};
            $scope.Closemodel = {};
            // $scope.filterModel = {
            //     currentPage: 0,
            //     PerPage: 30,
            //     totalRow: 0,
            //     key: '',
            //     advanceSearch: false,
            //     showError: false,
            //     chkinitpage: false,
            //     maxSize: 10,
            //     num: 1,
            // };



            $vm.triggerPickDetails = function () {
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading().then(function (result) {
                        $vm.isFilterTable = true;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }

            };

            $scope.editItem = function (param) {
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param).then(function (result) {
                        $vm.isFilterTable = true;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }

            };

            $scope.changePage = function () {
                var page = $scope.model;
                var all = {
                    currentPage: 0,
                    numPerPage: 0
                };
                if ($scope.model.currentPage != 0) {
                    page.currentPage = page.currentPage;
                }
                $scope.filterSearch(page);
            }

            // $vm.filterModel = {
            //     currentPage: 1,
            //     perPage: 50,
            //     totalRow: 0,
            //     advanceSearch: false,
            // };

            $scope.filterSearch = function (param) {
                pageLoading.show();
                var model = $scope.model;
                // model.key = 'PIN20010901'
                viewModel.search(model).then(
                    function success(res) {
                        $scope.model.planGoodsIssue_No = "";
                        $scope.model.size = "";
                        $scope.model.totalRow = res.data.pagination.totalRow;
                        $scope.model.currentPage = res.data.pagination.currentPage;
                        $scope.model.perPage = res.data.pagination.perPage;
                        $scope.filterModel = res.data.items;
                        pageLoading.hide();

                    },
                    function error(response) {
                        $scope.model = {};
                    });
            }

            $scope.select = function (data) {
                var modelItem = {};
                modelItem.planGoodsIssue_Index = data.planGoodsIssue_Index;
                modelItem.ref_Document_Index = modelItem.planGoodsIssue_Index;
                $scope.modelPlan = {};
                $scope.modelPlan.planGoodsIssue_Index = modelItem.planGoodsIssue_Index;
                pageLoading.show();
                viewModel.selectItem(modelItem).then(
                    function success(res) {
                        $scope.filterItemModel = res.data.listitems
                        viewModel.findPackItem(modelItem).then(
                            function success(res) {
                                $scope.itemScan = res.data;
                                if ($scope.isLoading) {
                                    $vm.isFilterTable = false;
                                    $scope.isLoading(data, $scope.filterItemModel, $scope.itemScan).then(function (result) {
                                        $vm.isFilterTable = true;
                                    }).catch(function (error) {
                                        defer.reject({ 'Message': error });
                                    });
                                }
                            },
                            function error(response) {
                                $scope.model = {};
                            });
                    },
                    function error(response) {
                        $scope.model = {};
                    });
            }
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }
            $scope.model = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0
            };

            $scope.changeTableSize = function (perPage, tab) {
                if (tab == 1) {
                    $scope.colortab1 = "#0088cc";
                    $scope.colortab2 = "#FFFFFF";
    
                    $scope.fronttab1 = "#FFFFFF";
                    $scope.fronttab2 = "#0088cc";
    
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#FFFFFF";
                    $scope.colortab2 = "#0088cc";
    
                    $scope.fronttab1 = "#0088cc";
                    $scope.fronttab2 = "#FFFFFF";
                }

                $scope.selected = tab;

                let ChangeTable = 1;
                // $scope.model = $vm.filterModel;
                if (perPage != null || perPage != undefined) {
                    $scope.model.perPage = perPage;
                }

                var p = $scope.model;
                $scope.filterSearch(p);
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
                if (tab == 2) {
                    $scope.Closemodel.pack_Index = $scope.itemScan[0].pack_Index;
                    $scope.Closemodel.listPackItemViewModel = $scope.itemScan;
                    $scope.Closemodel.ref_Document_Index = $scope.itemScan[0].ref_Document_Index;
                    // $scope.popupReport.onClick($scope.Closemodel);
                    viewModel.ClosePack($scope.Closemodel).then(
                        function success(res) {
                            // if (res.status === 200) {
                            //     dpMessageBox.alert({
                            //         ok: 'Close',
                            //         title: 'Information.',
                            //         message: "ClosePack Success"
                            //     })
                            // }

                            $scope.filterItemModel = {};
                            $scope.itemScan = {};
                            $scope.model = {};
                            $scope.popupReport.onClick(res);
                            $scope.filterSearch();
                        },
                        function error(response) {
                            $scope.model = {};
                        });
                }
                if (tab == 1) {

                    $scope.modelPlan.create_by = $scope.userName;

                    viewModel.CreatePackHeader($scope.modelPlan).then(
                        function success(res) {
                            $scope.Scanmodel.pack_Index = res.data;
                        },
                        function error(response) {
                            $scope.model = {};
                        });
                }
            }

            $scope.check = function (param) {
                for (let index = 0; index < $scope.filterModel.length; index++) {
                    if (index != param) {
                        $scope.filterModel[index].check = false;
                    }
                }
            }

            $('#activate-step-1').on('click', function (e) {
                $('ul.wizard-steps li:eq(1)').removeClass('disabled');
                $('ul.wizard-steps li a[href="#step-1"]').trigger('click');
            })

            $('#activate-step-2').on('click', function (e) {
                $('ul.wizard-steps li:eq(1)').removeClass('disabled');
                $('ul.wizard-steps li a[href="#step-2"]').trigger('click');
            })

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


            $scope.autoComplete = {
                autoPack: "AutoPack/autoGINo",
            };

            $scope.url = {
                Pack: webServiceAPI.Pack,
            };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterSearch();

            };
            init();
        }
    })
})();