(function () {
  "use strict";

  app.component("report10", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/report10/report10Summary.html",
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
      report10Factory,
      logsFactory,
      transferFactory,
      planGoodsIssueFactory
    ) {
      var $vm = this;
      var viewModel = report10Factory;
      var _viewModel = planGoodsIssueFactory;
      var __viewModel = transferFactory;

      $scope.isFilter = true;
      $scope.isShow = false;

      //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

      $scope.filterModel = {};

      $scope.$watch("callSearch", function () {
        if ($scope.callSearch) {
          $scope.callSearch();
        }
      });

      $scope.header = {
        advanceSearch: false
      };

      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
        if ($scope.header.advanceSearch) {
          $scope.filterModel.warehouse_Name = null;
        }
        else {
          $scope.filterModel.dropdownZone = null;
          $scope.filterModel.location_Level = null;
          $scope.filterModel.locationLock_Id = null;
          $scope.filterModel.location_Prefix_Desc = null;
        }
      };

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

          $scope.filterModel.binCard_date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.binCard_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };


      $scope.searchReport = function (param) {
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        if ($scope.dropdownZone.model != null) {
          $scope.filterModel.zone_Index = $scope.dropdownZone.model.zone_Index;
          $scope.filterModel.zone_Id = $scope.dropdownZone.model.zone_Id;
          $scope.filterModel.zone_Name = $scope.dropdownZone.model.zone_Name;
        }
        else {
          $scope.filterModel.zone_Index = null;
          $scope.filterModel.zone_Id = null;
          $scope.filterModel.zone_Name = null;
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

      $scope.autoComplete = {
        autoSku: "Autocomplete/autoSku",
        autoWarehouse: "ReportAutocomplete/autoWarehouse",
        autoSearchlayer: "Report10/autoSearchlayer",
        autoSearchAisle: "Report10/autoSearchAisle",
      };

      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
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
            $scope.filterModel.excelName = "สรุปใช้พื้นที่ตามโซน";
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
        logs.sub_Menu_Index = "338C1EE2-88E5-4D05-B7AB-EF690938C7D1";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "สรุปใช้พื้นที่ตามโซน";
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

      $scope.dropdownZone = function () {
        __viewModel.dropdownZone({}).then(function (res) {
          $scope.dropdownZone = res.data;
        });
      };

      $scope.dropdownItemStatus = function () {
        _viewModel.dropdownItemStatus({}).then(function (res) {
          $scope.dropdownItemStatus = angular.copy(res.data);
        });
      };

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.date = getToday();
        $scope.userName = localStorageService.get('userTokenStorage');
        $scope.dropdownZone();
        $scope.dropdownItemStatus();
        insertLogsUser();
      };
    }
  });
})();



