(function () {
  "use strict";

  app.component("reportReceiving", {
    controllerAs: "$vm",
    templateUrl: "modules/Reports/reportReceiving/reportReceiving.html",
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
      reportReceivingFactory,
      logsFactory
    ) {
      var $vm = this;
      var viewModel = reportReceivingFactory;
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
      $scope.dropdownDocumentType = function () {
        viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
          $scope.dropdownDocumentType = res.data;
        });
      };

      // AdvanceSearch
      $scope.header = {
        advanceSearch: false
      };

      $scope.hide = function () {
        $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
        $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
        // if ($scope.filterModel.advanceSearch == true || $scope.filterModel.advanceSearch == false) {
        //   $scope.filterModel.useDate = 0

        //   if ($scope.filterModel.useDate === 0) {
        //     $scope.filterModel.date = formatDate();

        //   }
        // }
      };


      $scope.convertDate = function () {
        if ($scope.filterModel.date != null) {
          var str = $scope.filterModel.date;

          var DStart = str.substring(0, 2);
          var MStart = str.substring(5, 3);
          var YStart = str.substring(10, 6);

          $scope.filterModel.gR_Date_From = YStart.toString() + MStart.toString() + DStart.toString();

          var DEnd = str.substring(15, 13);
          var MEnd = str.substring(18, 16);
          var YEnd = str.substring(25, 19);

          $scope.filterModel.gR_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
        }

      };

      // main menu
      $scope.changeSet_1 = function () {
        debugger
         if ($scope.filterModel.useDate_1 === 1){
            // $scope.notuseDate();
            $scope.filterModel.date = " ";

         }
         if ($scope.filterModel.useDate_1 === 0){
            // $scope.useDate();
            $scope.filterModel.date = formatDate();
         
         }
      }

      $scope.searchReport = function (param) {
        debugger
        // if($('input[name="datefilter"]').val().length > 0)
        //             {
        //                 $scope.filterModel.date = $('input[name="datefilter"]').val();
        //             }
        // if ($('input[name="datefilterAdvEXP"]').val().length > 0) {
        //   $scope.filterModel.date = $('input[name="datefilterAdvEXP"]').val();
        // }
        if(!param.advanceSearch)
                {
                    if($('input[name="datefilter"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilter"]').val();
                    }
                } else {
                    if($('input[name="datefilterAdvEXP"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilterAdvEXP"]').val();
                    }
                }
                debugger
        if ($scope.dropdownDocumentType.model != undefined) {
          param.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
        }
        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        debugger
        ///////////////////////////////////////////////////////
        if (param.ambientRoom == undefined || param.ambientRoom == "" || param.ambientRoom == null) {
          dpMessageBox.alert({
            ok: 'Close',
            title: 'Validate',
            message: 'กรุณาเลือกคลัง'
          })
          return "";
        }

        if (isGuid(param.vendor_Index)) {}
        else{
          param.vendor_Index = ""
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
        if ($scope.filterModel.useDate === 1) {
          // $scope.notuseDate();
          $scope.filterModel.date = " ";
        }
        if ($scope.filterModel.useDate === 0) {
          // $scope.useDate();
          $scope.filterModel.date = formatDate();
        }
      }

      $scope.clearSearch = function () {
        $scope.filterModel = {};
        $scope.filterModel.advanceSearch = true;
        $scope.filterModel.date = formatDate();
      }

      $scope.autoComplete = {
        autoSku: "Autocomplete/autoProductId",
        autoOwner: "ReportAutocomplete/autoOwner",
        autoOwnerID: "ReportLaborPerformance/autoSearchOwnerID",
        TruckloadNo: "AutoLoad/autoTruckloadNo",
        GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",
        autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
        billing: "AutoPlanGoodIssue/AutoBilling_No",
        autoGINo: "ReportAutocomplete/autoGINo",
        location: "autoLocation/autoSearchLocationFilter",
        autoPoV2: "Autocomplete/autobasicSuggestionPO",
        GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
        autoSku: "Autocomplete/autoSku",
        autoProduct: "Autocomplete/autoProductId",
        vendor: "DropdownReport/autoVendor",
        // autoPo: "Autocomplete/AutobasicSuggestion",
        autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
        
      

      };

      $scope.url = {
        Master: webServiceAPI.Master,
        Report: webServiceAPI.Report,
        GR: webServiceAPI.GR,
        Load: webServiceAPI.Load,
        PlanGI: webServiceAPI.PlanGI,
        PlanGR: webServiceAPI.PlanGR,
        PO: webServiceAPI.PO
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
      ////////////////////////////////////////////////////////////
      
      function ExportExcel() {

        if ($scope.filterModel.date != null) {
          $scope.convertDate();
        }
        if ($scope.filterModel.ambientRoom == undefined || $scope.filterModel.ambientRoom == "" || $scope.filterModel.ambientRoom == null) {
          dpMessageBox.alert({
            ok: 'Close',
            title: 'Validate',
            message: 'กรุณาเลือกคลัง'
          })
          return "";
        }
        if ($scope.filterModel.date == undefined || $scope.filterModel.date == "") {
          return dpMessageBox.alert(
            {
              ok: 'Close',
              title: 'แจ้งเตือน',
              message: 'กรุณาระบุวันที่'
            })
        }

        if (isGuid($scope.filterModel.vendor_Index)) {}
        else{
          $scope.filterModel.vendor_Index = ""
        }
        // if ($scope.filterModel.gR_Date_From == undefined || $scope.filterModel.gR_Date_From == "") {
        //   return dpMessageBox.alert(
        //     {
        //       ok: 'Close',
        //       title: 'แจ้งเตือน',
        //       message: 'กรุณาระบุวันที่'
        //     })
        // }
        // if ($scope.filterModel.gR_Date_To == undefined || $scope.filterModel.gR_Date_To == "") {
        //   return dpMessageBox.alert(
        //     {
        //       ok: 'Close',
        //       title: 'แจ้งเตือน',
        //       message: 'กรุณาระบุวันที่'
        //     })
        // }
        var deferred = $q.defer();
        // $scope.filterModel.excelName = "Report Check Stock On Hand";
        $scope.filterModel.excelName = "Report Receiving";
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

      function formatDate() {;
        var today = new Date();
        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
      }

      function isGuid(stringToTest) {
        if (!stringToTest) {
            return false;
        }
        if (stringToTest[0] === "{") {
            stringToTest = stringToTest.substring(1, stringToTest.length - 1);
        }
        var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(stringToTest);
    }

      this.$onInit = function () {
        $scope.isShow = false;
        $scope.filterModel = {};
        // $scope.filterModel.date = getToday();
        // $scope.filterModel.gR_Date_From = getToday();
        // $scope.filterModel.gR_Date_To = getToday();
        $scope.filterModel.ambientRoom = "";
        $scope.filterModel.date = formatDate();
        $scope.dropdownBusinessUnit();
        $scope.dropdownDocumentType();
        $scope.userName = localStorageService.get('userTokenStorage');
        insertLogsUser();
      };
    }
  });
})();