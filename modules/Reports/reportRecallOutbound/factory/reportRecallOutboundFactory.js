(function () {
    'use strict';
    app.factory("reportRecallOutboundFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "ReportRecallOutbound",
                urlDropdown: webServiceAPI.Report + "DropdownReport",
                ExportExcel: function(model) {
                    var urlRequest = this.url+ "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },  
                dropdownDocumentType: function(model) {
                    var urlRequest = this.urlDropdown+ "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                }, 
                PrintReportThanawat: function (model) {
                    var urlRequest = this.url + "/printReportRecall";
                    return clientService.popupReport(urlRequest, model);
                  },
                
            }
        });
})();