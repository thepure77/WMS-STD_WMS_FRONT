(function () {
    'use strict';
    app.component('productFilterV2', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductV2/component/productFilterV2.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, productFactoryV2, productConversionFactory, productOwnerFactory, ownerFactory, webServiceAPI, importFileMasterFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var viewModel = productFactoryV2;
            var viewModelConversion = productConversionFactory;
            var viewModelProductOwner = productOwnerFactory;
            var viewModelOwner = ownerFactory;

            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $scope.exportModel = {};
            $scope.header = {
                advanceSearch: false
            };
            $scope.clearFilter = function () {
                $scope.filterModel = {};
                $scope.searchFilter();
                $scope.exportModel = {};
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsProduct;
                    } else {
                        $vm.searchResultModel = res.data.itemsProduct;
                    }
                });
            };

            $scope.searchFilter = function (param) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;

                        }

                        $vm.searchResultModel = res.data.itemsProduct;
                    } else {

                        $vm.searchResultModel = res.data.itemsProduct;
                    }
                });
            };

            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                product: "Autocomplete/autoSearchProduct",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            $scope.import = function () {
                importFileMasterFactory.set("Import_Article");
                $state.go('wms.import_file_master_summary');
            }
            // $scope.filterModel;

            // $vm.triggerSearch = function () {

            //     $vm.filterModel =  $vm.filterModel || {};                
            //     pageLoading.show();  
            //     viewModel.filter($vm.filterModel).then(function (res) {

            //         pageLoading.hide();
            //         if (res.data.length != 0) {
            //             $scope.filterModel = $vm.filterModel;
            //             $scope.filterModel.perPage = $vm.filterModel.perPage;
            //             $vm.filterModel.totalRow = res.data.length;

            //             if (res.data.pagination != null || res.data.pagination != undefined) {
            //                 $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             }                  

            //             $vm.searchResultModel = res.data.itemsProduct;                    
            //         }
            //         else {

            //             $vm.searchResultModel = res.data.itemsProduct;
            //         }
            //     });
            // };

            // $scope.model = {
            //     productId: "",
            //     productName: "",    
            //     productTypeName: "",        
            //     currentPage: 1,
            //     numPerPage: 30,
            //     PerPage: 30,
            //     totalRow: 0,      
            // };

            // $scope.searchFilter = function (item) {

            //     var deferred = $q.defer();
            //     if(item == undefined){
            //         item = $scope.model;
            //     };
            //     if(item.productId == "" || item.productName == "" || item.productTypeName == ""){
            //         item = $scope.model;
            //     }
            //     viewModel.search(item).then(
            //         function success(res) {                        
            //             pageLoading.hide();
            //             if(res.data.itemsProduct.length <= 10){
            //                 $vm.filterModel.totalRow = 30;
            //             }
            //             else if(res.data.itemsProduct.length > 0){
            //                 $vm.filterModel.totalRow = res.data.itemsProduct.length;
            //             }
            //             else{
            //                 $vm.triggerSearch();                            
            //             }
            //             if(res.data.pagination.perPage == 0){
            //                 $vm.filterModel.perPage = 30;
            //             } 
            //             $vm.searchResultModel = res.data.itemsProduct;
            //             // $vm.filterModel = res.data;
            //             // $vm.searchResultModel = res.data.itemsProduct;
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         });
            //     return deferred.promise;
            // };
            // $scope.filter = function () {

            //     $vm.triggerSearch();
            // };

            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }
            
            function initialize() {
            };

            $scope.export = function () {
                pageLoading.show();
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.PerPage = 0;
                viewModel.Export($scope.exportModel).then(function (res) {
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsProduct;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns */
                        var xlsHeader = ["Product ID", "Product Name","Business Unit","Temp Condition", "BU Unit", "Sale Unit", "In Unit", "Unit", "Ratio", "Weight", "GrsWeight", "W", "L", "H", "TI", "HI","Shelft Life(Days)","Shelf Life GR","Shelf Life alert","Shelf Life GI", "IsPiecePick", "Ref_No1", "Ref_No2", "Create By","Create Date","Update By","Update Date"];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "Product ID": e.product_Id,
                                "Product Name": e.product_Name,
                                "Business Unit":e.businessUnit_Name,
                                "Temp Condition":e.tempCondition_Name,
                                "BU Unit": e.bu_Unit,
                                "Sale Unit": e.sale_Unit,
                                "In Unit": e.in_Unit,
                                "Unit": e.unit,
                                "Ratio": e.ratio,
                                "Weight": e.weight,
                                "GrsWeight": e.grsWeight,
                                "W": e.w,
                                "L": e.l,
                                "H": e.h,
                                "TI": e.ti,
                                "HI": e.hi,
                                "Shelft Life(Days)":e == "undefined" ? "" : "",
                                "Shelf Life GR":e == "undefined" ? "" : "",
                                "Shelf Life alert":e.shelfLeft_alert,
                                "Shelf Life GI":e == "undefined" ? "" : "",
                                "IsPiecePick": e.isPiecePick,
                                "Ref No1": e.ref_No1,
                                "Ref No2": e.ref_No2,
                                "Create By":e.create_By,
                                "Create Date":e.create_Date,
                                "Update By":e.update_By,
                                "Update Date":e.update_Date,
                            });
                            number++
                        });

                        var today = new Date();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getUTCFullYear();
                        var dd = today.getDate();
                        var Minute = today.getMinutes();
                        var Hour = today.getHours();

                        if (Minute < 10) Minute = '0' + Minute;

                        if (dd < 10) dd = '0' + dd;
                        if (mm < 10) mm = '0' + mm;

                        var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                        createXLSLFormatObj.push(xlsHeader);
                        $.each(xlsRows, function (index, value) {
                            var innerRowData = [];
                            $.each(value, function (ind, val) {
                                innerRowData.push(val);
                            });
                            createXLSLFormatObj.push(innerRowData);
                        });
                        pageLoading.hide();
                        JSONToCSVConvertor(createXLSLFormatObj, "Master_Product");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsProduct;
                    }
                });


            }

            function JSONToCSVConvertor(JSONData, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = '';

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                var Minute = today.getMinutes();
                var Hour = today.getHours();

                if (Minute < 10) Minute = '0' + Minute;

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();
                //Generate a file name
                var fileName = ShowLabel + "_" + datetime;
                //this will remove the blank-spaces from the title and replace it with an underscore

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


            this.$onInit = function () {
                viewModel.set();
                viewModelConversion.set();
                viewModelProductOwner.set();
                viewModelOwner.set();
                initialize();
            };

            this.$onDestroy = function () {};

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();