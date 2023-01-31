(function () {
    'use strict';
    app.factory("reportNotMovementFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "reportNotMovement",
                urlmaster:  webServiceAPI.Master,
                urldropdown2: webServiceAPI.Report + "DropdownReport",
                //url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/ReportLaborPerformance",

                // gettest: function (model) {
                //     var urlRequest = this.url + "/gettest";
                //     return clientService.post(urlRequest, model);
                // },
                // get: function (model) {
                //     var urlRequest = this.url + "/get2";
                //     return clientService.post(urlRequest, model);
                // },
                // root: function (model) {
                //     var urlRequest = this.url + "/root";
                //     return clientService.post(urlRequest, model);
                // },
                // PrintReport: function (model) {
                //     var urlRequest = this.url+ "/printreportNotMovement";
                //     return clientService.popupReport(urlRequest, model);
                // },
                // ExportExcel: function (model) {
                //     var urlRequest = this.url + "/ExportExcel";
                //     return clientService.downloadExcel(urlRequest, model);
                // },
                dropdownLocationType: function (model) {
                    var urlRequest = this.urldropdown2 + "/dropdownLocationType";
                    return clientService.post(urlRequest, model);
                },
                dropdownbusinessUnit: function (model) {
                    debugger
                    var urlRequest = this.urlmaster + "BusinessUnit/filter";
                    return clientService.post(urlRequest, model);
                },   
            }
        });
})();