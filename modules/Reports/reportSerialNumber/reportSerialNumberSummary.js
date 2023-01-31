(function () {
  "use strict";

  app.component("reportSerialNumberSummary", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportSerialNumber/reportSerialNumberSummary.html",
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
      reportSerialNumberFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportSerialNumberFactory;

      $scope.getuseDate = false;

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

      // AdvanceSearch
      $scope.header = {
        advanceSearch: false
      };

      $scope.clearSearch = function () {
        debugger;
        $scope.filterModel = {};
        $scope.filterModel.date_GI = formatDate();
      }
      

      function formatDate() {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
      }

      $scope.convertDate = function () {

      //date font date GI
          debugger;
        if ($scope.filterModel.date_GI != null) {
          var str_gi = $scope.filterModel.date_GI;

          var DStart_gi = str_gi.substring(0, 2);
          var MStart_gi = str_gi.substring(5, 3);
          var YStart_gi = str_gi.substring(10, 6);

          $scope.filterModel.goodsIssue_date = YStart_gi.toString() + MStart_gi.toString() + DStart_gi.toString();

          var DEnd_gi = str_gi.substring(15, 13);
          var MEnd_gi = str_gi.substring(18, 16);
          var YEnd_gi = str_gi.substring(25, 19);

          $scope.filterModel.goodsIssue_date_to = YEnd_gi.toString() + MEnd_gi.toString() + DEnd_gi.toString();
        }

      };  


      $scope.searchReport = function (param) {
        debugger;

          if ($('input[name="datefilter_GI"]').val().length > 0) {
            $scope.filterModel.date_GI = $('input[name="datefilter_GI"]').val();
          }

        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        if (param.date_GI == undefined || param.date_GI == "" && $scope.filterModel.useDate_1 === 0) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GI / Wave No.'
          })
          return ""; 
        }
        
        $scope.convertDate();
        
        
        pageLoading.show();
        debugger;
        viewModel.printReportSerialNumber(param).then(
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
        // if ($scope.filterModel.date != null) {
          $scope.convertDate();
        // }
        if ($scope.filterModel.date_GI == undefined || $scope.filterModel.date_GI == "" && $scope.filterModel.useDate_1 === 0) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GI / Wave No.'
          })
          return ""; 
        }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report_Serial_Number";
        pageLoading.show();
        debugger
        viewModel.ExportExcel($scope.filterModel).then(
          function success(results) {
            pageLoading.hide();
            deferred.resolve(results);
          },
          function error(response) {
            pageLoading.hide();
            dpMessageBox.alert({
              title: 'Information.',
              message: "Connect Service Fail."
            })
            deferred.reject(response);
          }
        );
        return deferred.promise;
      }


      // main menu
      $scope.changeSet_1 = function () {
        debugger
         if ($scope.filterModel.useDate_1 === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_GI = "";
            $scope.filterModel.goodsIssue_date = "";
            $scope.filterModel.goodsIssue_date_to = "";
         }
         if ($scope.filterModel.useDate_1 === 0){
            // $scope.useDate();
            $scope.filterModel.date_GI = formatDate();
         
         }
      }

      $scope.autoComplete = {
        autoSku: "Autocomplete/autoProductId",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        autoGoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",     
        GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
      };

      $scope.url = {
        Master: webServiceAPI.Master,
        PlanGI: webServiceAPI.PlanGI,
        GI: webServiceAPI.GI,
      };

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
        logs.sub_Menu_Index = "D01677A4-2348-459E-A442-B8E188C0A329";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "ReportSerialNumber";
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



      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};

        $scope.filterModel.date_GI = formatDate();

        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();