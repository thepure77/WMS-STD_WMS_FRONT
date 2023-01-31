(function () {
  "use strict";

  app.component("reportCoverDay", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportCoverDay/reportCoverDay.html",
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
      reportCoverDayFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportCoverDayFactory;

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

      $scope.dropdownBusinessUnit = function () {
        viewModel.dropdownBusinessUnit($scope.filterModel).then(function (res) {
            $scope.dropdownBusinessUnit = res.data;
        });
      };
    
      $scope.convertDate = function () {
        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.gi_date_from = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.gi_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }
      };


      $scope.searchReport = function () {
        pageLoading.show();
        viewModel.PrintReport($scope.filterModel).then(
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

      function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
      }

      $scope.validate = function(param){

        if ($scope.filterModel.ambientRoom == undefined || $scope.filterModel.ambientRoom == "" || $scope.filterModel.ambientRoom == null ) {
            dpMessageBox.alert({
                ok: 'Close',
                title: 'Validate',
                message: 'กรุณาเลือกคลัง'
            })
            return "";
        }

        if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
        {
          $scope.convertDate();
        }
        else
        {
             dpMessageBox.alert({
              ok: 'Close',
              title: 'Validate',
              message: 'กรุณาระบุวันที่'
          })
          return "";
        }

        
        if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
        {
          $scope.checkDate();
            const a = new Date($scope.filterModel.check_date_from),
                  b = new Date($scope.filterModel.check_date_to),
              difference = dateDiffInDays(a, b);
              if(difference > 31)
              {
                  dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Validate',
                    message: 'ช่วงวันที่ ที่ระบุเกิน 31 วัน'
                })
                return "";
              }
        }
        




        // if ($scope.filterModel.month == undefined || $scope.filterModel.month == "" || $scope.filterModel.month == null ) {
        //   dpMessageBox.alert({
        //       ok: 'Close',
        //       title: 'Validate',
        //       message: 'กรุณาเลือกเดือน'
        //   })
        //   return "";
        // }

        // if ($scope.filterModel.year == undefined || $scope.filterModel.year == "" || $scope.filterModel.year == null ) {
        //   dpMessageBox.alert({
        //       ok: 'Close',
        //       title: 'Validate',
        //       message: 'กรุณาเลือกปี'
        //   })
        //   return "";
        // }

        if(param == "pdf")
        {
          $scope.searchReport();
        }
        else
        {
          $scope.exportFile.ExportExcel();
        }
      };

      $scope.clear = function () {
        $scope.filterModel = {};
      }

      $scope.convertDate = function () {

        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.gi_date_from = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.gi_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };

      $scope.checkDate = function () {

        if ($scope.filterModel.gi_date_from != null) 
        {
          var str = $scope.filterModel.gi_date_from;
          var YStart = str.substring(0, 4);
          var MStart = str.substring(6, 4);
          var DStart = str.substring(8, 6);
          $scope.filterModel.check_date_from = YStart.toString()  + '-' + MStart.toString() + '-' + DStart.toString();
        }

        if ($scope.filterModel.gi_date_to != null) 
        {
          var str2 = $scope.filterModel.gi_date_to;
          var YEnd = str2.substring(0, 4);
          var MEnd = str2.substring(6, 4);
          var DEnd = str2.substring(8, 6);

          $scope.filterModel.check_date_to = YEnd.toString() + '-' + MEnd.toString() + '-' + DEnd.toString();
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
        autoSku: "Autocomplete/autoProductId",
        autoOwner: "ReportAutocomplete/autoOwner",
        autoOwnerID: "ReportLaborPerformance/autoSearchOwnerID",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        billing: "AutoPlanGoodIssue/AutoBilling_No",
        autoGINo: "ReportAutocomplete/autoGINo",
        PlanGI: webServiceAPI.PlanGI,
        vendor: "ReportAutocomplete/autoSearchVendor",
      };


      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
        Load: webServiceAPI.Load,
        PlanGI: webServiceAPI.PlanGI
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
        var deferred = $q.defer();
        $scope.filterModel.excelName = "Report CoverDay";
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
        logs.menu_Index = "7AE391F4-D1CB-4FE2-A61B-1E42F40B0FFF";
        //logs.menuType_Index
        //logs.menu_Id
        logs.menu_Name = "ReportSupport";
        logs.sub_Menu_Index = "EF23353C-E4AF-435B-BF04-BD3D5ED0FB3A";
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "Report CoverDay";
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

      $scope.$watch("filterModel.product_Id + filterModel.product_Name", function () {
        if ($scope.filterModel.product_Index == "" || $scope.filterModel.product_Index == undefined) {
          $scope.filterModel.product_Id = '';
          $scope.filterModel.product_Name = '';
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

      $scope.advanceSearch_ = function () {
        $scope.advanceSearch = !$scope.advanceSearch;
        if($scope.advanceSearch)
        {
          $scope.filterModel.exp_Date = getToday();
          $scope.filterModel.mfg_Date = getToday();
          $scope.filterModel.goodsReceive_Date = getToday();
        }
        else
        {
          $scope.filterModel.exp_Date = '';
          $scope.filterModel.mfg_Date = '';
          $scope.filterModel.goodsReceive_Date = '';
          $scope.filterModel.product_Lot = '';
          $scope.filterModel.vendor_Index = '';
          $scope.filterModel.vendor_Id = '';
          $scope.filterModel.vendor_Name = '';
        }
      };

      $scope.getYaer = function(){
        var year = 2020;
        var range = [];
        range.push(year);
        for (var i = 1; i < 15; i++) {
            range.push(year + i);
        }
        $scope.years = range;

      };

      
      this.$onInit = function () {
        $scope.isShow = false;

        //$scope.xx = {};
        $scope.advanceSearch = false;
        
        $scope.filterModel = {};;
        // $scope.filterModel.date = getToday();
        $scope.filterModel.gi_date_from = getToday();
        $scope.filterModel.gi_date_to = getToday();
        $scope.filterModel.date = formatDate();
        $scope.dropdownBusinessUnit();
        $scope.getYaer();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };

    }
  });
})();