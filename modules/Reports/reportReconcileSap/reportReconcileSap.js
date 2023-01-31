(function () {
  "use strict";

  app.component("reportReconcileSap", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportReconcileSap/reportReconcileSap.html",
    controller: function ($scope,$filter,$http,$sce,/*ngAuthSettings,*/$state,/*authService*/pageLoading,$window,commonService,localStorageService,$timeout,$translate,$q,dpMessageBox,webServiceAPI,reportReconcileSapFactory,logsFactory) 
    {
      var $vm = this;
      var viewModel = reportReconcileSapFactory;

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
            $scope.filterModel.date = formatDate();
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

        $scope.filterModel.date = formatDate();
 

      }

      // $scope.clearDate = function () {
      //   debugger;
      //   // $scope.filterModel = {};
      //   $scope.filterModel.date_Exp = " ";
      //   $scope.filterModel.date_MFG = " ";
      //   $scope.filterModel.date_GI = formatDate();
      //   $scope.filterModel.dateload = formatDate();
      //   $scope.filterModel.date = formatDate();
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
        // date GR
        if ($scope.filterModel.date != null ) {
          var str_gr = $scope.filterModel.date;

          var DStart_gr= str_gr.substring(0, 2);
          var MStart_gr = str_gr.substring(5, 3);
          var YStart_gr = str_gr.substring(10, 6);

          $scope.filterModel.GoodsReceive_Date = YStart_gr.toString() + MStart_gr.toString() + DStart_gr.toString();

          var DEnd_gr = str_gr.substring(15, 13);
          var MEnd_gr = str_gr.substring(18, 16);
          var YEnd_gr = str_gr.substring(25, 19);

          $scope.filterModel.GoodsReceive_Date_To = YEnd_gr.toString() + MEnd_gr.toString() + DEnd_gr.toString();
        }  
      };  


      $scope.searchReport = function (param) {
        pageLoading.show();
        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
        }
        param.ambientRoom = $scope.filterModel.ambientRoom;
          if ($scope.filterModel.date != null) {
            $scope.convertDate();
          }
          debugger;
          if ($scope.dropdownBusinessUnit.model != undefined) {
            param.BusinessUnit_Index =  $scope.dropdownBusinessUnit.model.BusinessUnit_Index;
            param.BusinessUnit_Id =  $scope.dropdownBusinessUnit.model.BusinessUnit_Id;
            param.BusinessUnit_Name =  $scope.dropdownBusinessUnit.model.BusinessUnit_Name;
          }else{
            param.BusinessUnit_Index = undefined;
            param.BusinessUnit_Id = undefined;
            param.BusinessUnit_Name = undefined;
          }
          if ($scope.filterModel.Product_Id != undefined) {
            param.Product_Id = $scope.filterModel.Product_Id;
          }else{
            param.Product_Id = undefined;
          }
          if ($scope.filterModel.Plant != undefined) {
            param.Plant = $scope.filterModel.Plant;
          }else{
            param.Plant = undefined;
          }
          if ($scope.filterModel.Sap_Sloc != undefined) {
            param.Sap_Sloc = $scope.filterModel.Sap_Sloc;
          }else{
            param.Sap_Sloc = undefined;
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
      // Export Excel
      $scope.exportFile = {

        
        ExportExcel: function (param) {
          dpMessageBox.confirm({
            title: 'Confirm.',
            message: 'Do you want to download?'
          }).then(function success() {
            ExportExcel(param);
          })
        },
      }

      function ExportExcel(param) {
        debugger;
        pageLoading.show();
        param.ambientRoom = $scope.filterModel.ambientRoom;
        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
          dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาเลือกคลัง'
          })
          return "";
        }
          if ($scope.filterModel.date != null) {
            $scope.convertDate();
          }
          if ($scope.dropdownBusinessUnit.model != undefined) {
            param.BusinessUnit_Index =  $scope.dropdownBusinessUnit.model.BusinessUnit_Index;
            param.BusinessUnit_Id =  $scope.dropdownBusinessUnit.model.BusinessUnit_Id;
            param.BusinessUnit_Name =  $scope.dropdownBusinessUnit.model.BusinessUnit_Name;
          }else{
            param.BusinessUnit_Index = undefined;
            param.BusinessUnit_Id = undefined;
            param.BusinessUnit_Name = undefined;
          }
          if ($scope.filterModel.Product_Id != undefined) {
            param.Product_Id = $scope.filterModel.Product_Id;
          }else{
            param.Product_Id = undefined;
          }
          if ($scope.filterModel.Plant != undefined) {
            param.Plant = $scope.filterModel.Plant;
          }else{
            param.Plant = undefined;
          }
          if ($scope.filterModel.Sap_Sloc != undefined) {
            param.Sap_Sloc = $scope.filterModel.Sap_Sloc;
          }else{
            param.Sap_Sloc = undefined;
          }

        var deferred = $q.defer();
        param.excelName = "Report_Reconcile_Sap";
        viewModel.ExportExcel(param).then(
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
      };

      $scope.url = {
        Master: webServiceAPI.Master,
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

      $scope.dropdownBusinessUnit = function () {
        viewModel.dropdownBusinessUnit($scope.filterModel).then(function (res) {
            $scope.dropdownBusinessUnit = res.data;
        });
      };
      
      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.date = formatDate();
        $scope.dropdownBusinessUnit();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();