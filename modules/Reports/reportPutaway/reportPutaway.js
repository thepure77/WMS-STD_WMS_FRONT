(function () {
  "use strict";

  app.component("reportPutaway", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportPutaway/reportPutaway.html",
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
      reportPutawayFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportPutawayFactory;

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
          $scope.filterModel.useDate_1 = 0
          $scope.filterModel.useDate_GR = 0
          
          if ($scope.filterModel.useDate === 0){
            $scope.filterModel.date = formatDate();
            $scope.filterModel.date_GR = formatDate();
            $scope.filterModel.date_Create = formatDate();
            
         }
      }
      };


      $scope.convertDate = function () {
        debugger
        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.report_date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.report_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

        if ($scope.filterModel.date_GR != null) {
          var str_Gr = $scope.filterModel.date_GR;

          var DStart_Gr = str_Gr.substring(0, 2);
          var MStart_Gr = str_Gr.substring(5, 3);
          var YStart_Gr = str_Gr.substring(10, 6);

          $scope.filterModel.GR_Date_From = YStart_Gr.toString() + MStart_Gr.toString() + DStart_Gr.toString();

          var DEnd_Gr = str_Gr.substring(15, 13);
          var MEnd_Gr = str_Gr.substring(18, 16);
          var YEnd_Gr = str_Gr.substring(25, 19);

          $scope.filterModel.GR_Date_To = YEnd_Gr.toString() + MEnd_Gr.toString() + DEnd_Gr.toString();
        }

        if ($scope.filterModel.date_Create != null) {
          var str_Cre = $scope.filterModel.date_Create;

          var DStart_Cre = str_Cre.substring(0, 2);
          var MStart_Cre = str_Cre.substring(5, 3);
          var YStart_Cre = str_Cre.substring(10, 6);

          $scope.filterModel.PutAway_Date_From = YStart_Cre.toString() + MStart_Cre.toString() + DStart_Cre.toString();

          var DEnd_Cre = str_Cre.substring(15, 13);
          var MEnd_Cre = str_Cre.substring(18, 16);
          var YEnd_Cre = str_Cre.substring(25, 19);

          $scope.filterModel.PutAway_Date_To = YEnd_Cre.toString() + MEnd_Cre.toString() + DEnd_Cre.toString();
        }
        

      };


      $scope.searchReport = function (param) {
        debugger
        if(!$scope.filterModel.advanceSearch)
        {
            if($('input[name="datefilter"]').val().length > 0)
            {
              $scope.filterModel.date = $('input[name="datefilter"]').val();
            }
            if($scope.filterModel.date == undefined || $scope.filterModel.date == "" || $scope.filterModel.date == null
            || $scope.filterModel.date != null || $scope.filterModel.date != "" || $scope.filterModel.date != null){
              $scope.filterModel.date_GR = "";
              $scope.filterModel.date_Create = "";
            }
        } else {
            if($('input[name="datefilterGr"]').val().length > 0)
            {   
                $scope.filterModel.date_GR = $('input[name="datefilterGr"]').val();
            }
            if($('input[name="datefilterPuta"]').val().length > 0)
            {
                $scope.filterModel.date_Create = $('input[name="datefilterPuta"]').val();
            }
            if($scope.filterModel.date_GR == undefined || $scope.filterModel.date_GR == "" || $scope.filterModel.date_GR == null
            || $scope.filterModel.date_GR != null || $scope.filterModel.date_GR != "" || $scope.filterModel.date_GR != null){
              $scope.filterModel.date = "";
            }
        }
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
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
            $scope.filterModel.date = "";
         }
         if ($scope.filterModel.useDate === 0){
            // $scope.useDate();
            $scope.filterModel.date = formatDate();
         }
      }

      $scope.changeSet_GR = function () {
        debugger
         if ($scope.filterModel.useDate_GR === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_GR = "";
            
         }
         if ($scope.filterModel.useDate_GR === 0){
            // $scope.useDate();
            $scope.filterModel.date_GR = formatDate();
    
         }
      }

      $scope.changeSet_1 = function () {
        debugger
         if ($scope.filterModel.useDate_1 === 1){
            // $scope.notuseDate();
            $scope.filterModel.date_Create = "";

         }
         if ($scope.filterModel.useDate_1 === 0){
            // $scope.useDate();
            $scope.filterModel.date_Create = formatDate();
         
         }
      }

      $scope.clearSearch = function () {
        debugger;
        $scope.filterModel = {};
        $scope.filterModel.advanceSearch = true;
        $scope.filterModel.date = formatDate();
        $scope.filterModel.date_GR = formatDate();
        $scope.filterModel.date_Create = formatDate();
      }

      $scope.autoComplete = {
        autoProduct: "Autocomplete/autoProductId",
        autoOwner: "ReportAutocomplete/autoOwner",
        autoOwnerID: "ReportLaborPerformance/autoSearchOwnerID",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        billing: "AutoPlanGoodIssue/AutoBilling_No",
        autoGINo: "ReportAutocomplete/autoGINo",
        location: "autoLocation/autoSearchLocationFilter",
        autoPoV2: "Autocomplete/autobasicSuggestionPO",
        autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
        autoOwnerID: "ReportSummaryMaterialsStock/autoSearchOwnerID",
        vendor: "Autocomplete/autoSearchVendor"
      };

      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
        GR: webServiceAPI.GR,
        Load: webServiceAPI.Load,
        PlanGI: webServiceAPI.PlanGI,
        PO: webServiceAPI.PO,
        PlanGR: webServiceAPI.PlanGR,
        Report: webServiceAPI.Report
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
        if(!$scope.filterModel.advanceSearch)
        {
            if($('input[name="datefilter"]').val().length > 0)
            {
              $scope.filterModel.date = $('input[name="datefilter"]').val();
            }
            if($scope.filterModel.date == undefined || $scope.filterModel.date == "" || $scope.filterModel.date == null
            || $scope.filterModel.date != null || $scope.filterModel.date != "" || $scope.filterModel.date != null){
              $scope.filterModel.date_GR = "";
              $scope.filterModel.date_Create = "";
            }
        } else {
            if($('input[name="datefilterGr"]').val().length > 0)
            {
                
                $scope.filterModel.date_GR = $('input[name="datefilterGr"]').val();
                $scope.filterModel.date_Create = $('input[name="datefilterPuta"]').val();
                

            }
            if($scope.filterModel.date_GR == undefined || $scope.filterModel.date_GR == "" || $scope.filterModel.date_GR == null
            || $scope.filterModel.date_GR != null || $scope.filterModel.date_GR != "" || $scope.filterModel.date_GR != null){
              $scope.filterModel.date = "";
            }
        }
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        if ($scope.filterModel.ambientRoom == undefined || $scope.filterModel.ambientRoom == "" || $scope.filterModel.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
      }
        
        
  
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report PutAway";
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
        logs.sub_Menu_Name = "Report Check Stock On Hand";
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
        // $scope.filterModel.report_date = getToday();
        // $scope.filterModel.report_date_To = getToday();
        $scope.filterModel.date = formatDate();
        $scope.filterModel.date_GR = formatDate();
        $scope.filterModel.date_Create = formatDate();
        $scope.dropdownBusinessUnit();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
        
      };
    }
  });
})();