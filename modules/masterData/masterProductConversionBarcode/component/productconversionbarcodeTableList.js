'use strict'
app.component('productconversionbarcodeTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterproductconversionBarcode/component/productconversionbarcodeTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,productConversionBarcodeFactory) {
        var $vm = this;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = productConversionBarcodeFactory;

          // setting column
          $scope.showColumnSetting = false;
          $scope.maxSize = 5;
          
          $vm.triggerCreate = function () {
              if ($scope.onShow) {
                  $vm.isFilter = false;
                  $scope.onShow().then(function (result) {
                      $vm.isFilter = true;
                      $vm.triggerSearch();
                  }).catch(function (error) {
                      defer.reject({ 'Message': error });
                  });
              }
          };
          $scope.editItem = function (param) {
              if ($scope.onShow) {
                  $vm.isFilter = false;
                  $scope.onShow(param).then(function (result) {
                      $vm.isFilter = true;
                      $vm.triggerSearch();
                  }).catch(function (error) {
                      defer.reject({ 'Message': error });
                  });
              }
          }
  
          $scope.model = {
              currentPage: 1,
              numPerPage: 30,
              totalRow: 0,
          };
  
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
          $scope.changeTableSize = function (perPage,tab) {
  
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
                  viewModel.filter(data).then(function (res) {
                      pageLoading.hide();
                      if (res.data.length != 0 && res.data.length != undefined) {
                          $vm.filterModel.totalRow = res.data[0].count;
                          $vm.searchResultModel = res.data;
  
                      }
                      else {
                          if (res.data.pagination != null) {
                              $vm.filterModel.totalRow = res.data.pagination.totalRow;
                              $vm.filterModel.perPage = res.data.pagination.perPage;
                              $vm.filterModel.currentPage = res.data.pagination.currentPage;
                              $vm.searchResultModel = res.data.itemsProductConversionBarcode;
  
                          }
                      }
                  })
              }
          }
  
          $scope.delete = function (param) {
              dpMessageBox.confirm({
                  ok: 'Yes',
                  cancel: 'No',
                  title: 'InformaTion',
                  message: 'Do you want to Delete ?'
              }).then(function success() {
                  viewModel.getDelete(param).then(function success(res) {
                      if (res.data == true) {
                          dpMessageBox.alert({
                              ok: 'Close',
                              title: 'Success',
                              message: 'Delete Success'
                          })
                      }
                      $vm.triggerSearch();
                  }, function error(res) { });
              });
          };
  



        // // setting column
        // $scope.showColumnSetting = false;

        // $vm.triggerCreate = function () {
        //     if($scope.onShow)
        //     {
        //         $vm.isFilter = false;
        //         $scope.onShow().then(function (result) {
        //             $vm.isFilter = true;
                    
        //         }).catch(function(error) {
        //             defer.reject({ 'Message': error });
        //         });
        //     }
        // };
        // $scope.editItem = function (param) {
        //     if ($scope.onShow) {
        //         $vm.isFilter = false;
        //         $scope.onShow(param.productConversionBarcodeIndex).then(function (result) {
        //             $vm.isFilter = true;

        //         }).catch(function (error) {
        //             defer.reject({ 'Message': error });
        //         });
        //     }
        // }      
        // $scope.show = {
        //     action: true,
        //     pagination: true,
        //     checkBox: false
        // }
        // $scope.model = {
        //     currentPage: 1,
        //     numPerPage: 30,
        //     totalRow: 0,
        //     advanceSearch: false
        // };

        // // coload toggle
        // $scope.showCoload = false;
        // $scope.pageOption = [{
        //     'value': 30
        // }, {
        //     'value': 50
        // },
        // {
        //     'value': 100
        // },
        // {
        //     'value': 500
        // },
        // ];      

        // $scope.pagging = {
        //     totalRow: 0,
        //     currentPage: 1,
        //     numPerPage: $vm.filterModel.numPerPage,
        //     num: 1,
        //     maxSize: 2,
        //     perPage: $vm.filterModel.numPerPage,
        //     change: function () {
        //         $vm.filterModel.currentPage = this.currentPage - 1;
        //         if ($vm.triggerSearch) {
        //             $vm.triggerSearch();
        //         }
        //     },
        //     changeSize: function () {
        //         $vm.filterModel.numPerPage = $scope.pagging.perPage
        //         $vm.triggerSearch();
        //     }
        // }

        // $scope.changePage = function () {            
        //     //$vm.filterModel.productIndex = ($vm.filterModel.productId === undefined || $vm.filterModel.productName == "") ? $vm.filterModel.productIndex = "" : $vm.filterModel.productIndex;   
        //     var page = $vm.filterModel;
            
        //     var all = {
        //         currentPage: 0,
        //         numPerPage: 0
        //     };
        //     if ($vm.filterModel.currentPage != 0) {
        //         page.currentPage = page.currentPage;
        //     }
        //     serchPage(page);
        // }

        // $scope.changeTableSize = function () {
        //     let ChangeTable = 1;
        //     if ($scope.model.numPerPage == undefined) {
        //         $scope.model.numPerPage = $vm.filterModel.perPage;
        //     }
        //     // var p = {
        //     //     currentPage: ChangeTable,
        //     //     numPerPage: $vm.filterModel.perPage
        //     // };
        //     var p = $vm.filterModel;
        //     serchPage(p);
        // }

        // $vm.filterModel = {
        //     num: 1,
        //     maxSize: 5,
        //     currentPage: $vm.filterModel.perPage,
        //     columnName: $vm.filterModel.columnName,
        //     orderBy: $vm.filterModel.orderBy
        // };

        // function serchPage(data) {
        //     if (data != null) {
        //         pageLoading.show();
        //         viewModel.search(data).then(function (res) {
                    
        //             pageLoading.hide();
        //             if (res.data.itemsProductConversionBarcode.length != 0 && res.data.itemsProductConversionBarcode.length != undefined) {
                        
        //                 $vm.filterModel.totalRow = res.data.pagination.totalRow;
        //                 $vm.searchResultModel = res.data.itemsProductConversionBarcode;
        //             }
        //             else {
        //                 if (res.data.pagination != null) {                                                       
        //                     $vm.filterModel.totalRow = res.data.pagination.totalRow;
        //                     $vm.filterModel.currentPage = res.data.pagination.currentPage;
        //                     $vm.searchResultModel = res.data.itemsProductConversionBarcode;

        //                 }
        //             }
        //         })
        //     }
        // }

        // $scope.delete = function (param) {
        //     dpMessageBox.confirm({
        //         ok: 'Yes',
        //         cancel: 'No',
        //         title: 'InformaTion',
        //         message: 'Do you want to Cancel ?'
        //     }).then(function success() {                        
        //         viewModel.getDelete(param.productConversionBarcodeIndex).then(function success(res) {
        //             $vm.triggerSearch();
        //         }, function error(res) { });
        //     });
        // };
        var init = function () {
            //$scope.filterModel = {};
        };
        init();

    }
});