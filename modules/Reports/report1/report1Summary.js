(function () {
  "use strict";

  app.component("report1", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/report1/report1Summary.html",
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
      report1Factory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = report1Factory;

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

          $scope.filterModel.goodsReceive_date = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.goodsReceive_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };


      $scope.searchReport = function (param) {
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
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
        $scope.filterModel.excelName = "รายงานสรุปการรับสินค้า";
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

      $scope.autoComplete = {
        basicSearch: "GoodsReceive/autobasicSuggestion",
        autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
      };

      $scope.url = {
        PlanGR: webServiceAPI.PlanGR,
        GR: webServiceAPI.GR,
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
        $scope.filterModel.goodsReceive_date = getToday();
        $scope.filterModel.goodsReceive_date_To = getToday();
        $scope.dropdownDocumentType();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();