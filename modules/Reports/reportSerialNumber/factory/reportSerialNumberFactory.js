(function () {
    'use strict';
    app.factory("reportSerialNumberFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "ReportSerialNumber",
                urlDropdown: webServiceAPI.Report + "DropdownReport",
                ExportExcel: function(model) {
                    var urlRequest = this.url+ "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },  
                dropdownDocumentType: function(model) {
                    var urlRequest = this.urlDropdown+ "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                }, 
                printReportSerialNumber: function (model) {
                    var urlRequest = this.url + "/printReportSerialNumber";
                    return clientService.popupReport(urlRequest, model);
                },
            }
        });
})();