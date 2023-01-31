(function () {
  "use strict";

  app.component("reportGiByShipmentDateAndBusinessUnit", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportGIByShipmentDateAndBusinessUnit/reportGIByShipmentDateAndBusinessUnit.html",
    controller: function (
      $scope,
      $filter,
      $http,
      $sce,
      /*ngAuthSettings,*/ $state,
      /*authService*/ pageLoading,
      $window,
      commonService,
      localStorageService,
      $timeout,
      $translate,
      $q,
      dpMessageBox,
      webServiceAPI,
      reportGIByShipmentDateAndBusinessUnitFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportGIByShipmentDateAndBusinessUnitFactory;

      $scope.isFilter = true;
      $scope.isShow = false;

      //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

      $scope.filterModel = {};

      $scope.$watch("callSearch", function () {
        if ($scope.callSearch) {
          $scope.callSearch();
        }
      });

      $scope.filter = function () {

        $vm.triggerSearch();
      };

      $scope.getSearchParams = function () {
        return angular.copy($vm.filterModel);
      };

      $scope.dropdownBusinessUnit = function () {
        viewModel.dropdownBusinessUnit($scope.filterModel).then(function (res) {
            $scope.dropdownBusinessUnit = res.data;
        });
      };
    
      $scope.convertDate = function () {
        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.report_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.report_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }
      };


      $scope.searchReport = function () {
        if ($scope.filterModel.ambientRoom == undefined || $scope.filterModel.ambientRoom == "" || $scope.filterModel.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        var chk_date_null = 0;

        if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
          $scope.convertDate();
        else
          chk_date_null = 1;

        if(($scope.filterModel.report_Date == null || $scope.filterModel.report_Date == "" || $scope.filterModel.report_Date == undefined) || ($scope.filterModel.report_Date_To == null || $scope.filterModel.report_Date_To == "" || $scope.filterModel.report_Date_To == undefined))
          chk_date_null = 1;

        if(chk_date_null == 1){
          return dpMessageBox.alert({
            ok: 'Close',
            title: 'แจ้งเตือน',
            message: 'กรุณาระบุวันที่',
          })
        } 

        pageLoading.show();
        viewModel.PrintReport($scope.filterModel).then(
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
            pageLoading.hide();
            dpMessageBox.alert({
              title: 'Information.',
              message: "Connect Service Fail."
            })

          }
        );
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

      $scope.autoComplete = {
        autoSku: "Autocomplete/autoProductId",
        autoOwner: "ReportAutocomplete/autoOwner",
        autoOwnerID: "ReportLaborPerformance/autoSearchOwnerID",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        billing: "AutoPlanGoodIssue/AutoBilling_No",
        autoGINo: "ReportAutocomplete/autoGINo",
        PlanGI: webServiceAPI.PlanGI,
      };


      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
        Load: webServiceAPI.Load,
        PlanGI: webServiceAPI.PlanGI
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
        if ($scope.filterModel.ambientRoom == undefined || $scope.filterModel.ambientRoom == "" || $scope.filterModel.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        var chk_date_null = 0;

        if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
          $scope.convertDate();
        else
          chk_date_null = 1;

        if(($scope.filterModel.report_Date == null || $scope.filterModel.report_Date == "" || $scope.filterModel.report_Date == undefined) || ($scope.filterModel.report_Date_To == null || $scope.filterModel.report_Date_To == "" || $scope.filterModel.report_Date_To == undefined))
          chk_date_null = 1;

        if(chk_date_null == 1){
          return dpMessageBox.alert({
            ok: 'Close',
            title: 'แจ้งเตือน',
            message: 'กรุณาระบุวันที่',
          })
        } 
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report GI by Shipment Date & Business Unit";
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
        logs.menu_Index = "7AE391F4-D1CB-4FE2-A61B-1E42F40B0FFF";
        //logs.menuType_Index
        //logs.menu_Id
        logs.menu_Name = "ReportSupport";
        logs.sub_Menu_Index = "EF23353C-E4AF-435B-BF04-BD3D5ED0FB3A";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "Report GI by Shipment Date & Business Unit";
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

      $scope.$watch("filterModel.product_Id + filterModel.product_Name", function () {
        if ($scope.filterModel.product_Index == "" || $scope.filterModel.product_Index == undefined) {
          $scope.filterModel.product_Id = '';
          $scope.filterModel.product_Name = '';
        }
      });

      function formatDate() {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
      }

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        // $scope.filterModel.date = getToday();
        $scope.filterModel.report_Date = getToday();
        $scope.filterModel.report_Date_To = getToday();
        $scope.filterModel.date = formatDate();
        $scope.dropdownBusinessUnit();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };

    }
  });
})();