(function () {
    'use strict';
    app.component('poFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/GR/PO/component/poFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, purchaseOrderFactory, webServiceAPI,importFileFactory) {
            var $vm = this;

            // ----------------------------------------------------
            var model = $scope.filterModel;
            var viewModel = purchaseOrderFactory;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };



            $scope.header = {
                advanceSearch: false
            };
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };


            $scope.selectSort = [
                {
                    value: "PlanGoodsReceive_No",
                    display: "PO_NO"
                },
                {
                    value: "PlanGoodsReceive_Date",
                    display: "PLAN_DATE"
                },
                {
                    value: "DocumentType_Name",
                    display: "DOCUMENT_TYPE"
                },
                {
                    value: "ProcessStatus_Name",
                    display: "STATUS"
                },
                {
                    value: "Vendor_name",
                    display: "VENDER"
                }
            ];

            $scope.status = [
                {
                    value: 0,
                    display: "Wait_to_confirm"
                },
                {
                    value: 1,
                    display: "confirm"
                },
                {
                    value: 3,
                    display: "completed"
                },
                {
                    value: 4,
                    display: "Close_document"
                },
                {
                    value: -1,
                    display: "cancel"
                }
            ];

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.purchaseOrder_date = getToday();
                $vm.filterModel.purchaseOrder_date_To = getToday();
                $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
                pageLoading.show();
                viewModel.FilterSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.items.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    }
                    else {
                        $vm.searchResultModel = res.data.items;
                    }
                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;
                });
            };


            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };




            $scope.searchFilter = function (param) {
                if($scope.filterModel.advanceSearch)
                {
                    if($('input[name="datefilterAdv"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilterAdv"]').val();
                    }
                } else {
                    if($('input[name="datefilter"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilter"]').val();
                    }
                }
                var deferred = $q.defer();
                
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }
                pageLoading.show()
                viewModel.FilterSearch($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide()
                        deferred.resolve(res);
                    },
                    function error(response) {
                        pageLoading.hide()
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            $scope.filterSearch = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch
                if ($scope.filterModel.owner_Index == "") {
                    $scope.filterModel.owner_Index = "00000000-0000-0000-0000-000000000000";
                }

                if ($scope.filterModel.purchaseOrder_Index != undefined) {
                    if ($scope.filterModel.purchaseOrder_Index == "" || $scope.filterModel.purchaseOrder_Index.length < 36) //|| $scope.filterModel.purchaseOrder_Index.length < 36
                    {
                        $scope.filterModel.purchaseOrder_Index = "00000000-0000-0000-0000-000000000000";
                    }
                }


                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                } else {
                    $scope.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentType_Id = -99;
                    $scope.filterModel.documentType_Name = "";
                }

                if ($scope.dropdownStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownStatus.model.processStatus_Name;
                } else {
                    $scope.filterModel.processStatus_Index = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.processStatus_Id = -99;
                    $scope.filterModel.processStatus_Name = "";
                }


                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.items;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;

                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;
                }, function error(res) { });
            };

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.filterModel.dateDue = formatDate();
                $scope.dropdownDocumentType.model = {};
                $scope.dropdownStatus.model = {};
                $window.scrollTo(0, 0);
            }

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.purchaseOrder_date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.purchaseOrder_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
                // if ($scope.filterModel.dateDue != null) {
                //     var str = $scope.filterModel.dateDue;

                //     var DStart = str.substring(0, 2);
                //     var MStart = str.substring(5, 3);
                //     var YStart = str.substring(10, 6);

                //     $scope.filterModel.purchaseOrder_due_date = YStart.toString() + MStart.toString() + DStart.toString();

                //     var DEnd = str.substring(15, 13);
                //     var MEnd = str.substring(18, 16);
                //     var YEnd = str.substring(25, 19);

                //     $scope.filterModel.purchaseOrder_due_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                // }

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

                return dd.toString() +"/"+ mm.toString() + "/"+ yyyy.toString() +  " - " + dd.toString() +"/"+ mm.toString() + "/"+ yyyy.toString();;
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

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });


            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };
            $scope.dropdownStatus = function () {
                viewModel.dropdownStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownStatus = res.data;
                });
            };


            $scope.autoComplete = {
                autoPo: "Autocomplete/AutobasicSuggestion",
                autoPoV2: "Autocomplete/autobasicSuggestionPO",
                autoVender: "Autocomplete/autobasicSuggestionVender",
                owner: "Autocomplete/autoOwnerfilter",
                purchaseOrder_No: "Autocomplete/AutocompleteNo",
                warehouse_Name: "Autocomplete/AutoWarehousefilter",
                vendor: "Autocomplete/AutoVenderfilter",
                documentType: "Autocomplete/AutoDocumentTypefilter",
                processStatus: "Autocomplete/AutoStatusfilter",
                user: "Autocomplete/autoUser",
                documentRef: "Autocomplete/autoDocumentRef",
                autobasicSuggestionOwner: "Autocomplete/autobasicSuggestionOwner",
                ownerName: "Autocomplete/AutoOwnerfilterName",

                
            };

            $scope.url = {
                PO: webServiceAPI.PO,
            };

            $scope.import = function(){
                importFileFactory.set("PlanGoodsReceive");
                $state.go('wms.import_file_summary');
            }

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.purchaseOrder_date = getToday();
                $scope.filterModel.purchaseOrder_date_To = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";
                $scope.filterModel.date = formatDate();
                $scope.dropdownDocumentType();
                $scope.dropdownStatus();
            };

        }
    });

})();