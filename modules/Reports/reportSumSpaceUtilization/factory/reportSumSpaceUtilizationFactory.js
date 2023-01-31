(function () {
    'use strict';
    app.factory("reportSumSpaceUtilizationFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "ReportSumSpaceUtilization",
                urlDropdown: webServiceAPI.Report + "DropdownReport",
                //url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/ReportLaborPerformance",

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
                    var urlRequest = this.url+ "/printSumSpaceUtilization";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
                dropdownBusinessUnit: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownBusinessUnit";
                    return clientService.post(urlRequest, model);
                },
                dropdownLocationType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownLocationType";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();