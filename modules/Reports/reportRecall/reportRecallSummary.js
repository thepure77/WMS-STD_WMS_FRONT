(function () {
  "use strict";

  app.component("reportRecallSummary", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportRecall/reportRecallSummary.html",
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
      reportRecallFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportRecallFactory;

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
            $scope.filterModel.useDate_3 = 0
            $scope.filterModel.useDate_DO = 0
            $scope.filterModel.useDate_GI = 0
            $scope.filterModel.useDate_LOAD = 0
            if ($scope.filterModel.useDate_1 === 0 ||$scope.filterModel.useDate_2 === 0 || $scope.filterModel.useDate_3 === 0 ||$scope.filterModel.useDate_DO === 0 || $scope.filterModel.useDate_GI === 0 || $scope.filterModel.useDate_LOAD === 0){
              // $scope.useDate();
              $scope.filterModel.dateGR = formatDate();
              $scope.filterModel.date_MFG = formatDate();
              $scope.filterModel.date_Exp = formatDate();
              $scope.filterModel.dateDo = formatDate();
              $scope.filterModel.date_GI = formatDate();
              $scope.filterModel.dateload = formatDate();
           }
        }
      };
      

      $scope.clearSearch = function () {
        debugger;
        $scope.filterModel = {};
        $scope.filterModel.date = formatDate();

        $scope.filterModel.date_GI = formatDate();
        $scope.filterModel.date_Exp = formatDate();

        $scope.filterModel.date_MFG = formatDate();
        $scope.filterModel.dateload = formatDate();
        $scope.filterModel.dateGR = formatDate();
        $scope.filterModel.dateDo = formatDate();

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
        if ($scope.filterModel.dateGR == undefined || $scope.filterModel.dateGR == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GR'
          })
          return ""; 
        }
        if ($scope.filterModel.dateDo == undefined || $scope.filterModel.dateDo == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ DO'
          })
          return ""; 
        }
        else{
        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);
        
          $scope.filterModel.goodsReceive_date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.goodsReceive_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

          //date font date GI
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


          //date Advanced date GR
          if ($scope.filterModel.dateGR != null) {
          var str_gr = $scope.filterModel.dateGR;

          var DStart_gr= str_gr.substring(0, 2);
          var MStart_gr = str_gr.substring(5, 3);
          var YStart_gr = str_gr.substring(10, 6);

          $scope.filterModel.date_gr = YStart_gr.toString() + MStart_gr.toString() + DStart_gr.toString();

          var DEnd_gr = str_gr.substring(15, 13);
          var MEnd_gr = str_gr.substring(18, 16);
          var YEnd_gr = str_gr.substring(25, 19);

          $scope.filterModel.date_gr_to = YEnd_gr.toString() + MEnd_gr.toString() + DEnd_gr.toString();
        }

        //date Advanced date Do
        if ($scope.filterModel.dateDo != null) {
          var str_do = $scope.filterModel.dateDo;

          var DStart_do = str_do.substring(0, 2);
          var MStart_do = str_do.substring(5, 3);
          var YStart_do = str_do.substring(10, 6);

          $scope.filterModel.date_do = YStart_do.toString() + MStart_do.toString() + DStart_do.toString();

          var DEnd_do = str_do.substring(15, 13);
          var MEnd_do = str_do.substring(18, 16);
          var YEnd_do = str_do.substring(25, 19);

          $scope.filterModel.date_do_to = YEnd_do.toString() + MEnd_do.toString() + DEnd_do.toString();
        }
      }
      };  


      $scope.searchReport = function (param) {
        // if ($scope.filterModel.date != null) {
          debugger
          $scope.convertDate();
        // }
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
        if (param.dateGR == undefined || param.dateGR == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GR'
          })
          return ""; 
        }
        if (param.dateDo == undefined || param.dateDo == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ DO'
          })
          return ""; 
        }
        if ($scope.dropdownDocumentType.model == undefined) 
        {
          $scope.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
          $scope.filterModel.documentType_Id = undefined;
          $scope.filterModel.documentType_Name = undefined;

        }else{
          $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
          $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
          $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
        }
        
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
        if ($scope.filterModel.dateGR == undefined || $scope.filterModel.dateGR == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GR'
          })
          return ""; 
        }
        if ($scope.filterModel.dateDo == undefined || $scope.filterModel.dateDo == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ DO'
          })
          return ""; 
        }

        if ($scope.dropdownDocumentType.model == undefined) 
        {
          $scope.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
          $scope.filterModel.documentType_Id = undefined;
          $scope.filterModel.documentType_Name = undefined;

        }else{
          $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
          $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
          $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
        }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report_Recall";
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

      function getToday() {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return yyyy.toString() + mm.toString() + dd.toString();
      }


      // main menu
      $scope.changeSet_1 = function () {
        debugger
         if ($scope.filterModel.useDate_1 === 1){
            // $scope.notuseDate();
            $scope.filterModel.dateGR = " ";

         }
         if ($scope.filterModel.useDate_1 === 0){
            // $scope.useDate();
            $scope.filterModel.dateGR = formatDate();
         
         }
      }
      $scope.changeSet_2 = function () {
        debugger
         if ($scope.filterModel.useDate_2 === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_MFG = " ";
            
         }
         if ($scope.filterModel.useDate_2 === 0){
            // $scope.useDate();
            $scope.filterModel.date_MFG = formatDate();
    
         }
      }
      $scope.changeSet_3 = function () {
        debugger
         if ($scope.filterModel.useDate_3 === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_Exp = " ";
         }
         if ($scope.filterModel.useDate_3 === 0){
            // $scope.useDate();
            $scope.filterModel.date_Exp = formatDate();
         }
      }


      // advace search 
      $scope.changeSet_GR = function () {
        debugger
         if ($scope.filterModel.useDate_GR === 1){
            // $scope.notuseDate();
            $scope.filterModel.dateGR = " ";

         }
         if ($scope.filterModel.useDate_GR === 0){
            // $scope.useDate();
            $scope.filterModel.dateGR = formatDate();
         
         }
      }
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
      $scope.changeSet_DO = function () {
        debugger
         if ($scope.filterModel.useDate_DO === 1){
            // $scope.notuseDate();
            $scope.filterModel.dateDo = " ";

         }
         if ($scope.filterModel.useDate_DO === 0){
            // $scope.useDate();
            $scope.filterModel.dateDo = formatDate();
         
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
        logs.sub_Menu_Index = "6191C5CE-A0C4-492E-A891-66C7355691EE";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "รายงานสรุปการรับสินค้า";
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

      $scope.status = [{
          value: 0,
          display: "รอการยืนยัน"
        },
        {
          value: 1,
          display: "ยืนยัน"
        },
        {
          value: 2,
          display: "รอจัดเก็บ"
        },
        {
          value: 3,
          display: "มอบหมายงาน"
        },
        {
          value: 4,
          display: "จัดเก็บเสร็จสิ้น"
        },
        {
          value: -1,
          display: "ยกเลิก"
        },
      ];

      $scope.dropdownDocumentType = function () {
        viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
          $scope.dropdownDocumentType = res.data;
        });
      };


      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        // $scope.filterModel.goodsReceive_date = getToday();
        // $scope.filterModel.goodsReceive_date_To = getToday();
        // $scope.filterModel.goodsIssue_date.formatDate();
        // $scope.filterModel.goodsIssue_date_to.formatDate();

        // $scope.filterModel.date_exp.formatDate();
        // $scope.filterModel.date_exp_to.formatDate();

        // $scope.filterModel.date_mfg.formatDate();
        // $scope.filterModel.date_mfg_to.formatDate();

        // $scope.filterModel.date_load.formatDate();
        // $scope.filterModel.date_load_to.formatDate();

        // $scope.filterModel.date_GR.formatDate();
        // $scope.filterModel.date_GR_to.formatDate();
        
        $scope.filterModel.date_GI = formatDate();
        $scope.filterModel.date_Exp = formatDate();

        $scope.filterModel.date_MFG = formatDate();
        $scope.filterModel.dateload = formatDate();
        $scope.filterModel.dateGR = formatDate();
        $scope.filterModel.dateDo = formatDate();

        $scope.dropdownDocumentType();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();