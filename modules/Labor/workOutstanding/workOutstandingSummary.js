(function () {
  "use strict";

  app.component("workOutstandingSummary", {
    controllerAs: "$vm",
    templateUrl: "modules/Labor/workOutstanding/workOutstandingSummary.html",
    bindings: {
      searchResultModel: '=?',
      filterModel: '=?',
      triggerSearch: '=?',
      searchDataRow: '=?'
    },
    controller: function (
      $scope, $filter, $http, $sce,/*ngAuthSettings,*/ $state,
      /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, webServiceAPI, workOutstandingFactory, logsFactory
    ) {
      var $vm = this;
      var viewModel = workOutstandingFactory;

      $scope.isFilter = true;
      $scope.isShow = false;

      // $scope.filterModel = {};

      $scope.filterModel = {
        currentPage: 1,
        perPage: 50,
        totalRow: 0,
        advanceSearch: false,
      };

      $vm.triggerSearch = function () {
        $scope.filterModel = $scope.filterModel || {};
        $scope.filterModel.work_Date = $scope.filterModel.work_Date || getToday(true);
        $scope.filterModel.work_Date_To = $scope.filterModel.work_Date_To || getToday();
        $scope.filterModel.advanceSearch = $scope.filterModel.advanceSearch;
        pageLoading.show();
        viewModel.filter($vm.filterModel).then(function (res) {
          pageLoading.hide();

          if (res.data.itemsWO.length != 0) {
            $scope.filterModel.perPage = $vm.filterModel.perPage;
            $vm.filterModel.totalRow = res.data.pagination.totalRow;

            if (res.data.pagination != null || res.data.pagination != undefined) {
              $vm.filterModel.totalRow = res.data.pagination.totalRow;
            }

            $vm.searchResultModel = res.data.itemsWO;
          }
          else {
            $vm.searchResultModel = res.data.itemsWO;
          }

          let dataList = $vm.searchResultModel;
          for (var i = 0; i <= dataList.length - 1; i++) {
            $vm.searchResultModel[i].row = i + 1;
          }
          $vm.searchDataRow = dataList.length;
        });
      };

      // $scope.$watch("callSearch", function () {
      //   if ($scope.callSearch) {
      //     $scope.callSearch();
      //   }
      // });

      $scope.filter = function () {
        $vm.triggerSearch();
      };

      $scope.getSearchParams = function () {
        return angular.copy($vm.filterModel);
      };

      $scope.searchFilter = function (param) {
        var deferred = $q.defer();
        if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
          $scope.convertDate();
        }
        pageLoading.show()
        viewModel.filter($scope.filterModel).then(
          function success(res) {
            pageLoading.hide()
            deferred.resolve(res);
          },
          function error(response) {
            pageLoading.hide()
            deferred.reject(response);
          });
        return deferred.promise;
      };

      $scope.filterSearch = function () {
        debugger;
        $scope.filterModel = $scope.filterModel || {};
        $scope.filterModel.PerPage = $scope.filterModel.perPage;
        $scope.filterModel.currentPage = $scope.filterModel.currentPage;

        if ($scope.filterModel.owner_Index != undefined) {
          if ($scope.filterModel.owner_Index == "" || $scope.filterModel.owner_Index.length < 36) {
            $scope.filterModel.owner_Index = "00000000-0000-0000-0000-000000000000";
          }
        }
        $scope.searchFilter($scope.filterModel).then(function success(res) {
          debugger
          $vm.searchResultModel = res.data.itemsWO;
          $vm.filterModel = $scope.filterModel;
          $vm.filterModel.totalRow = res.data.pagination.totalRow;
          $vm.filterModel.currentPage = res.data.pagination.currentPage;
          $vm.filterModel.perPage = res.data.pagination.perPage;

          let dataList = $vm.searchResultModel;
          for (var i = 0; i <= dataList.length - 1; i++) {
            $vm.searchResultModel[i].row = i + 1;
          }
          $vm.searchDataRow = dataList.length;
        }, function error(res) { });

      };


      $scope.convertDate = function () {

        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.wo_Date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.wo_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };

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
        autoOwner: "ReportAutocomplete/autoOwner",
        autoOwnerID: "WorkOutstanding/autoSearchOwnerID",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        billing: "AutoPlanGoodIssue/AutoBilling_No",
        autoGINo: "ReportAutocomplete/autoGINo",
      };

      $scope.url = {
        // Master: webServiceAPI.Master,
        // Report: webServiceAPI.Report,
        // Load: webServiceAPI.Load,
        // PlanGI: webServiceAPI.PlanGI,
        Master: 'https://or-dcwms.pttor.com/AMZ_WMS_MasterAPI/api/',
        Report: 'http://10.106.159.12/AMZ_WMS_ReportAPI/api/',
        Load: 'https://or-dcwms.pttor.com/AMZ_WMS_LoadAPI/api/',
        PlanGI: 'https://or-dcwms.pttor.com/AMZ_WMS_PlanGIAPI/api/',

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
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        var deferred = $q.defer();
        $scope.filterModel.excelName = "รายงานตัวชี้วัดผลการดำเนินงานที่สำคัญ";
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
        logs.sub_Menu_Name = "สรุปสินค้าค้างเก็บ";
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
        $scope.filterModel.wo_date = getToday();
        $scope.filterModel.wo_date_To = getToday();
        $scope.filterModel.date = formatDate();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();



