(function () {
  "use strict";

  app.component("report9", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/report9/report9Summary.html",
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
      report9Factory,
      logsFactory,
    ) {
      var $vm = this;
      var viewModel = report9Factory;
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

          $scope.filterModel.cycleCount_date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.cycleCount_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };


      $scope.searchReport = function (param) {
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }

        if (!$scope.dropdownZone.model) {
          $scope.filterModel.zone_Index = null;
          $scope.filterModel.zone_Id = null;
          $scope.filterModel.zone_Name = null;
        }
        else {
          $scope.filterModel.zone_Index = $scope.dropdownZone.model.zone_Index;
          $scope.filterModel.zone_Id = $scope.dropdownZone.model.zone_Id;
          $scope.filterModel.zone_Name = $scope.dropdownZone.model.zone_Name;
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
        autoProductId: "Autocomplete/autoProductId",
        autoSku: "Autocomplete/autoSku",
        autoOwnerID: "Report9/autoSearchOwnerID"
      };

      $scope.url = {
        Master: webServiceAPI.Master,
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
            if ($scope.filterModel.date != null) {
              $scope.convertDate();
            }
            var deferred = $q.defer();
            $scope.filterModel.excelName = "สรุปการตรวจนับ";
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
        logs.sub_Menu_Index = "DE4B5615-FAEE-474F-860F-E70D7AC4FB43";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "สรุปการตรวจนับ";
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

      $scope.$watch("filterModel.product_Id", function () {
        if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Id == undefined) {
          $scope.filterModel.product_Index = '';
          $scope.filterModel.product_Name = '';
        }
      });

      $scope.$watch("filterModel.owner_Id + filterModel.owner_Index", function () {
        if ($scope.filterModel.owner_Index == "" || $scope.filterModel.owner_Index == undefined) {
          $scope.filterModel.owner_Id = '';
          $scope.filterModel.owner_Name = '';
        }
      });

      function getUserGroupMenu() {
        let obj = {
          // listUserGroup_Index:[
          // "6621459D-278B-4F4C-8470-04CC6AB72024",
          // "6E14AD55-DD7A-45AC-93EE-445D872A65D8",
          // "1574F45E-3064-43E2-A1CB-7ECC2AC48DD7",
          // "9428AA5F-1960-4330-81B6-9F3549648C87",
          // "8B7CA548-EDE0-4EE2-A7EB-B163097602DA",
          // "9428AA5F-1960-4330-81B6-9F3549648C87",
          // "9F89998B-9F58-4B1B-A3DB-D67C0AAF30B8",
          // "EE4FFE83-CB98-4B3B-8BFF-F0EB4009A80E"]
        };

        viewModel.getUserGroupMenu(obj).then(function (res) {
          $scope.dropdownUserGroupMenu = res.data;
        });
      };

      function getZone() {
        viewModel.getZone({}).then(function (res) {
          $scope.dropdownZone = res.data;
        });
      };

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.cycleCount_date = getToday();
        $scope.filterModel.cycleCount_date_To = getToday();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
        // getUserGroupMenu();
        getZone();
      };
    }
  });
})();



