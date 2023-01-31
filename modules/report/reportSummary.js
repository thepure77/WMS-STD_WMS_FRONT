(function() {
  "use strict";

  app.component("reportSummary", {
    controllerAs: "$vm",
    templateUrl: "modules/report/reportSummary.html",
    controller: function(
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
      reportFactory
    ) {
      var $vm = this;
      var viewModel = reportFactory;

      $scope.isFilter = true;

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

      $scope.$watch("callSearch", function() {
        if ($scope.callSearch) {
          $scope.callSearch();
        }
      });

      $scope.clearSearch = function() {
        $scope.criteriaView = {};
      };

      $scope.preview2 = function(type) {
        pageLoading.show();
        $scope.criteriaView = {};
        $scope.criteriaView.serviceType = type;
        var url = webServiceAPI.Report + "Report/get2";
        viewModel.get($scope.criteriaView).then(function(result) {
          var path = result.data.replace(
            "C:\\inetpub\\wwwroot\\TOP_WMS",
            "http:\\\\kascoit.ddns.net:99\\TOP_WMS\\"
          );
    
          $scope.expdf = $sce.trustAsResourceUrl(path);
        });
      };

      $scope.preview = function(type) {        
        pageLoading.show();
        $scope.criteriaView = {};
        $scope.criteriaView.serviceType = type;
        $scope.criteriaView.reportName = "test";
        var url = webServiceAPI.Report + "Report/gettest";
        var promise = $http.post(url, $scope.criteriaView, {
          responseType: "arraybuffer"
        });
        promise
          .then(
            function success(result) {
              
              if (result.status === 200) {
                var blob = new Blob([result.data], { type: "octet/stream" });
                var objectUrl = URL.createObjectURL(blob);
                var itemReport = $filter("filter")("PDF", { code: "1" });
                var typeReport = "";
                if ($scope.criteriaView.serviceType == "PDF") {
                  var file = new Blob([result.data], {
                    type: "application/pdf"
                  });
                  var fileURL = URL.createObjectURL(file);
                  $scope.expdf = $sce.trustAsResourceUrl(fileURL);
                  typeReport = ".pdf";
                } else if ($scope.criteriaView.serviceType == "XLS") {
                  typeReport = ".xls";
                }
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                var hour = today.getHours();
                var minute = today.getMinutes();
                var second = today.getSeconds();

                if (dd < 10) {
                  dd = "0" + dd;
                }

                if (mm < 10) {
                  mm = "0" + mm;
                }

                if (hour < 10) {
                  hour = "0" + hour;
                }

                if (minute < 10) {
                  minute = "0" + minute;
                }

                if (second < 10) {
                  second = "0" + second;
                }

                today =
                  yyyy.toString() +
                  mm.toString() +
                  dd.toString() +
                  hour.toString() +
                  minute.toString() +
                  second.toString();
                // var originalName = (itemReport[0].name || "file") +today.toString() + (typeReport)
                var originalName = "test" + today.toString() + typeReport;
                let a = $("<a />", { href: objectUrl, download: originalName }).appendTo("body").get(0).click();

                pageLoading.hide();
              } else {
                dpMessageBox.alert({
                  titile: "Message",
                  message: "ไม่พบข้อมูล"
                });
                pageLoading.hide();
              }
            },
            function error(result) {
              dpMessageBox.alert({
                titile: "Message",
                message: "ไม่พบข้อมูล"
              });
              pageLoading.hide();
            }
          )
          .catch(function(error) {
            pageLoading.hide();
          });
      };

      // Init = function() {
      //   $scope.criteriaView = {};
      //   $scope.criteriaView.dateS = getToday();
      //   $scope.criteriaView.dateE = getToday();
      // };

      function getToday() {
        var today = new Date();

        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        return yyyy.toString() + mm.toString() + dd.toString();
      }
    }
  });
})();
