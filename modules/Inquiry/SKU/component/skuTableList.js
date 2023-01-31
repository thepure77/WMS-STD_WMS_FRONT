'use strict'
app.component('skuTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/SKU/component/skuTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        isStock: '=?',
        isProductConversion: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquirySkuFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        // var viewModel = ;
        // setting column
        var viewModel = inquirySkuFactory;

        $scope.clearCheck = function (param) {
            
            for (let index = 0; index < $vm.searchResultModel.length; index++) {

                if (index != param)
                    $vm.searchResultModel[index].selected = false;
            }
        }


        $scope.select = function (param) {

            
            var item = param.filter(c => c.selected);

            if ($vm.providers.invokes)
                $vm.providers.invokes.set(item);

            $vm.isFilter = true;

            // defer.resolve(item);
        }


        $vm.$onInit = function () {

        }

        $vm.productConversion = function (param) {
            var item = param.filter(c => c.selected);

            if (item.length == 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information',
                    message: 'กรุณาติ๊กเลือกก่อนกด Action'
                })
            }
            else {            
                $vm.isFilter = false;
               $scope.isLoading(item).then(function (result) {
                    $vm.isFilter = true;
                    $scope.ddl = "";
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $vm.stockdetail = function (param) {
            var item = param.filter(c => c.selected);

            if (item.length == 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information',
                    message: 'กรุณาติ๊กเลือกก่อนกด Action'
                })
            }
            else {            
                
                $vm.isFilter = false;
               $scope.isStock(item).then(function (result) {
                    $vm.isFilter = true;
                    $scope.ddl = "";
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
            
        }

        $vm.allocated = function (param) {
            var item = param.filter(c => c.selected);

            if (item.length == 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information',
                    message: 'กรุณาติ๊กเลือกก่อนกด Action'
                })
            }
            else {            
                $vm.isFilter = false;
               $scope.isAllocated(item).then(function (result) {
                    $vm.isFilter = true;
                    $scope.ddl = "";
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
            
        }

        $scope.getColour = function (param) {
            if (param == '1' || param == '-1')
                return '#C6C0C0';
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }

        $scope.changeTableSize = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 5,
            perPage: $vm.filterModel.perPage,
        };

        $scope.changePage = function () {
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
                viewModel.search(data).then(function (res) {
                    pageLoading.hide();
                    
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data.items;

                    }
                    else {
                        
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.items;

                        }
                    }
                })
            }
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


        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        $scope.exportExcelFile = {

            ExportExcelSKU: function () {
                dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                }).then(function success() {
                    // var item = $vm.searchResultModel;
                    ExportExcelSKU();
                });
            },
        }

        function ExportExcelSKU() {
            var item = angular.copy($vm.searchResultModel);
            var model = {};

            model = { 'listInquirySKU': $vm.searchResultModel };

            
            let dataList = model.listInquirySKU;
            for (var i = 0; i <= dataList.length - 1; i++) {
                model.listInquirySKU[i].rowIndex = i + 1
                model.listInquirySKU[i].Type = 'SKU';
            }

            var deferred = $q.defer();
            
            viewModel.ExportSKU(model).then(
                function success(results) {
                    $vm.triggerSearch
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

        $scope.ddlClick = function()
        {
            $scope.ddl = $scope.ddl == "" ? "open" : "";
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.ddl = "";
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});