(function () {
  "use strict";

  app.component("reportStockbyZoneReportAgeging", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportStockbyZoneReportAgeging/reportStockbyZoneReportAgeging.html",
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
      reportStockbyZoneReportAgegingFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportStockbyZoneReportAgegingFactory;

      $scope.isFilter = true;
      $scope.isShow = false;

      //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

      $scope.filterModel = {};
      $scope.getGoodsReceive_EXP_Date = false;
      $scope.getGoodsReceive_MFG_Date = false;

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
      $scope.header = {
        advanceSearch: false
      };
      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        if($scope.header.advanceSearch === true){
          $scope.filterModel.GoodsReceive_EXP = formatDate();
          $scope.filterModel.GoodsReceive_MFG = formatDate();
          $scope.convertDate();
        }else{
          $scope.filterModel.GoodsReceive_MFG = "";
          $scope.filterModel.GoodsReceive_EXP = "";
        }
        $scope.header.advanceSearch = $scope.header.advanceSearch;
      };

      $scope.convertDate = function () {
        if ($scope.filterModel.GoodsReceive != undefined || $scope.filterModel.GoodsReceive == "" || $scope.filterModel.GoodsReceive == null) {
          var str = $scope.filterModel.GoodsReceive;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.GoodsReceive_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.GoodsReceive_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

        if ($scope.filterModel.GoodsReceive_EXP != undefined || $scope.filterModel.GoodsReceive_EXP == "" || $scope.filterModel.GoodsReceive_EXP == null) {
          var str = $scope.filterModel.GoodsReceive_EXP;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.GoodsReceive_EXP_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.GoodsReceive_EXP_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

        if ($scope.filterModel.GoodsReceive_MFG != undefined || $scope.filterModel.GoodsReceive_MFG == "" || $scope.filterModel.GoodsReceive_MFG == null) {
          var str = $scope.filterModel.GoodsReceive_MFG;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.GoodsReceive_MFG_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.GoodsReceive_MFG_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };


      $scope.searchReport = function (param) {
        debugger;
        pageLoading.show();
        if($scope.header.advanceSearch === true){
          $scope.convertDate();
        }else{
          $scope.filterModel.GoodsReceive_MFG = "";
          $scope.filterModel.GoodsReceive_EXP = "";
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

      if ($scope.filterModel.Tag_No != undefined) {
        param.Tag_No = $scope.filterModel.Tag_No;
      }else{
        param.Tag_No = undefined;
      }
      if ($scope.filterModel.GoodsReceive != undefined || $scope.filterModel.GoodsReceive == "" || $scope.filterModel.GoodsReceive == null) {
        param.GoodsReceive_Date = $scope.filterModel.GoodsReceive_Date;
        param.GoodsReceive_Date_To = $scope.filterModel.GoodsReceive_Date_To;
      }else{
        param.GoodsReceive_Date = undefined;
        param.GoodsReceive_Date_To = undefined;
      }
      if ($scope.filterModel.GoodsReceive_EXP != undefined || $scope.filterModel.GoodsReceive_EXP == "" || $scope.filterModel.GoodsReceive_EXP == null) {
        param.GoodsReceive_EXP_Date = $scope.filterModel.GoodsReceive_EXP_Date;
        param.GoodsReceive_EXP_Date_To = $scope.filterModel.GoodsReceive_EXP_Date_To;
      }else{
        param.GoodsReceive_EXP_Date = undefined;
        param.GoodsReceive_EXP_Date_To = undefined;
      }
      if ($scope.filterModel.GoodsReceive_MFG != undefined || $scope.filterModel.GoodsReceive_MFG == "" || $scope.filterModel.GoodsReceive_MFG == null) {
        param.GoodsReceive_MFG_Date = $scope.filterModel.GoodsReceive_MFG_Date;
        param.GoodsReceive_MFG_Date_To = $scope.filterModel.GoodsReceive_MFG_Date_To;
      }else{
        param.GoodsReceive_MFG_Date = undefined;
        param.GoodsReceive_MFG_Date_To = undefined;
      }

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

      $scope.autoComplete = {
        autoProduct: "Autocomplete/autoProductId",
        owner: "Bom/AutoOwnerfilter",
        Tag: "PickBinbalance/AutoCompleterTag",
        vendor: "Autocomplete/autoSearchVendor"
      };

      $scope.url = {
        Master: webServiceAPI.Master,
        BOM: webServiceAPI.BOM,
        BinBalance: webServiceAPI.BinBalance,
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
        debugger;        
        pageLoading.show();
        var param = {};
        if ($scope.filterModel.GoodsReceive != null) {
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
      if ($scope.filterModel.GoodsReceive != undefined) {
        $scope.filterModel.GoodsReceive_Date = $scope.filterModel.GoodsReceive_Date;
        $scope.filterModel.GoodsReceive_Date_To = $scope.filterModel.GoodsReceive_Date_To;
      }else{
        $scope.filterModel.GoodsReceive_Date = undefined;
        $scope.filterModel.GoodsReceive_Date_To = undefined;
      }
      if ($scope.filterModel.Tag_No != undefined) {
        $scope.filterModel.Tag_No = $scope.filterModel.Tag_No;
      }else{
        $scope.filterModel.Tag_No = undefined;
      }
      if ($scope.filterModel.GoodsReceive_EXP != undefined) {
        $scope.filterModel.GoodsReceive_EXP_Date = $scope.filterModel.GoodsReceive_EXP_Date;
        $scope.filterModel.GoodsReceive_EXP_Date_To = $scope.filterModel.GoodsReceive_EXP_Date_To;
      }else{
        $scope.filterModel.GoodsReceive_EXP_Date = undefined;
        $scope.filterModel.GoodsReceive_EXP_Date_To = undefined;
      }
      if ($scope.filterModel.GoodsReceive_MFG != undefined) {
        $scope.filterModel.GoodsReceive_MFG_Date = $scope.filterModel.GoodsReceive_MFG_Date;
        $scope.filterModel.GoodsReceive_MFG_Date_To = $scope.filterModel.GoodsReceive_MFG_Date_To;
      }else{
        $scope.filterModel.GoodsReceive_MFG_Date = undefined;
        $scope.filterModel.GoodsReceive_MFG_Date_To = undefined;
      }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report Ageging";
        viewModel.ExportExcel($scope.filterModel).then(
          function success(results) {
            deferred.resolve(results);pageLoading.hide();
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
        //เเก้ 5 ตัว 
        logs.menu_Index = "487C2D02-B01D-486C-ABF4-F5AA36B8A271";
        //logs.menuType_Index
        //logs.menu_Id
        logs.menu_Name = "ReportSupport";
        logs.sub_Menu_Index = "EF23353C-E4AF-435B-BF04-BD3D5ED0FB3A";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "Report Check Transfer";
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

      $scope.changeSetGoodsReceive_MFG_Date = function () {
        debugger
         if ($scope.filterModel.useDateGoodsReceive_MFG_Date === 1){
            // $scope.notuseDate();
            $scope.filterModel.GoodsReceive_MFG = " ";
         }
         if ($scope.filterModel.useDateGoodsReceive_MFG_Date === 0){
            // $scope.useDate();
            $scope.filterModel.GoodsReceive_MFG = formatDate();
         }
      }

      $scope.changeSetGoodsReceive_EXP_Date = function () {
        debugger
         if ($scope.filterModel.useDateGoodsReceive_EXP_Date === 1){
            // $scope.notuseDate();
            $scope.filterModel.GoodsReceive_EXP = " ";
            
         }
         if ($scope.filterModel.useDateGoodsReceive_EXP_Date === 0){
            // $scope.useDate();
            $scope.filterModel.GoodsReceive_EXP = formatDate();
    
         }
      }

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

      $scope.dropdownBusinessUnit = function () {
        viewModel.dropdownBusinessUnit($scope.filterModel).then(function (res) {
            $scope.dropdownBusinessUnit = res.data;
        });
      };

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.GoodsReceive = formatDate();
        $scope.filterModel.GoodsReceive_MFG = "";
        $scope.filterModel.GoodsReceive_EXP = "";
        $scope.convertDate();
        $scope.dropdownBusinessUnit();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();