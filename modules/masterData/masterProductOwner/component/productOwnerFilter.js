(function () {
    'use strict';
    app.component('productOwnerFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterproductOwner/component/productOwnerFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, dpMessageBox, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,productOwnerFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = productOwnerFactory;

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
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function(res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsProductOwner;
                    } else {
                        $vm.searchResultModel = res.data.itemsProductOwner;
                    }
                });
            };

            $scope.searchFilter = function(param) {
              if ($scope.filterModel.dateCreate != null) {
                $scope.convertDate();
              }
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

                        $vm.searchResultModel = res.data.itemsProductOwner;
                    } else {

                        $vm.searchResultModel = res.data.itemsProductOwner;
                    }
                });
            };

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                productOwner: "Autocomplete/autoProductOwner",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
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
                      $vm.ResultModelExcel = res.data.itemsProductOwner;
          
                      var createXLSLFormatObj = [];
                      /* XLS Head Columns */
                      var xlsHeader = [
                        "Row Number",
                        "Product Vendor ID",
                        "Product Name",
                        "Vendor Name",
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
                          "PRODUCT_OWNER_ID": e.productOwner_Id,
                          "PRODUCT_NAME": e.product_Name,
                          "OWNER_NAME": e.owner_Name,
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
                      JSONToCSVConvertor(createXLSLFormatObj, "Product Vendor");
                    } else {
                      $vm.ResultModelExcel = res.data.itemsProductOwner;
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
            // $scope.model = {
            //     productOwnerId: "",
            //     productName: "",    
            //     ownerName: "",             
            // };
            // $scope.searchFilter = function (item) {
                
            //     var deferred = $q.defer();
                
            //     viewModel.search(item).then(
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

            // $vm.triggerSearch = function () {

                             
            //     pageLoading.show();  
            //     viewModel.search($vm.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel.totalRow =  res.data.pagination.totalRow;    
            //         $vm.searchResultModel = res.data.items;
            //     });;
            // };
            // $scope.filter = function () {
            //     $vm.triggerSearch();
            // };

            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };
            
            // $scope.autoComplete = {
            //     orderNo: "domesticLoadingItems/orderNo",
            //     SoNo: "domesticLoadingItems/SoNo",
            //     Plant: "domesticLoadingItems/Plant",
            //     OMSJobNo: "domesticLoadingItems/OMSJobNo",
            //     Material: "domesticLoadingItems/Material",
            //     Lot: "domesticLoadingItems/Lot",
            //     Customer: "domesticLoadingItems/Customer",
            //     DSNo: "domesticLoadingItems/DSNo",
            //     coloadNo: "domesticLoadingItems/coloadNo",
            //     basic: "DomesticPlantSelected/basicSuggestion",
            //     materialCode: "ExportPlantSelected/materialCode",
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