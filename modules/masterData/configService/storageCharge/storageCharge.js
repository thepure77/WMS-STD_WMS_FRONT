(function () {
    'use strict'
    app.component('storageCharge', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/masterData/configService/storageCharge/storageCharge.html";
        },
        bindings: {
            onStorage: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            delegates: '=?',
            onShow: '=',
        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, configServiceFactory, webServiceAPI) {
            var $vm = this;
            $scope.onStorage = false;
            var defer = {};
            var viewModel = configServiceFactory;
            $scope.filterModel = {};
            $scope.storageModel = {};
            $scope.maxSize = 2;
            $scope.listServiceWRL = [];
            $scope.listServiceWRLSearch = [];

            $scope.page = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                type: 1
            };

            $scope.header = {
                show: true
            };

            $scope.ShowHeader = function () {
                $scope.header.show = $scope.header.show === false ? true : false;
            };

            $scope.item = {
                show: true
            };

            $scope.ShowItem = function () {
                $scope.item.show = $scope.item.show === false ? true : false;
            };

            $scope.end = {
                chk: false
            };

            $scope.hide = function () {
                $scope.end.chk = $scope.end.chk === false ? true : false;
            };

            $scope.rate1 = {
                chk: false
            };

            $scope.rate1Hide = function () {
                $scope.rate1.chk = $scope.rate1.chk === false ? true : false;
            };


            $vm.onStorage = function (param) {
                // $vm.onShow = false;
                $scope.filterModel = param;
                $scope.end.chk == true;
                $scope.end.selected = true;
                $scope.onStorage = true;
                $scope.rate1.chk = true;
                $scope.rate1.selected = true;
                $scope.storageModel.qtyStart = 0;
                $scope.storageModel.rate = 0;
                $scope.storageModel.minimumrate = 0;
                $scope.storageModel.storageDay = 1;
                $scope.storageModel.freeDay = 0;
                defer = $q.defer();
                document.getElementById("minimumrate").disabled = false;
                document.getElementById("rate").disabled = false;
                document.getElementById("storageDay").disabled = false;
                document.getElementById("freeDay").disabled = false;
                document.getElementById("unitCharge_Name").disabled = false;
                pageLoading.show();
                viewModel.findStorageCharge(param).then(function (res) {
                    var count = res.data.listServiceWRL.length;
                    pageLoading.hideNew(count);
                    $scope.filterModel.listStorage = res.data.listStorage;
                    $scope.listServiceWRL = res.data.listServiceWRL;


                })
                return defer.promise;
            };


            $scope.searchWRL = function (param) {
                var model = {};
                model = param;
                model.currentPage = $scope.page.currentPage;
                model.perPage = $scope.page.perPage;

                pageLoading.show();
                if ($scope.listServiceWRL.length == undefined || $scope.listServiceWRL.length <= 0) {
                    $scope.listServiceWRL = [];
                    model.listServiceWRL = [];
                }
                else
                {
                    model.listServiceWRL = $scope.listServiceWRL;
                }
                viewModel.filterView_WRL(model).then(function (res) {
                    pageLoading.hide();
                    // $scope.listServiceWRL = {};
                    if (res.data.items.length != 0) {
                        $scope.filterModel.totalRow = res.data.pagination.totalRow;
                        $scope.filterModel.currentPage = res.data.pagination.currentPage;
                        $scope.filterModel.perPage = res.data.pagination.perPage;
                        $scope.filterModel.numPerPage = res.data.pagination.perPage;
                        $scope.listServiceWRLSearch = res.data.items;
                    } else {
                        $scope.listServiceWRLSearch = res.data.items;
                    }
                })
            }

            $scope.changePage = function () {
                var page = $scope.filterModel;
                var all = {
                    currentPage: 0,
                    numPerPage: 0
                };
                if ($scope.filterModel.currentPage != 0) {
                    page.currentPage = page.currentPage;
                }
                serchPage(page);
            }

            $scope.changeTableSize = function (perPage, tab) {
                if (tab == 1) {
                    $scope.colortab1 = "#ec7229";
                    $scope.colortab2 = "#FFFFFF";

                    $scope.fronttab1 = "#FFFFFF";
                    $scope.fronttab2 = "#ec7229";

                }
                else if (tab == 2) {
                    $scope.colortab1 = "#FFFFFF";
                    $scope.colortab2 = "#ec7229";

                    $scope.fronttab1 = "#ec7229";
                    $scope.fronttab2 = "#FFFFFF";
                }

                $scope.selected = tab;

                let ChangeTable = 1;
                $scope.model = {};
                $scope.model = $scope.filterModel;
                if (perPage != null || perPage != undefined) {
                    $scope.model.perPage = perPage;
                }

                var p = $scope.model;
                serchPage(p);
            }

            function serchPage(data) {

                if (data != null) {

                    data.listServiceWRL = $scope.listServiceWRL;
                    pageLoading.show();
                    viewModel.filterView_WRL(data).then(function (res) {
                        if (res.data.items.length != 0) {
                            $scope.filterModel.totalRow = res.data.pagination.totalRow;
                            $scope.filterModel.currentPage = res.data.pagination.currentPage;
                            $scope.filterModel.perPage = res.data.pagination.perPage;
                            $scope.filterModel.numPerPage = res.data.pagination.perPage;
                            $scope.listServiceWRLSearch = res.data.items;
                            pageLoading.hide();
                        } else {
                            $scope.listServiceWRLSearch = res.data.items;
                            pageLoading.hide();
                        }
                    })
                }
            }


            $scope.addStorage = function (param) {

                if (param.qtyStart == undefined || param.qtyStart == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_qtyStart'
                        }
                    )
                    return "";
                }

                if (param.minimumrate == undefined || param.minimumrate == null || param.minimumrate <= 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_minimumrate'
                        }
                    )
                    return "";
                }

                if ($scope.end.chk == true) {

                    if ((param.qtyEnd != undefined
                        || param.qtyEnd != null)) {
                            
                        if (param.qtyStart >= param.qtyEnd) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'QtyEnd ต่ำกว่า QtyStart!'
                                }
                            )
                            return "";
                        }
                    }
                }


                if (param.rate == undefined || param.rate == null || param.rate <= 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_rate'
                        }
                    )
                    return "";
                }


                if (param.unitCharge_Name == undefined || param.unitCharge_Name == null || param.unitCharge_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_unitCharge_Name'
                        }
                    )
                    return "";
                }

                if (param.storageDay == undefined || param.storageDay == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_storageDay'
                        }
                    )
                    return "";
                }

                if (param.freeDay == undefined || param.freeDay == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_freeDay'
                        }
                    )
                    return "";
                }

                if ($scope.end.chk == true) {
                    param.isMaxQty = 0;
                }
                else {
                    param.isMaxQty = 1;
                    param.qtyMax = param.qtyStart;
                }

                if ($scope.filterModel.listStorage == undefined) {
                    $scope.filterModel.listStorage = $scope.filterModel.listStorage || []
                    $scope.filterModel.listStorage.push(angular.copy(param));
                    $scope.storageModel = {};

                    if ($scope.end.chk == true) {
                        $scope.storageModel.qtyStart = param.qtyEnd + 1;
                    }
                    else {
                        $scope.storageModel.qtyStart = param.qtyStart + 1;
                    }
                    $scope.storageModel.qtyEnd = "";

                }
                else {
                    $scope.filterModel.listStorage.push(angular.copy(param));
                    $scope.storageModel.unitCharge_Name = param.unitCharge_Name;
                    if ($scope.end.chk == true) {
                        $scope.storageModel.qtyStart = param.qtyEnd + 1;
                    }
                    else {
                        $scope.storageModel.qtyStart = param.qtyStart + 1;
                    }
                    $scope.storageModel.qtyEnd = "";

                }

                if ($scope.filterModel.listStorage.length > 0) {
                    document.getElementById("minimumrate").disabled = true;
                    document.getElementById("rate").disabled = true;
                    document.getElementById("storageDay").disabled = true;
                    document.getElementById("freeDay").disabled = true;
                    document.getElementById("unitCharge_Name").disabled = true;
                }
            }

            $scope.saveStorage = function () {

                if ($scope.dropdownCurrency.model == null || $scope.dropdownCurrency.model == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_Currency'
                        }
                    )
                    return "";
                }
                else {
                    let dataList = $scope.filterModel.listStorage;

                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $scope.filterModel.listStorage[i].currency_Index = $scope.dropdownCurrency.model.currency_Index;
                    }
                }

                if ($scope.listServiceWRL != undefined) {
                    $scope.filterModel.listServiceWRL = $scope.listServiceWRL;

                    // var listServiceWRL = $scope.listServiceWRL.filter(c => c.selected == true)
                    // $scope.filterModel.listServiceWRL = listServiceWRL;
                }

                $scope.filterModel.userName = $scope.userName;
                pageLoading.show();
                viewModel.saveStorage($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: res.data.msg
                        }
                    )
                    $scope.filterModel = {};
                    $scope.listServiceWRLSearch = [];
                    $scope.listServiceWRL = [];
                    $scope.onStorage = false;
                    defer.resolve('1');
                })
            }

            
            $scope.$watch("end.chk", function () {
                if ($scope.end.chk == true) {
                    document.getElementById("qty").disabled = false;

                }
                else{
                    document.getElementById("qty").disabled = true;
                }
            });

            $scope.$watch("dropdownCurrency.model", function () {
                if ($scope.dropdownCurrency.model != undefined) {
                    $scope.filterModel.currency_Index = $scope.dropdownCurrency.model.currency_Index;
                    $scope.filterModel.currency_Id = $scope.dropdownCurrency.model.currency_Id;
                    $scope.filterModel.currency_Name = $scope.dropdownCurrency.model.currency_Name;

                }
            });

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
                if ($scope.filterModel.listStorage.length == 0) {
                    document.getElementById("minimumrate").disabled = false;
                    document.getElementById("rate").disabled = false;
                    document.getElementById("storageDay").disabled = false;
                    document.getElementById("freeDay").disabled = false;
                    document.getElementById("unitCharge_Name").disabled = false;
                }
            }

            $scope.chkAll = function () {
                $scope.checkAll = !$scope.checkAll;
                if ($scope.checkAll === true) {
                    angular.forEach($scope.listServiceWRLSearch, function (v, k) {
                        $scope.listServiceWRLSearch[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.listServiceWRLSearch, function (v, k) {
                        $scope.listServiceWRLSearch[k].selected = false;
                    });
                }
            }

            $scope.chkAll2 = function () {
                $scope.checkAll2 = !$scope.checkAll2;
                if ($scope.checkAll2 === true) {
                    angular.forEach($scope.listServiceWRL, function (v, k) {
                        $scope.listServiceWRL[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.listServiceWRL, function (v, k) {
                        $scope.listServiceWRL[k].selected = false;
                    });
                }
            }

            $scope.selectTo = function () {
                if ($scope.listServiceWRL.length == undefined || $scope.listServiceWRL.length <= 0) {
                    $scope.listServiceWRL = $scope.listServiceWRLSearch.filter(c => c.selected == true)
                    $scope.listServiceWRLSearch = $scope.listServiceWRLSearch.filter(c => c.selected != true)
                }
                else {
                    let dataList = $scope.listServiceWRLSearch.filter(c => c.selected == true)

                    angular.forEach(dataList, function (vv, kk) {
                        $scope.listServiceWRL.push(angular.copy(vv));
                    });
                    $scope.listServiceWRLSearch = $scope.listServiceWRLSearch.filter(c => c.selected != true)
                }

                let dataList = $scope.listServiceWRL;

                for (var i = 0; i <= dataList.length - 1; i++) {
                    $scope.listServiceWRL[i].selected = false;
                }

                $scope.filterModel.listServiceWRL = $scope.listServiceWRL;
                $scope.filterModel.currentPage = $scope.page.currentPage;
                $scope.filterModel.perPage = $scope.page.perPage;
                pageLoading.show();
                viewModel.filterView_WRL($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.items.length != 0) {
                        $scope.filterModel.totalRow = res.data.pagination.totalRow;
                        $scope.filterModel.currentPage = res.data.pagination.currentPage;
                        $scope.filterModel.perPage = res.data.pagination.perPage;
                        $scope.filterModel.numPerPage = res.data.pagination.perPage;
                        $scope.listServiceWRLSearch = res.data.items;
                    } else {
                        $scope.listServiceWRLSearch = res.data.items;
                    }
                })
                $scope.checkAll === false;
            }


            $scope.selectAllTo = function () {

                if ($scope.listServiceWRL.length == undefined || $scope.listServiceWRL.length <= 0) {
                    $scope.listServiceWRL = [];
                    $scope.filterModel.listServiceWRL = [];
                }
                pageLoading.show();
                $scope.filterModel.currentPage = $scope.page.currentPage;
                $scope.filterModel.perPage = $scope.page.perPage;
                viewModel.filterSelectAll($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    let dataList = res.data.items;
                    angular.forEach(dataList, function (vv, kk) {
                        $scope.listServiceWRL.push(angular.copy(vv));
                    });
                    $scope.listServiceWRLSearch = [];
                    $scope.filterModel.totalRow = 0;
                    $scope.filterModel.currentPage = $scope.page.currentPage;
                    $scope.filterModel.perPage =  $scope.page.perPage;
                    $scope.filterModel.numPerPage =  $scope.page.perPage;
                })
            }

            
            $scope.selectAllFrom = function () {
                $scope.filterModel.currentPage = $scope.page.currentPage;
                $scope.filterModel.perPage = $scope.page.perPage;
                pageLoading.show();
                viewModel.filterView_WRL($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.items.length != 0) {
                        $scope.filterModel.totalRow = res.data.pagination.totalRow;
                        $scope.filterModel.currentPage = res.data.pagination.currentPage;
                        $scope.filterModel.perPage = res.data.pagination.perPage;
                        $scope.filterModel.numPerPage = res.data.pagination.perPage;
                        $scope.listServiceWRLSearch = res.data.items;
                    } else {
                        $scope.listServiceWRLSearch = res.data.items;
                    }
                })
                $scope.listServiceWRL = [];
            }


            $scope.selectFrom = function () {

                if ($scope.listServiceWRLSearch.length == undefined || $scope.listServiceWRLSearch.length <= 0) {
                    $scope.listServiceWRLSearch = $scope.listServiceWRL.filter(c => c.selected == true)
                    $scope.listServiceWRL = $scope.listServiceWRL.filter(c => c.selected != true)
                }
                else {
                    let dataList = $scope.listServiceWRL.filter(c => c.selected == true)

                    angular.forEach(dataList, function (vv, kk) {
                        $scope.listServiceWRLSearch.push(angular.copy(vv));
                    });
                    $scope.listServiceWRL = $scope.listServiceWRL.filter(c => c.selected != true)
                }

                let dataList = $scope.listServiceWRLSearch;

                for (var i = 0; i <= dataList.length - 1; i++) {
                    $scope.listServiceWRLSearch[i].selected = false;
                }
            }




            $scope.back = function () {
                $scope.onStorage = false;
                defer.resolve('1');
            }

            $scope.autoComplete = {
                warehouse: "Autocomplete/autoWarehouse",
                autoRoomWH: "Autocomplete/autoRoomWH",
                autoLocationAisle: "Autocomplete/autoLocationAisle",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.dropdownCurrency = function () {
                viewModel.dropdownCurrency($scope.filterModel).then(function (res) {
                    $scope.dropdownCurrency = res.data;

                });
            };


            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownCurrency();
                $scope.selected = 1;

            };
            init();


        }
    })
})();