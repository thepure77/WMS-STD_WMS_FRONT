(function () {
  "use strict";

  app.component("report19", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/report19/report19Summary.html",
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
      report19Factory, 
      logsFactory
    ) {
      var $vm = this;
      var viewModel = report19Factory;

      $scope.isFilter = true;
      $scope.isShow = false;

      //$scope.pdfUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/149125/relativity.pdf';

      $scope.filterModel = {
        currentPage: 0,
        numPerPage: 30,
        totalRow: 0,
        key: "",
        advanceSearch: false,
        showError: false,
        type: 1
      };


      $scope.header = {
        advanceSearch: false
      };

      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
      };

      $scope.$watch("callSearch", function () {
        if ($scope.callSearch) {
          $scope.callSearch();
        }
      });



      $scope.searchReport = function (param) {
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
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
      };
      function getToday() {
        var today = new Date();

        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        return yyyy.toString() + "/" + mm.toString() + "/" + dd.toString();
      };

      function insertLogsUser()
      {
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
          logs.sub_Menu_Index = "8A3DBBAC-02E7-4FBD-8F0D-0FC6585A67C6";
          //logs.sub_MenuType_Index
          //logs.sub_Menu_Id
          logs.sub_Menu_Name = "วิเคราะห์อายุสินค้า";
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

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        $scope.filterModel.goodsReceive_date = getToday();
        $scope.filterModel.goodsReceive_date_To = getToday();
        insertLogsUser();
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

          $scope.filterModel.goodsReceive_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

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
            $scope.filterModel.excelName = "วิเคราะห์อายุสินค้า";
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

      
      $scope.autoComplete = {
        autoSku: "Autocomplete/autoSku",
      };

      $scope.url = {
        Master: webServiceAPI.Master,
      };

    }
  });
})();
