(function () {
  'use strict'
  app.component('reportWrongLocationSummary', {
      controllerAs: '$vm',
      templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
          return "modules/Reports/reportWrongLocation/reportWrongLocationSummary.html";
  
      },
      bindings: {
          isLoading: '=?',
          searchResultModel: '=?',
          filterModel: '=?',
          triggerSearch: "=?",
          triggerCreate: '=?',
          searchFilter: '=?',
          isFilter: '=?',
          searchDataRow: '=?'
      },
      controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, reportWrongLocationFactory, webServiceAPI, logsFactory) {
          var $vm = this;
          $scope.items = $scope.items || [];
          var viewModel = reportWrongLocationFactory;
          var item = $vm.searchResultModel;
          $scope.showColumnSetting = false;
  
          $scope.maxSize = 5;
          $scope.filterModel = {};
          $vm.filterModel = {
            CurrentPage: 1,
            PerPage: 50,
            TotalRow: 0,
        };
          $vm.isFilter = true;
          
          $vm.triggerSearch = function () {
            $scope.filterModel = $scope.filterModel || {};
              $scope.filterModel.PerPage = $vm.filterModel.PerPage;
              $scope.filterModel.currentPage = $vm.filterModel.currentPage;
          
            $scope.searchFilter($scope.filterModel).then(function success(res) {
                debugger
                $vm.searchResultModel = res.data.itemsview;
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
           
  
  
          $scope.autoComplete = {
            AutoProductIdStockOnCartonFlow: "ReportAutocomplete/AutoProductIdStockOnCartonFlow",
          };
    
          $scope.url = {
            Report: webServiceAPI.Report,
          };
  
  
          $scope.selectSort = [{
            value: "Product_Id",
            display: "Product ID"
          },
          {
            value: "Prec_Qty_Desc",
            display: "% Qty >"
          },
          {
            value: "Prec_Qty_Asc",
            display: "% Qty <"
          },
        ];
  
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
        
        $scope.exportModel = {};
        $scope.export = function () {
            pageLoading.show();
            $scope.exportModel.key = $vm.filterModel.key;
            $scope.exportModel.PerPage = 0;
            $scope.exportModel.selectSort = $scope.filterModel.selectSort;
            if ($scope.dropdownLocationType.model != null) {
              $scope.exportModel.locType = $scope.dropdownLocationType.model.locType;
            }
            else {
              $scope.exportModel.locType = null;
            }
            viewModel.ExportExcel($scope.exportModel).then(function (res) {
              //pageLoading.hide();
              debugger;
              if (res.data.length != 0) {
                $vm.ResultModelExcel = res.data.itemsview;
    
                var createXLSLFormatObj = [];
    
                /* XLS Head Columns */
                var xlsHeader = [
                  "Product Id",
                  "Product Name",
                  "Location Name",
                  "Sale Unit",
                  "Max QTY",
                  "Min QTY",
                  "Piece Pick QTY",
                  "% QTY",
                  "Replen QTY",
                ];
    
                /* XLS Rows Data */
                var xlsRows = [];
                var number = 1;
                debugger;
                $vm.ResultModelExcel.forEach((e) => {
                  xlsRows.push({
                    "Product Id": e.product_Id,
                    "Product Name": e.product_Name,
                    "Location Name": e.location_Name,
                    "Sale Unit": e.productConversion_Name,
                    "Max QTY": e.max_Qty,
                    "Min QTY": e.min_Qty,
                    "Piece Pick QTY": e.piecepick_Qty,
                    "% QTY": e.perc_Qty,
                    "Replen QTY": e.replen_Qty,
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
                JSONToCSVConvertor(createXLSLFormatObj, "Report Qty on Flow Rack - Carousel");
              } else {
                $vm.ResultModelExcel = res.data.itemsview;
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
  
          $scope.text_truncate = function(str, length, ending) {
         
              if (ending == null) {
                ending = '...';
              }
                 
              if (str.length > length) {
                return str.substring(0, length - ending.length) + ending;
              } else {
                return str;
              }
          };
          
          
          var MessageBox = dpMessageBox;
  
           $scope.show = {
              action: true,
              pagination: true,
              checkBox: false
          }
          $scope.model = {
              currentPage: 1,
              numPerPage: 50,
              totalRow: 0
          };
          $scope.showCoload = false;
          
          $scope.changePage = function () {
              var page = $vm.filterModel;
              var all = {
                  currentPage: 0,
                  numPerPage: 0
              };
              if ($vm.filterModel.currentPage != 0) {
                  page.currentPage = page.currentPage;
              }
              serchPage(page);
          }
  
          $scope.changeTableSize = function (perPage, tab) {
              if (tab == 1) {
                  $scope.colortab1 = "#990000";
                  $scope.colortab2 = "#FFFFFF";
  
                  $scope.fronttab1 = "#FFFFFF";
                  $scope.fronttab2 = "#990000";
  
              }
              else if (tab == 2) {
                  $scope.colortab1 = "#FFFFFF";
                  $scope.colortab2 = "#990000";
  
                  $scope.fronttab1 = "#990000";
                  $scope.fronttab2 = "#FFFFFF";
              }
  
              $scope.selected = tab;
  
              let ChangeTable = 1;
              $scope.model = $vm.filterModel;
              if (perPage != null || perPage != undefined) {
                  $scope.model.perPage = perPage;
              }
  
              var p = $scope.model;
              serchPage(p);
          }
  
          function serchPage(data) {
  
              if (data != null) {
  
                  pageLoading.show();
                    viewModel.filterViewWrongLocation(data).then(function (res) {
                        pageLoading.hide();
                        if (res.data.length != 0 && res.data.length != undefined) {
                            $vm.filterModel.totalRow = res.data[0].count;
                            $vm.searchResultModel = res.data.itemsview;
                        }
                        else {
                            if (res.data.pagination != null) {
                                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                                $vm.filterModel.perPage = res.data.pagination.perPage;
                                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                                $vm.searchResultModel = res.data.itemsview;
                            }
                        }
                    })
              }
          };
  
          $scope.searchFilter = function () {
            var deferred = $q.defer();
            pageLoading.show()
            viewModel.filterViewWrongLocation($scope.filterModel).then(
            function success(res) {
              pageLoading.hide()
              deferred.resolve(res);
            },
            function error(response) {
              pageLoading.hide()
              deferred.reject(response);
            });
            return deferred.promise;
          }
  
          $scope.filterSearch = function () {
              $scope.filterModel = $scope.filterModel || {};
              $scope.filterModel.PerPage = $vm.filterModel.PerPage;
              $scope.filterModel.currentPage = $vm.filterModel.currentPage;
              // if ($scope.dropdownLocationType.model != null) {
              //   $scope.filterModel.locType = $scope.dropdownLocationType.model.locType;
              // }
              // else {
              //   $scope.filterModel.locType = null;
              // }
          
            $scope.searchFilter($scope.filterModel).then(function success(res) {
                debugger
                $vm.searchResultModel = res.data.itemsview;
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
  
          // $scope.getLocationType = function () {
          //   viewModel.getLocationType({}).then(function (res) {
          //     $scope.dropdownLocationType = res.data;
          //   });
          // };
  
          var init = function () {
            $vm.triggerSearch();
            $scope.filterModel = {};
            // $scope.getLocationType();
          };
          init();
         
  
      }
  });
  })();