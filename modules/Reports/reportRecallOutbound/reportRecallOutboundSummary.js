(function () {
  "use strict";

  app.component("reportRecallOutboundSummary", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportRecallOutbound/reportRecallOutboundSummary.html",
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
      reportRecallOutboundFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportRecallOutboundFactory;

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

      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
        if($scope.filterModel.advanceSearch == true || $scope.filterModel.advanceSearch == false){
          $scope.filterModel.useDate_1 = 0
            $scope.filterModel.useDate_2 = 0
            $scope.filterModel.useDate_MFG = 0
            $scope.filterModel.useDate_EXP = 0
          if ($scope.filterModel.useDate_1 === 0 || $scope.filterModel.useDate_2 === 0 ||  $scope.filterModel.useDate_MFG === 0 || $scope.filterModel.useDate_EXP === 0){
            // $scope.useDate();
            $scope.filterModel.date_MFG = formatDate();
            $scope.filterModel.date_Exp = formatDate();
            $scope.filterModel.date_GI = formatDate();
            $scope.filterModel.dateload = formatDate();
         }
      }
      };
      

      $scope.clearSearch = function () {
        debugger;
        $scope.filterModel = {};

        $scope.filterModel.date_GI = formatDate();
        $scope.filterModel.dateload = formatDate();

        $scope.filterModel.date_Exp = "01/01/2019 - 31/12/2024";
        $scope.filterModel.date_MFG = "01/01/2019 - 31/12/2024";

        $scope.filterModel.advanceSearch = true;
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

          //date font date Exp
        if ($scope.filterModel.date_Exp != null) {
          var str_exp = $scope.filterModel.date_Exp;

          var DStart_exp = str_exp.substring(0, 2);
          var MStart_exp = str_exp.substring(5, 3);
          var YStart_exp = str_exp.substring(10, 6);

          $scope.filterModel.date_exp = YStart_exp.toString() + MStart_exp.toString() + DStart_exp.toString();

          var DEnd_exp = str_exp.substring(15, 13);
          var MEnd_exp = str_exp.substring(18, 16);
          var YEnd_exp = str_exp.substring(25, 19);

          $scope.filterModel.date_exp_to = YEnd_exp.toString() + MEnd_exp.toString() + DEnd_exp.toString();
        }


          //date Advanced date MFG
          if ($scope.filterModel.date_MFG != null) {
          var str_mfg = $scope.filterModel.date_MFG;

          var DStart_mfg = str_mfg.substring(0, 2);
          var MStart_mfg = str_mfg.substring(5, 3);
          var YStart_mfg = str_mfg.substring(10, 6);

          $scope.filterModel.date_mfg = YStart_mfg.toString() + MStart_mfg.toString() + DStart_mfg.toString();

          var DEnd_mfg = str_mfg.substring(15, 13);
          var MEnd_mfg = str_mfg.substring(18, 16);
          var YEnd_mfg = str_mfg.substring(25, 19);

          $scope.filterModel.date_mfg_to = YEnd_mfg.toString() + MEnd_mfg.toString() + DEnd_mfg.toString();
          }


          //date Advanced date Load
          if ($scope.filterModel.dateload != null) {
          var str_load = $scope.filterModel.dateload;

          var DStart_load = str_load.substring(0, 2);
          var MStart_load = str_load.substring(5, 3);
          var YStart_load = str_load.substring(10, 6);

          $scope.filterModel.date_load = YStart_load.toString() + MStart_load.toString() + DStart_load.toString();

          var DEnd_load = str_load.substring(15, 13);
          var MEnd_load = str_load.substring(18, 16);
          var YEnd_load = str_load.substring(25, 19);

          $scope.filterModel.date_load_to = YEnd_load.toString() + MEnd_load.toString() + DEnd_load.toString();
          }
      };  

      $scope.changeSet = function () {
        debugger
         if ($scope.filterModel.useDate === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_MFG = " ";
            $scope.filterModel.date_Exp = " ";
         }
         if ($scope.filterModel.useDate === 0){
            // $scope.useDate();
            $scope.filterModel.date_MFG = formatDate();
            $scope.filterModel.date_Exp = formatDate();
         }
      }

      $scope.searchReport = function (param) {
        debugger;
        if ($scope.filterModel.advanceSearch) {
          if ($('input[name="datefilterAdv_GI"]').val().length > 0) {
            $scope.filterModel.date_GI = $('input[name="datefilterAdv_GI"]').val();
          }
          if ($('input[name="datefilterAdv_Load"]').val().length > 0) {
            $scope.filterModel.dateload = $('input[name="datefilterAdv_Load"]').val();
          }
          if ($('input[name="datefilterAdv_MFG"]').val().length > 0) {
            $scope.filterModel.date_MFG = $('input[name="datefilterAdv_MFG"]').val();
          }
          if ($('input[name="datefilterAdv_EXP"]').val().length > 0) {
            $scope.filterModel.date_Exp = $('input[name="datefilterAdv_EXP"]').val();
          }
        } else {
          if ($('input[name="datefilter_GI"]').val().length > 0) {
            $scope.filterModel.date_GI = $('input[name="datefilter_GI"]').val();
          }
          if ($('input[name="datefilter_Load"]').val().length > 0) {
            $scope.filterModel.dateload = $('input[name="datefilter_Load"]').val();
          }
        }

        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        if (param.date_GI == undefined || param.date_GI == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GI / Wave No.'
          })
          return ""; 
        }
        if (param.date_Exp == undefined || param.date_Exp == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ EXP'
          })
          return ""; 
        }
        if (param.date_MFG == undefined || param.date_MFG == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ MFG'
          })
          return ""; 
        }
        if (param.dateload == undefined || param.dateload == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ Load'
          })
          return ""; 
        }
        

        if ($scope.filterModel.materialNo == undefined || $scope.filterModel.materialNo == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณากรอก Material No.'
          })
          return ""; 
        }
        $scope.convertDate();
        
        
        pageLoading.show();
        viewModel.PrintReportThanawat(param).then(
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
        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        if ($scope.filterModel.date_GI == undefined || $scope.filterModel.date_GI == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GI / Wave No.'
          })
          return ""; 
        }
        if ($scope.filterModel.date_Exp == undefined || $scope.filterModel.date_Exp == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ EXP'
          })
          return ""; 
        }
        if ($scope.filterModel.date_MFG == undefined || $scope.filterModel.date_MFG == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ MFG'
          })
          return ""; 
        }
        if ($scope.filterModel.dateload == undefined || $scope.filterModel.dateload == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ Load'
          })
          return ""; 
        }
        

        if ($scope.filterModel.materialNo == undefined || $scope.filterModel.materialNo == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณากรอก Material No.'
          })
          return ""; 
        }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report_Recall_Outbound";
        pageLoading.show();
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
            $scope.filterModel.date_GI = " ";

         }
         if ($scope.filterModel.useDate_1 === 0){
            // $scope.useDate();
            $scope.filterModel.date_GI = formatDate();
         
         }
      }
      $scope.changeSet_2 = function () {
        debugger
         if ($scope.filterModel.useDate_2 === 1){
            // $scope.notuseDate();
            $scope.filterModel.dateload = " ";
            
         }
         if ($scope.filterModel.useDate_2 === 0){
            // $scope.useDate();
            
            $scope.filterModel.dateload = formatDate();
         }
      }

      //Advance Search

      $scope.changeSet_MFG = function () {
        debugger
         if ($scope.filterModel.useDate_MFG === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_MFG = " ";
            
         }
         if ($scope.filterModel.useDate_MFG === 0){
            // $scope.useDate();
            $scope.filterModel.date_MFG = formatDate();
    
         }
      }
      $scope.changeSet_EXP = function () {
        debugger
         if ($scope.filterModel.useDate_EXP === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_Exp = " ";
         }
         if ($scope.filterModel.useDate_EXP === 0){
            // $scope.useDate();
            $scope.filterModel.date_Exp = formatDate();
         }
      }
      $scope.changeSet_GI = function () {
        debugger
         if ($scope.filterModel.useDate_GI === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_GI = " ";
            
         }
         if ($scope.filterModel.useDate_GI === 0){
            // $scope.useDate();
            $scope.filterModel.date_GI = formatDate();
    
         }
      }
      $scope.changeSet_LOAD = function () {
        debugger
         if ($scope.filterModel.useDate_LOAD === 1){
            // $scope.notuseDate();
            $scope.filterModel.dateload = " ";
         }
         if ($scope.filterModel.useDate_LOAD === 0){
            // $scope.useDate();
            $scope.filterModel.dateload = formatDate();
         }
      }



      // function getToday() {
      //   var today = new Date();
      //   var mm = today.getMonth() + 1;
      //   var yyyy = today.getUTCFullYear();
      //   var dd = today.getDate();
      //   if (dd < 10) dd = '0' + dd;
      //   if (mm < 10) mm = '0' + mm;
      //   return yyyy.toString() + mm.toString() + dd.toString();
      // }

      $scope.autoComplete = {
        basicSearch: "GoodsReceive/autobasicSuggestion",
        autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
        autoProduct: "Autocomplete/autoProductId",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        shipToName: "autoShipTo/autoSearchShipToFilter",
        planGoodsIssue_No: "AutoPlanGoodIssue/autoPlanGoodIssueNo",
        GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",     
        autoPo: "Autocomplete/AutobasicSuggestion",
        autoPoV2: "Autocomplete/autobasicSuggestionPO",
        GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
        vendor: "Autocomplete/autoSearchVendor",
        autoSku : "Autocomplete/autoSku",

      };

      $scope.url = {
        PlanGR: webServiceAPI.PlanGR,
        GR: webServiceAPI.GR,
        Master: webServiceAPI.Master,
        PO: webServiceAPI.PO,
        PlanGI: webServiceAPI.PlanGI,
        GI: webServiceAPI.GI,
        Load: webServiceAPI.Load,
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
        logs.sub_Menu_Name = "รายงานการเรียกคืน";
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
        $scope.filterModel.dateload = formatDate();

        $scope.filterModel.date_Exp = "01/01/2019 - 31/12/2024";
        $scope.filterModel.date_MFG = "01/01/2019 - 31/12/2024";


        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();