(function () {
  "use strict";

  app.component("reportMovementV2", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportMovementV2/reportMovementV2.html",
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
      reportMovementV2Factory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportMovementV2Factory;

      $scope.isFilter = true;
      $scope.isShow = false;

      //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

      $scope.getuseDate = false;

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

      // AdvanceSearch
      $scope.header = {
        advanceSearch: false
      };

      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
        if($scope.filterModel.advanceSearch == true || $scope.filterModel.advanceSearch == false){
          $scope.filterModel.useDate = 0
          $scope.filterModel = "";
          if ($scope.filterModel.useDate === 0){
            $scope.filterModel.date = formatDate();
            
         }
      }
      };


      $scope.convertDate = function () {
        debugger
        if ($scope.filterModel.goodsReceive_Date_ != null) {
          var str = $scope.filterModel.goodsReceive_Date_;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.goodsReceive_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.goodsReceive_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

        if ($scope.filterModel.goodsReceive_MFG_Date_ != null) {
          var str = $scope.filterModel.goodsReceive_MFG_Date_;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.goodsReceive_MFG_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.goodsReceive_MFG_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

        if ($scope.filterModel.goodsReceive_EXP_Date_ != null) {
          var str = $scope.filterModel.goodsReceive_EXP_Date_;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.goodsReceive_EXP_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.goodsReceive_EXP_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };


      $scope.searchReport = function (param) {
        debugger
        if($scope.header.advanceSearch == false)
        {
          param.goodsReceive_Date = "";
          $scope.filterModel.goodsReceive_Date_ = "";
          param.goodsReceive_Date_To = "";
          param.goodsReceive_MFG_Date = "";
          $scope.filterModel.goodsReceive_MFG_Date_ = "";
          param.goodsReceive_MFG_Date_To = "";
          param.goodsReceive_EXP_Date = "";
          $scope.filterModel.goodsReceive_EXP_Date_ = "";
          param.goodsReceive_EXP_Date_To = "";
        }
        if ($scope.filterModel.goodsReceive_Date_ != null || $scope.filterModel.goodsReceive_MFG_Date_ != null || $scope.filterModel.goodsReceive_EXP_Date_ != null) {
          $scope.convertDate();
        }
        if (param.warehouse_Type == undefined || param.warehouse_Type == "" || param.warehouse_Type == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
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

      $scope.changeSet = function () {
        debugger
         if ($scope.filterModel.useDate === 1){
            // $scope.notuseDate();
            $scope.filterModel.date = " ";
         }
         if ($scope.filterModel.useDate === 0){
            // $scope.useDate();
            $scope.filterModel.date = formatDate();
         }
      }

      $scope.clearSearch = function () {
        debugger;
        $scope.filterModel = {};
        $scope.filterModel.advanceSearch = true;
        $scope.filterModel.date = formatDate();
      }

      $scope.autoComplete = {
        autoSku: "Autocomplete/autoProductId",
        autoOwner: "ReportAutocomplete/autoOwner",
        autoOwnerID: "ReportLaborPerformance/autoSearchOwnerID",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        billing: "AutoPlanGoodIssue/AutoBilling_No",
        autoGINo: "ReportAutocomplete/autoGINo",
        location: "autoLocation/autoSearchLocationFilter",
      };

      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
        GR: webServiceAPI.GR,
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
        if($scope.header.advanceSearch == false)
        {
          $scope.filterModel.goodsReceive_Date = "";
          $scope.filterModel.goodsReceive_Date_ = "";
          $scope.filterModel.goodsReceive_Date_To = "";
          $scope.filterModel.goodsReceive_MFG_Date = "";
          $scope.filterModel.goodsReceive_MFG_Date_ = "";
          $scope.filterModel.goodsReceive_MFG_Date_To = "";
          $scope.filterModel.goodsReceive_EXP_Date = "";
          $scope.filterModel.goodsReceive_EXP_Date_ = "";
          $scope.filterModel.goodsReceive_EXP_Date_To = "";
        }
        if ($scope.filterModel.goodsReceive_Date_ != null || $scope.filterModel.goodsReceive_MFG_Date_ != null || $scope.filterModel.goodsReceive_EXP_Date_ != null) {
          $scope.convertDate();
        }
        if ($scope.filterModel.warehouse_Type == undefined || $scope.filterModel.warehouse_Type == "" || $scope.filterModel.warehouse_Type == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        // if($scope.filterModel.date == undefined ||  $scope.filterModel.date == "")
        // {
        //   return dpMessageBox.alert(
        //     {
        //         ok: 'Close',
        //         title: 'แจ้งเตือน',
        //         message: 'กรุณาระบุวันที่'
        //     })
        // } 
        // if($scope.filterModel.report_Date == undefined ||  $scope.filterModel.report_Date == "")
        // {
        //   return dpMessageBox.alert(
        //     {
        //         ok: 'Close',
        //         title: 'แจ้งเตือน',
        //         message: 'กรุณาระบุวันที่'
        //     })
        // }
        // if($scope.filterModel.report_Date_To == undefined || $scope.filterModel.report_Date_To == "")
        // {
        //   return dpMessageBox.alert(
        //     {
        //         ok: 'Close',
        //         title: 'แจ้งเตือน',
        //         message: 'กรุณาระบุวันที่'
        //     })
        // }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report Movement";
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
        logs.menu_Index = "A21FE90E-E0AB-47E9-8290-AD5A5D8AC8F1";
        //logs.menuType_Index
        //logs.menu_Id
        logs.menu_Name = "ReportSupport";
        logs.sub_Menu_Index = "EF23353C-E4AF-435B-BF04-BD3D5ED0FB3A";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "Report Movement";
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

      $scope.$watch("filterModel.owner_Id + filterModel.owner_Index", function () {
        if ($scope.filterModel.owner_Index == "" || $scope.filterModel.owner_Index == undefined) {
          $scope.filterModel.owner_Id = '';
          $scope.filterModel.owner_Name = '';
        }
      });

      function formatDate() {
        debugger;
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
        $scope.filterModel.goodsReceive_Date = getToday();
        $scope.filterModel.goodsReceive_Date_To = getToday();
        $scope.filterModel.goodsReceive_MFG_Date = getToday();
        $scope.filterModel.goodsReceive_MFG_Date_To = getToday();
        $scope.filterModel.goodsReceive_EXP_Date = getToday();
        $scope.filterModel.goodsReceive_EXP_Date_To = getToday();
        $scope.filterModel.goodsReceive_Date_ = formatDate();
        $scope.filterModel.goodsReceive_MFG_Date_ = formatDate();
        $scope.filterModel.goodsReceive_EXP_Date_ = formatDate();
        $scope.dropdownBusinessUnit();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();

$scope.filterModel.goodsReceive_Date = "";
          $scope.filterModel.goodsReceive_Date_ = "";
          $scope.filterModel.goodsReceive_Date_To = "";
          $scope.filterModel.goodsReceive_MFG_Date = "";
          $scope.filterModel.goodsReceive_MFG_Date_ = "";
          $scope.filterModel.goodsReceive_MFG_Date_To = "";
          $scope.filterModel.goodsReceive_EXP_Date = "";
          $scope.filterModel.goodsReceive_EXP_Date_ = "";
          $scope.filterModel.goodsReceive_EXP_Date_To = "";