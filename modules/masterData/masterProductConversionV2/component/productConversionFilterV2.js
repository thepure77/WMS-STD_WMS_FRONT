(function () {
    'use strict';
    app.component('productConversionFilterV2', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductConversionV2/component/productConversionFilterV2.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isItem: "=?"
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, productConversionFactoryV2,productFactory,productConversionBarcodeFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = productConversionFactoryV2;
            var viewModelProduct = productFactory;
            var viewModelProductConversionBarcode = productConversionBarcodeFactory;

            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $scope.header = {
                advanceSearch: false
            };
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            $vm.triggerSearch = function() {
                var ProductId = productFactory.get();
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.product_Id = ProductId;
                $scope.filterModel.key = ProductId;
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function(res) {
                    pageLoading.hide();
                    productFactory.set();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsProductConversion;
                    } else {
                        $vm.searchResultModel = res.data.itemsProductConversion;
                    }
                });
            };

            $scope.searchFilter = function(param) {
                $scope.convertDate();
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;
                            $vm.filterModel.create_date = $scope.filterModel.create_date;
                            $vm.filterModel.create_date_to = $scope.filterModel.create_date_to;
                            $vm.filterModel.changeSet = $scope.filterModel.changeSet;

                        }

                        $vm.searchResultModel = res.data.itemsProductConversion;
                    } else {

                        $vm.searchResultModel = res.data.itemsProductConversion;
                    }
                });
            };

            $scope.convertDate = function () {               
              if ($scope.filterModel.dateCreate != null) {
              var str_load = $scope.filterModel.dateCreate;
    
              var DStart_load = str_load.substring(0, 2);
              var MStart_load = str_load.substring(5, 3);
              var YStart_load = str_load.substring(10, 6);
    
              $scope.filterModel.create_date = YStart_load.toString() + MStart_load.toString() + DStart_load.toString();
    
              var DEnd_load = str_load.substring(15, 13);
              var MEnd_load = str_load.substring(18, 16);
              var YEnd_load = str_load.substring(25, 19);
    
              $scope.filterModel.create_date_to = YEnd_load.toString() + MEnd_load.toString() + DEnd_load.toString();
              }                
          };  

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };
            $scope.import = function(){
                importFileMasterFactory.set("Import_ArticleConversion");
                $state.go('wms.import_file_master_summary');
            }

            $scope.autoComplete = {
                productConversion: "Autocomplete/autoSearchProductConversion",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.exportFile = {

                ExportExcel: function () {
                  dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                  }).then(function success() {
                    $scope.export();
                  })
                },
              }
              
              $scope.export = function () {
                  pageLoading.show();
                  $scope.convertDate();
                  $scope.filterModel = $scope.filterModel || {};
                  viewModel.ExportExcel($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    debugger;
                    if (res.data.length != 0) {
                      $vm.ResultModelExcel = res.data.itemsProductConversion;
          
                      var createXLSLFormatObj = [];
                      /* XLS Head Columns */
                      var xlsHeader = [
                        "Row Number",
                        "ProductConversion ID",
                        "ProductConversion Name",
                        "Product Conversion SecondName",
                        "Product ID",
                        "Product Name",
                        "ProductConversion Ratio",
                        "ProductConversion Weight",
                        "ProductConversion Width",
                        "ProductConversion Length",
                        "ProductConversion Height",
                        "ProductConversion Volume",     
                        "Business Unit Id",
                        "Business Unit Name",                   
                        "Ref No1",
                        "Ref No2",
                        "Ref No3",
                        "Ref No4",
                        "Ref No5",
                        "Remark",
                        "Create By",
                        "Create Date",
                        "Update By",
                        "Update Date",
                      ];
          
                      /* XLS Rows Data */
                      var xlsRows = [];
                      var number = 1;
                      debugger;
                      $vm.ResultModelExcel.forEach((e) => {
                        xlsRows.push({
                          "ROW_NUM": e.rowNum,
                          "PRODUCT_CONVERSION_ID": e.productConversion_Id,
                          "PRODUCT_CONVERSION_NAME": e.productConversion_Name,
                          "PRODUCT_CONVERSION_SECOND_NAME": e.productConversion_SecondName,
                          "PRODUCT_ID": e.product_Id,
                          "PRODUCT_NAME": e.product_Name,
                          "PRODUCT_CONVERSION_RATIO": e.productConversion_Ratio,
                          "PRODUCT_CONVERSION_WEIGHT": e.productConversion_Weight,
                          "PRODUCT_CONVERSION_WIDTH": e.productConversion_Width,
                          "PRODUCT_CONVERSION_LENGTH": e.productConversion_Length,
                          "PRODUCT_CONVERSION_HEIGHT": e.productConversion_Height,
                          "PRODUCT_CONVERSION_VOLUME": e.productConversion_Volume,
                          "Business Unit Id" : e.businessUnit_Id,
                          "Business Unit Name" : e.businessUnit_Name,
                          "REF_NO1": e.ref_No1,
                          "REF_NO2": e.ref_No2,
                          "REF_NO3": e.ref_No3,
                          "REF_NO4": e.ref_No4,
                          "REF_NO5": e.ref_No5,
                          "REMARK": e.remark,
                          "Create By": e.create_By,
                          "Create Date": e.create_Date,
                          "Update By": e.update_By,
                          "Update Date": e.update_Date,
                        });
                        number++;
                      });
          
                      var today = new Date();
                      var mm = today.getMonth() + 1;
                      var yyyy = today.getUTCFullYear();
                      var dd = today.getDate();
                      var Minute = today.getMinutes();
                      var Hour = today.getHours();
          
                      if (Minute < 10) Minute = "0" + Minute;
          
                      if (dd < 10) dd = "0" + dd;
                      if (mm < 10) mm = "0" + mm;
          
                      var datetime =
                        yyyy.toString() +
                        mm.toString() +
                        dd.toString() +
                        Hour.toString() +
                        Minute.toString();
          
                      createXLSLFormatObj.push(xlsHeader);
                      $.each(xlsRows, function (index, value) {
                        var innerRowData = [];
                        $.each(value, function (ind, val) {
                          innerRowData.push(val);
                        });
                        createXLSLFormatObj.push(innerRowData);
                      });
                      pageLoading.hide();
                      JSONToCSVConvertor(createXLSLFormatObj, "Product Conversion");
                    } else {
                      $vm.ResultModelExcel = res.data.itemsProductConversion;
                    }
                  });
                };
                function JSONToCSVConvertor(JSONData, ShowLabel) {
                  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                  var arrData =
                    typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
          
                  var CSV = "";
          
                  //1st loop is to extract each row
                  for (var i = 0; i < arrData.length; i++) {
                    var row = "";
          
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                      row += '"' + arrData[i][index] + '",';
                    }
          
                    row.slice(0, row.length - 1);
          
                    //add a line break after each row
                    CSV += row + "\r\n";
                  }
          
                  if (CSV == "") {
                    alert("Invalid data");
                    return;
                  }
          
                  var today = new Date();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getUTCFullYear();
                  var dd = today.getDate();
                  var Minute = today.getMinutes();
                  var Hour = today.getHours();
          
                  if (Minute < 10) Minute = "0" + Minute;
          
                  if (dd < 10) dd = "0" + dd;
                  if (mm < 10) mm = "0" + mm;
          
                  var datetime =
                    yyyy.toString() +
                    mm.toString() +
                    dd.toString() +
                    Hour.toString() +
                    Minute.toString();
                  //Generate a file name
                  var fileName = ShowLabel + "_" + datetime;
                  //this will remove the blank-spaces from the title and replace it with an underscore
          
                  //Initialize file format you want csv or xls
                  var uri =
                    "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(CSV);
          
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

            // $vm.triggerSearch = function () {               
            //     // $vm.filterModel = {};
            //     pageLoading.show();          
            //     let productIndex = viewModel.getParam();         
            //     if (productIndex != undefined) {   
            //         viewModel.getIndex(productIndex).then(function success(res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow =  res.data.pagination.totalRow;           
            //             $vm.searchResultModel = res.data.items;                                
            //             // window.history.replaceState({}, document.title, "/" + "modules/masterData/masterProductConversion/productConversionSummary.html");             
            //         });
            //     }
            //     else 
            //     {
            //         if($scope.filterModel != undefined)
            //         {
            //             $vm.filterModel.productConversionId = $scope.filterModel.productConversionId || "";
            //             $vm.filterModel.productConversionName = $scope.filterModel.productConversionName || "";
            //             $vm.filterModel.productName = $scope.filterModel.productName || "";
            //         }
                    
            //         viewModel.search($vm.filterModel).then(function (res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow =  res.data.pagination.totalRow;                 
            //             $vm.searchResultModel = res.data.items;

            //         });
            //     }

            // };
            // $scope.model = {
            //     currentPage: 1,
            //     numPerPage: 30,
            //     PerPage: 30,
            //     totalRow: 0,
            //     maxSize: 5
            // };
            // $scope.searchFilter = function (param) {
            //     var deferred = $q.defer();
            //     var item = $scope.actionPS;
            //     var Data = param;
            //     switch (item) {
            //         case "1": {                       
            //             Data.productConversionId;
            //             Data.productName = ""
            //             Data.productConversionName = ""
            //         }
            //         break;
            //         case "2": {
            //             Data.productConversionName;
            //             Data.productConversionId= ""
            //             Data.productName = ""
                        
            //         }
            //         break;
            //         case "3": {
            //             Data.productName;
            //             Data.productConversionId = ""
            //             Data.productConversionName = ""
            //         }
            //         break;
            //     }
            //     viewModel.search(Data).then(
            //         function success(res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow =  res.data.pagination.totalRow;
            //             $vm.searchResultModel = res.data.items;
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         });
            //     return deferred.promise;
            // };

            // $scope.filter = function () {
                
            //     $vm.filterModel = {};
            //     pageLoading.show();       
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;
            //     });
            // };

            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };


            // ----------------------------------------------------
            // This local function
            function formatDate() {
              var today = new Date();
              var mm = today.getMonth() + 1;
              var yyyy = today.getUTCFullYear();
              var dd = today.getDate();
              if (dd < 10) dd = '0' + dd;
              if (mm < 10) mm = '0' + mm;
      
              return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();
          };

            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
                viewModelProduct.set();
                viewModel.set();
                viewModelProductConversionBarcode.set();
                $scope.filterModel = {};

                $scope.filterModel.dateCreate = formatDate();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();