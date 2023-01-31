(function () {
  'use strict';
  app.component('importFileMasterFilter', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
      return "modules/ImportFile/importFileMaster/component/importFileMasterFilter.html";
    },
    bindings: {
      searchResultModel: '=?',
      invalidResultModel: '=?',
      filterModel: '=?',
      triggerSearch: '=?',
      triggerCreate: '=?',
      columnHeader: '=?',
      guId: '=?'
    },
    controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, dpMessageBox, pageLoading, commonService, importFileMasterFactory, webServiceAPI, localStorageService) {
      var $vm = this;

      // ----------------------------------------------------
      // This default object
      var viewModel = importFileMasterFactory;
      $scope.filterModel = {};
      $vm.filterModel = {
        currentPage: 1,
        currentPage2: 1,
        perPage: 50,
        perPage2: 50,
        totalRow: 0,
        totalRow2: 0
      };

      // $vm.triggerSearch = function () {

      // };

      // function initialize() {
      // };

      function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
      }


      $scope.Upload = function (file, param) {
        let route = viewModel.get();
        if (!route) {
          return dpMessageBox.alert(
            {
              ok: 'Close',
              title: 'Error',
              message: 'กรุณาเข้าจากหน้าหลัก'
            })
        }
        // if (param.select == "") {
        //   return dpMessageBox.alert(
        //     {
        //       ok: 'Close',
        //       title: 'Error',
        //       message: 'กรุณาเลือก Article'
        //     })
        // }

        $scope.SelectedFile = file;
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
        if (regex.test($scope.SelectedFile.name.toLowerCase())) {
          if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.readAsText(file, 'windows-874');
            if (reader.readAsBinaryString) {
              reader.onload = function (e) {
                pageLoading.show();
                var rows = e.target.result.split("\n").slice(1);
                let number = 'C';
                let dataInsert = {};
                dataInsert.Import_Type = viewModel.get();
                dataInsert.Import_FileName = $scope.SelectedFile.name;
                dataInsert.Import_By = localStorageService.get('userTokenStorage');
                dataInsert.Import_Case = $scope.filterModel.select;
                dataInsert.data = [];
                dataInsert.columns = [];
                for (var i = 0; i < rows.length; i++) {
                  let data = rows[i].split(',');
                  if (data[0]) {
                    let ItemData = {};
                    for (let index = 0; index < data.length; index++) {
                      let numberindex = number + index.toString();
                      ItemData[numberindex] = data[index];
                    }
                    dataInsert.data.push(ItemData);
                  }
                }
                $scope.$apply(function () {
                  var header = e.target.result.split("\n");
                  let dataHeader = header[0].split(',');
                  let column = [];
                  for (let xxx = 0; xxx < dataHeader.length; xxx++) {
                    column.push({ sorting: xxx, name: dataHeader[xxx], width: "180px", field: 'c' + xxx.toString() });
                    dataInsert.columns.push({ header: dataHeader[xxx], column: 'c' + xxx.toString() });
                  }
                  $vm.columnHeader = column;
                });

                if (route == "Import_Vendor") {
                  viewModel.validateVendor(dataInsert).then(function (res) {
                    pageLoading.hide();
                    $vm.guId = { guId: res.data.import_GuID, FileName: $scope.SelectedFile.name };
                    $vm.filterModel.searchResultModel = angular.copy(res.data.valid_Data);
                    $vm.filterModel.invalidResultModel = angular.copy(res.data.invalid_Data);
                    $vm.searchResultModel = paginate(res.data.valid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, true);
                    $vm.invalidResultModel = paginate(res.data.invalid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, false);
                  });
                }
                else if (route == "Import_Article") {
                  viewModel.validateArticle(dataInsert).then(function (res) {
                    pageLoading.hide();
                    $vm.guId = { guId: res.data.import_GuID, FileName: $scope.SelectedFile.name };
                    $vm.filterModel.searchResultModel = angular.copy(res.data.valid_Data);
                    $vm.filterModel.invalidResultModel = angular.copy(res.data.invalid_Data);
                    $vm.searchResultModel = paginate(res.data.valid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, true);
                    $vm.invalidResultModel = paginate(res.data.invalid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, false);
                  });
                }
                else if (route == "Import_ArticleConversion") {
                  viewModel.validateArticleConvertion(dataInsert).then(function (res) {
                    pageLoading.hide();
                    $vm.guId = { guId: res.data.import_GuID, FileName: $scope.SelectedFile.name };
                    $vm.filterModel.searchResultModel = angular.copy(res.data.valid_Data);
                    $vm.filterModel.invalidResultModel = angular.copy(res.data.invalid_Data);
                    $vm.searchResultModel = paginate(res.data.valid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, true);
                    $vm.invalidResultModel = paginate(res.data.invalid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, false);
                  });
                }
                else if (route == "Import_ArticleConvertionBarcode") {
                  viewModel.validateArticleConvertionBarcode(dataInsert).then(function (res) {
                    pageLoading.hide();
                    $vm.guId = { guId: res.data.import_GuID, FileName: $scope.SelectedFile.name };
                    $vm.filterModel.searchResultModel = angular.copy(res.data.valid_Data);
                    $vm.filterModel.invalidResultModel = angular.copy(res.data.invalid_Data);
                    $vm.searchResultModel = paginate(res.data.valid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, true);
                    $vm.invalidResultModel = paginate(res.data.invalid_Data, $vm.filterModel.perPage, $vm.filterModel.currentPage, false);
                  });
                }

              };
              reader.readAsBinaryString($scope.SelectedFile);
            }
          } else {
            $window.alert("This browser does not support HTML5.");
          }
        } else {
          $window.alert("Please upload a valid CSV file.");
        }
      };

      $scope.downloadTemplate = function () {
        let route = viewModel.get();
        if (!route) {
          return dpMessageBox.alert(
            {
              ok: 'Close',
              title: 'Error',
              message: 'กรุณาเข้าจากหน้าหลัก'
            })
        }
        else if (route == "PlanGoodsReceive") {
          /* XLS Head Columns */
          var xlsHeader = ["NO", "DN NO", "Ref_2", "Ref_3", "Ref_4", "DN Date", "Due date", "Document Type", "Vender Code", "Vender Name", "WereHourse", "Item", "Art. Home code", "vendor Code", "vendor name", "Qty", "Unit", "Width", "Length", "Height", "Unit", "Art.vendor Code", "Art.MHomepro", "Lot/Batch", "UnitWeight", "Weight", "UnitNetWeight", "NetWeight", "UnitGrsWeight", "GrsWeight"];
          exportTemplate(xlsHeader, "DN_Template");
        }
        else if (route == "PlanGoodsIssue") {
          /* XLS Head Columns */
          var xlsHeader = ["NO", "PO NO", "PO Date", "Due date", "Vender Code", "Vender Name", "Document Type", "Warehouse", "Ship To", "Sold To", "Item", "Art. vendor code", "Art. vendor name", "Qty", "Unit", "Remark"];
          exportTemplate(xlsHeader, "PO_Template");
        }
      }

      $scope.downloadTemplateV2 = function () {
        let route = viewModel.get();
        if (!route) {
          return dpMessageBox.alert(
            {
              ok: 'Close',
              title: 'Error',
              message: 'กรุณาเข้าจากหน้าหลัก'
            })
        }
        else if (route == "PlanGoodsReceive") {

        }
        else if (route == "PlanGoodsIssue") {

        }
      }

      function exportTemplate(xlsHeader, Name) {
        var createXLSLFormatObj = [];

        createXLSLFormatObj.push(xlsHeader);

        /* File Name */
        var filename = Name + ".xls";

        /* Sheet Name */
        var ws_name = Name;

        if (typeof console !== 'undefined') console.log(new Date());
        var wb = XLSX.utils.book_new(),
          ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        /* Write workbook and Download */
        if (typeof console !== 'undefined') console.log(new Date());
        XLSX.writeFile(wb, filename);
        if (typeof console !== 'undefined') console.log(new Date());
      }

      function paginate(array, page_size, page_number, chktrue) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        if (chktrue) {
          $vm.filterModel.totalRow = array.length;
        }
        else {
          $vm.filterModel.totalRow2 = array.length;
        }
        return array.slice((page_number - 1) * page_size, page_number * page_size);
      }

      var init = function () {
        $scope.filterModel.select = "";
        $scope.routeurl = viewModel.get();
      };
      init();
    }
  });

})();