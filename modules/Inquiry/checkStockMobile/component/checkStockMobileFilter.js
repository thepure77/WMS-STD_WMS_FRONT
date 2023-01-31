(function () {
    'use strict';
    app.component('checkStockMobileFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Inquiry/checkStockMobile/component/checkStockMobileFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataLocation: '=?',
            filterModelLo: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, checkStockMobileFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = checkStockMobileFactory;
            var model = $scope.filterModel;
            $vm.filterModelLo = {
                currentPage: 1,
                //perPage: 10,
                totalRow: 0,
                advanceSearch: false,
            };
            //$vm.IsVisible = false;

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
                pageLoading.show();

                // viewModel.mobileFilterByLocation($vm.filterModelLo).then(function (res) {
                //     pageLoading.hide();
                //     if (res.data.itemsStockLo.length != 0) {
                //         $vm.filterModelLo.perPage = $vm.filterModelLo.perPage;
                //         $vm.filterModelLo.totalRow = res.data.pagination.totalRow;

                //         if (res.data.pagination != null || res.data.pagination != undefined) {
                //             $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                //         }
                //         $vm.searchDataLocation = res.data.itemsStockLo;
                //     }
                //     else {
                //         $vm.searchDataLocation = res.data.itemsStockLo;
                //     }
                //     $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                // });
            };


            $scope.searchFilter = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage; 
                $scope.filterModel.isExportByProduct = false;
                $scope.filterModel.isExportByLocation = false;
                
                if ($scope.filterModel.actionProduct == 1) {
                    $scope.filterModel.location_Name = undefined
                    $scope.filterModel.tag_No = undefined
                }

                if ($scope.filterModel.actionProduct == 2) {
                    $scope.filterModel.product_Id = undefined
                    $scope.filterModel.tag_No = undefined
                }

                if ($scope.filterModel.actionProduct == 3) {
                    $scope.filterModel.product_Id = undefined
                    $scope.filterModel.location_Name = undefined
                }

                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
                }
                if ($scope.filterModel.Mfgdate != null) {
                    $scope.convertDate();
                }
                if ($scope.filterModel.Expdate != null) {
                    $scope.convertDate();
                }


                pageLoading.show();

                viewModel.mobileFilterByLocation($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    // $vm.filterModelLo ={};
                    if(res.data.resultIsUse){
                        if (res.data.itemsStockLo.length != 0) {
                            $vm.filterModelLo.perPage = $vm.filterModel.perPage;
                            $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
    
                            $vm.filterModelLo.currentPage = res.data.pagination.currentPage;
    
                            if (res.data.pagination != null || res.data.pagination != undefined) {
                                $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                            }
                            $vm.searchDataLocation = res.data.itemsStockLo;
                        }
                        else {
                            $vm.searchDataLocation = res.data.itemsStockLo;
                        }
                        $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.resultMsg
                        })
                    }
                    

                });
            };


            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $window.scrollTo(0, 0);
            }

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
                if ($scope.filterModel.Mfgdate != null) {
                    var str = $scope.filterModel.Mfgdate;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_MFG_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_MFG_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
                if ($scope.filterModel.Expdate != null) {
                    var str = $scope.filterModel.Expdate;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_EXP_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_EXP_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }

            };


            // ----------------------------------------------------
            // This local function

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
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


            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            $scope.autoComplete = {
                ownerId: "PickBinbalance/AutoCompleterOwnerId",
                ownerName: "PickBinbalance/AutoCompleterOwnerName",
                sku: "PickBinbalance/AutoCompleteProductId",
                product: "PickBinbalance/AutoCompleteProductName",
                GR: "PickBinbalance/AutoCompleterGR",
                Tag: "PickBinbalance/AutoCompleterTag",
                productType: "PickBinbalance/AutoCompleteProductType",
                zone: "PickBinbalance/autoZonefilter",
                location: "PickBinbalance/autoLocationFilter",
                itemStatu: "PickBinbalance/autoItemStatus",

            };

            $scope.url = {
                BinBalance: webServiceAPI.BinBalance,
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                // $scope.dropdownProductType();
                // $scope.dropdownItemStatus();
                // $scope.dropdownZone();
                // $scope.dropdownLocation();

            };

        }
    });

})();