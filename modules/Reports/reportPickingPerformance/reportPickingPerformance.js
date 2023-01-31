(function () {
  "use strict";

  app.component("reportPickingPerformance", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportPickingPerformance/reportPickingPerformance.html",
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
      reportPickingPerformanceFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportPickingPerformanceFactory;

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


      $scope.convertDate = function () {

        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.GoodsIssue_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.GoodsIssue_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };


      $scope.searchReport = function (param) {
        debugger;
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        if ($scope.dropdownRound.model != undefined) {
          param.WaveRound =  $scope.dropdownRound.model.round_Id;
        }else{
          param.WaveRound = undefined;
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

        if ($scope.filterModel.goodsIssue_No != undefined) {
          param.GoodsIssue_No =  $scope.filterModel.goodsIssue_No;
        }else{
          param.GoodsIssue_No = '';
        }

        if ($scope.filterModel.TruckLoad_No != undefined) {
          param.TruckLoad_Index =  $scope.filterModel.TruckLoad_Index;
          param.TruckLoad_No =  $scope.filterModel.TruckLoad_No;
        }else{
          param.TruckLoad_Index = '';
          param.TruckLoad_No = '';
        }

        param.ambientRoom = "01";
        // if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null ) {
        //   dpMessageBox.alert({
        //       ok: 'Close',
        //       title: 'Validate',
        //       message: 'กรุณาเลือกคลัง'
        //   })
        //   return "";
        // }
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

      // $scope.dropdownLocationType = function () {
      //   viewModel.dropdownLocationType($scope.filterModel).then(function (res) {
      //     $scope.dropdownLocationTypeList = res.data;
      //   });
      // };

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
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        autoGINo: "ReportAutocomplete/autoGINo",
      };

      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
        Load: webServiceAPI.Load,
        PlanGI: webServiceAPI.PlanGI,
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
        var param = {};
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        if ($scope.dropdownRound.model != undefined) {
          $scope.filterModel.WaveRound =  $scope.dropdownRound.model.round_Id;
        }else{
          $scope.filterModel.WaveRound = undefined;
        }

        if ($scope.dropdownBusinessUnit.model != undefined) {
          $scope.filterModel.BusinessUnit_Index =  $scope.dropdownBusinessUnit.model.BusinessUnit_Index;
          $scope.filterModel.BusinessUnit_Id =  $scope.dropdownBusinessUnit.model.BusinessUnit_Id;
          $scope.filterModel.BusinessUnit_Name =  $scope.dropdownBusinessUnit.model.BusinessUnit_Name;
        }else{
          $scope.filterModel.BusinessUnit_Index = undefined;
          $scope.filterModel.BusinessUnit_Id = undefined;
          $scope.filterModel.BusinessUnit_Name = undefined;
        }

        if ($scope.filterModel.goodsIssue_No != undefined) {
          $scope.filterModel.GoodsIssue_No =  $scope.filterModel.goodsIssue_No;
        }else{
          $scope.filterModel.GoodsIssue_No = '';
        }

        if ($scope.filterModel.TruckLoad_No != undefined) {
          $scope.filterModel.TruckLoad_Index =  $scope.filterModel.TruckLoad_Index;
          $scope.filterModel.TruckLoad_No =  $scope.filterModel.TruckLoad_No;
        }else{
          $scope.filterModel.TruckLoad_Index = '';
          $scope.filterModel.TruckLoad_No = '';
        }

        $scope.filterModel.ambientRoom = "01";

        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report_Sorting";
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
        logs.sub_Menu_Index = "509E3424-634B-47EE-8543-46F99F176A06";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "รายงานการคัดแยกสินค้า";
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


      $scope.dropdownRound = function () {
        viewModel.dropdownRound($scope.filterModel).then(function (res) {
            $scope.dropdownRound = res.data;
        });
      };

      $scope.dropdownBusinessUnit = function () {
        viewModel.dropdownBusinessUnit($scope.filterModel).then(function (res) {
            $scope.dropdownBusinessUnit = res.data;
        });
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

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.dropdownRound();
        $scope.dropdownBusinessUnit();
        // $scope.filterModel.date = getToday();
        // $scope.filterModel.GoodsIssue_Date = getToday();
        // $scope.filterModel.GoodsIssue_Date_To = getToday();
        $scope.filterModel.date = formatDate();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();



