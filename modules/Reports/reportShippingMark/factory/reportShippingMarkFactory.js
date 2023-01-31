(function () {
    'use strict';
    app.factory("reportShippingMarkFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "ReportShippingMark",
                url2: webServiceAPI.Report_UAT + "ReportShippingMark",
                urlDropdown: webServiceAPI.Report + "DropdownReport",
                urlDropdown2: webServiceAPI.Report_UAT + "DropdownReport",
                //url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/ReportLaborPerformance",

                gettest: function (model) {
                    var urlRequest = this.url2 + "/gettest";
                    return clientService.post(urlRequest, model);
                },
                get: function (model) {
                    var urlRequest = this.url2 + "/get2";
                    return clientService.post(urlRequest, model);
                },
                root: function (model) {
                    var urlRequest = this.url2 + "/root";
                    return clientService.post(urlRequest, model);
                },
                PrintReport: function (model) {
                    var urlRequest = this.url2+ "/printReportShippingMark";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url2 + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
                dropdownBusinessUnit: function (model) {
                    var urlRequest = this.urlDropdown2 + "/dropdownBusinessUnit";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();