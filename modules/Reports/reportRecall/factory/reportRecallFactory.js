(function () {
    'use strict';
    app.factory("reportRecallFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Report1",
                url2: webServiceAPI.Report + "ReportRecall",
                urlDropdown: webServiceAPI.Report + "DropdownReport",
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
                    var urlRequest = this.url+ "/printReport1";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function(model) {
                    var urlRequest = this.url2+ "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },  
                dropdownDocumentType: function(model) {
                    var urlRequest = this.urlDropdown+ "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                }, 
                PrintReportThanawat: function (model) {
                    var urlRequest = this.url2 + "/printReportRecall";
                    return clientService.popupReport(urlRequest, model);
                  },
                
            }
        });
})();