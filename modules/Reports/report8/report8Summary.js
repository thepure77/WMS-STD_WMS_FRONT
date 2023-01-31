(function () {
  "use strict";

  app.component("report8", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/report8/report8Summary.html",
    controller: function (
      $scope,
      $filter,
      $http,
      $sce,
      /*ngAuthSettings,*/
      $state,
      /*authService*/
      pageLoading,
      $window,
      commonService,
      localStorageService,
      $timeout,
      $translate,
      $q,
      dpMessageBox,
      webServiceAPI,
      report8Factory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = report8Factory;

      $scope.isFilter = true;
      $scope.isShow = false;

      //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

      $scope.filterModel = {
        currentPage: 0,
        numPerPage: 30,
        totalRow: 0,
        key: "",
        advanceSearch: false,
        showError: false,
        type: 1
      };


      $scope.header = {
        advanceSearch: false
      };

      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
        if (!$scope.header.advanceSearch) {
          $scope.filterModel.goodsTransfer_No = "";
          $scope.filterModel.tag_No = "";
          $scope.filterModel.location_Id = "";
          $scope.filterModel.owner_Id = "";
        }
      };

      $scope.$watch("callSearch", function () {
        if ($scope.callSearch) {
          $scope.callSearch();
        }
      });


      $scope.clearSearch = function () {
        $scope.filterModel = {};
        $scope.filterModel.date = formatDate();
        $window.scrollTo(0, 0);
      }

      $scope.autoComplete = {
        autoGT: "AutoGoodsTransfer/autoGoodsTransferNo",
        autoProductId: "Autocomplete/autoProductId",
        autoTagNo: "Report8/autoSearchTagNo",
        autoLocationID: "Report8/autoSearchLocationID",
        autoOwnerID: "Report8/autoSearchOwnerID",
        product: "Autocomplete/autoProductAndProductId",
        autoSloc:"Report8/autoSearchSloc",
        autoCreateBy:"Report8/autoCreateBy"
      };
      $scope.url = {
        Master: webServiceAPI.Master,
        GR: webServiceAPI.GR,
        GT: webServiceAPI.GT,
        Report: webServiceAPI.Report
      };
      $scope.searchReport = function (param) {
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }

        if ($scope.dropdownDocumentType) {
          if ($scope.dropdownDocumentType.model != null) {
            param.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
            param.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
            param.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
          } else {
            param.documentType_Index = null;
            param.documentType_Id = null;
            param.documentType_Name = null;
          }
        }

        if ($scope.dropdownLocationType) {
          if ($scope.dropdownLocationType.model != null) {
            param.locationType_Index = $scope.dropdownLocationType.model.locationType_Index;
            param.locationType_Id = $scope.dropdownLocationType.model.locationType_Id;
            param.locationType_Name = $scope.dropdownLocationType.model.locationType_Name;
          } else {
            param.locationType_Index = null;
            param.locationType_Id = null;
            param.locationType_Name = null;
          }
        }
        pageLoading.show();
        viewModel.PrintReport(param).then(
          function success(results) {
            pageLoading.hide();
            var file = new Blob([results.data], {
              type: "application/pdf"
            });
            var fileURL = URL.createObjectURL(file);
            $scope.expdf = $sce.trustAsResourceUrl(fileURL);
            $scope.isShow = true;
          },

          function error(response) {

            dpMessageBox.alert({
              title: 'Information.',
              message: "Connect Service Fail."
            })
          }
        );
      };

      function getToday() {
        var today = new Date();

        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        return yyyy.toString() + "/" + mm.toString() + "/" + dd.toString();
      };

      // Export Excel
      $scope.exportFile = {

        ExportExcel: function () {
          dpMessageBox.confirm({
            title: 'Confirm.',
            message: 'Do you want to download?'
          }).then(function success() {
            ExportExcel();
          })
        },
      }

      function ExportExcel() {
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }

        if ($scope.dropdownDocumentType) {
          if ($scope.dropdownDocumentType.model != null) {
            $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
            $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
            $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
          } else {
            $scope.filterModel.documentType_Index = null;
            $scope.filterModel.documentType_Id = null;
            $scope.filterModel.documentType_Name = null;
          }
        }

        if ($scope.dropdownLocationType) {
          if ($scope.dropdownLocationType.model != null) {
            $scope.filterModel.locationType_Index = $scope.dropdownLocationType.model.locationType_Index;
            $scope.filterModel.locationType_Id = $scope.dropdownLocationType.model.locationType_Id;
            $scope.filterModel.locationType_Name = $scope.dropdownLocationType.model.locationType_Name;
          } else {
            $scope.filterModel.locationType_Index = null;
            $scope.filterModel.locationType_Id = null;
            $scope.filterModel.locationType_Name = null;
          }
        }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "สรุปการย้ายตำแหน่ง";
        viewModel.ExportExcel($scope.filterModel).then(
          function success(results) {
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

      function insertLogsUser() {
        var userLogin = JSON.parse(localStorage.userlogin);
        var logs = {};
        //logs.log_Index
        //logs.userGroup_Index
        //logs.userGroup_Id
        logs.userGroup_Name = localStorage['userGroupName'];
        logs.user_Index = userLogin.user_Index;
        logs.user_Id = userLogin.user_Id;
        logs.user_Name = userLogin.user_Name;
        logs.first_Name = userLogin.first_Name;
        logs.last_Name = userLogin.last_Name;
        logs.menu_Index = "D5E9E57B-314D-4027-B8DE-5EA357669640";
        //logs.menuType_Index
        //logs.menu_Id
        logs.menu_Name = "รายงาน";
        logs.sub_Menu_Index = "63E6A85B-BDFE-4049-B643-E12632F0FC4E";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "สรุปการย้ายตำแหน่ง";
        logs.operations = "";
        //logs.ref_Document_Index
        //logs.ref_Document_No
        //logs.request_URL
        //logs.request_Body
        //logs.isActive
        //logs.isDelete
        //logs.isSystem
        logsFactory.SaveLogs(logs).then(function (res) {

        })
      };

      $scope.dropdownDocumentType = function () {
        viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
          $scope.dropdownDocumentTypeList = res.data;
        });
      };

      $scope.dropdownLocationType = function () {
        viewModel.dropdownLocationType($scope.filterModel).then(function (res) {
          $scope.dropdownLocationTypeList = res.data;
        });
      };

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.goodsTransfer_date = getToday();
        $scope.filterModel.goodsTransfer_date_To = getToday();
        $scope.dropdownDocumentType();
        $scope.dropdownLocationType();
        insertLogsUser();
      };

      function formatDate() {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
      }

      $scope.$watch("filterModel.product_Id", function () {
        if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Id == undefined) {
          $scope.filterModel.product_Index = '';
          $scope.filterModel.product_Name = '';
        }
      });

      $scope.$watch("filterModel.owner_Id + filterModel.owner_Index", function () {
        if ($scope.filterModel.owner_Index == "" || $scope.filterModel.owner_Index == undefined) {
          $scope.filterModel.owner_Id = '';
          $scope.filterModel.owner_Name = '';
        }
      });

      $scope.convertDate = function () {

        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.goodsTransfer_date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.goodsTransfer_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };

    }
  });
})();