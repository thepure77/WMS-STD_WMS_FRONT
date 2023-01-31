(function () {
  "use strict";

  app.component("reportRecallInboundSummary", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportRecallInbound/reportRecallInboundSummary.html",
    controller: function ($scope,$filter,$http,$sce,/*ngAuthSettings,*/$state,/*authService*/pageLoading,$window,commonService,localStorageService,$timeout,$translate,$q,dpMessageBox,webServiceAPI,reportRecallInboundFactory,logsFactory) 
    {
      var $vm = this;
      var viewModel = reportRecallInboundFactory;

      $scope.isFilter = true;
      $scope.isShow = false;
      $scope.filterModel = {};
      
      $scope.getuseDate = false;

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
          $scope.filterModel.useDate_GR = 0
          $scope.filterModel.useDate_MFG = 0
          $scope.filterModel.useDate_EXP = 0
          if ($scope.filterModel.useDate_1 === 0 || $scope.filterModel.useDate_MFG === 0 || $scope.filterModel.useDate_EXP === 0 || $scope.filterModel.useDate_GR === 0){
            // $scope.useDate();
            $scope.filterModel.dateGR = formatDate();
            $scope.filterModel.date_MFG = formatDate();
            $scope.filterModel.date_Exp = formatDate();
         }
      }
      };
      

      $scope.clearSearch = function () {
        debugger;
        $scope.filterModel = {};
        $scope.filterModel.advanceSearch = true;
        // $scope.filterModel.date = formatDate();

        $scope.filterModel.date_Exp = "01/01/2019 - 01/12/2024";
        $scope.filterModel.date_MFG = "01/01/2019 - 01/12/2024";
        $scope.filterModel.dateGR = formatDate();
 

      }

      // $scope.clearDate = function () {
      //   debugger;
      //   // $scope.filterModel = {};
      //   $scope.filterModel.date_Exp = " ";
      //   $scope.filterModel.date_MFG = " ";
      //   $scope.filterModel.date_GI = formatDate();
      //   $scope.filterModel.dateload = formatDate();
      //   $scope.filterModel.dateGR = formatDate();
      //   $scope.filterModel.dateDo = formatDate();

      // }

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

        // if ($scope.filterModel.date != null) {
        //   var str = $scope.filterModel.date;

        //   var DStart = str.substring(0, 2);
        //   var MStart = str.substring(5, 3);
        //   var YStart = str.substring(10, 6);
        
        //   $scope.filterModel.goodsReceive_date = YStart.toString() + MStart.toString() + DStart.toString();

        //   var DEnd = str.substring(15, 13);
        //   var MEnd = str.substring(18, 16);
        //   var YEnd = str.substring(25, 19);

        //   $scope.filterModel.goodsReceive_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
        // }

        // date GR
        if ($scope.filterModel.dateGR != null ) {
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
      };  


      $scope.searchReport = function (param) {
        if(!param.advanceSearch)
        {
            if($('input[name="datefilter"]').val().length > 0)
            {
                $scope.filterModel.dateGR = $('input[name="datefilter"]').val();
            }
        } else {
            if($('input[name="datefilterAdv"]').val().length > 0)
            {
                $scope.filterModel.dateGR = $('input[name="datefilterAdv"]').val();
                $scope.filterModel.date_Exp = $('input[name="datefilterAdvEXP"]').val();
                $scope.filterModel.date_MFG = $('input[name="datefilterAdvMFG"]').val();

            }
        }
        // if ($scope.filterModel.date != null) {
          debugger
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
        
        if (param.dateGR == undefined || param.dateGR == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GR'
          })
          return ""; 
        }

        if ($scope.filterModel.materialNo == undefined || $scope.filterModel.materialNo == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณากรอกข้อมูล Material No.'
          })
          return ""; 
        }
        pageLoading.show();
        viewModel.PrintReportRecall(param).then(
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
        if ($scope.filterModel.ambientRoom == undefined || $scope.filterModel.ambientRoom == "" || $scope.filterModel.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
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
        
        if ($scope.filterModel.dateGR == undefined || $scope.filterModel.dateGR == "") {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกช่วงวันที่ GR'
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
        $scope.filterModel.excelName = "Report_Recall_Inbound";
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

      $scope.autoComplete = {
        basicSearch: "GoodsReceive/autobasicSuggestion",
        autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
        autoProduct: "Autocomplete/autoProductId",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        shipToName: "autoShipTo/autoSearchShipToFilter",
        planGoodsIssue_No: "AutoPlanGoodIssue/autoPlanGoodIssueNo",
        GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",     
        // autoPo: "Autocomplete/AutobasicSuggestion",
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
        logs.menu_Name = "";
        logs.sub_Menu_Index = "6191C5CE-A0C4-492E-A891-66C7355691EE";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "";
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
          $scope.dropdownDocumentType = res.data;
        });
      };

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.dateGR = formatDate();
        // $scope.filterModel.dateGR = "xx/xx/xxxx - xx/xx/xxxx";
        $scope.filterModel.date_Exp = "01/01/2019 - 01/12/2024";
        $scope.filterModel.date_MFG = "01/01/2019 - 01/12/2024";

        $scope.dropdownDocumentType();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();