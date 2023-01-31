(function () {
    'use strict';
    app.factory("reportSpaceUtilizationFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "ReportSpaceUtilization",
                // url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/ReportSpaceUtilization",
                urldropdown2: webServiceAPI.Report + "DropdownReport",

                gettest: function (model) {
                    var urlRequest = this.url + "/gettest";
                    return clientService.post(urlRequest, model);
                },
                get: function (model) {
                    var urlRequest = this.url + "/get2";
                    return clientService.post(urlRequest, model);
                },
                root: function (model) {
                    var urlRequest = this.url + "/root";
                    return clientService.post(urlRequest, model);
                },
                PrintReport: function (model) {
                    var urlRequest = this.url+ "/printReportSpaceUtilization";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
                dropdownLocationType: function (model) {
                    var urlRequest = this.urldropdown2 + "/dropdownLocationType";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();