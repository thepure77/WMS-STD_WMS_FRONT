(function () {
    'use strict';
    app.factory("report9Factory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Report9",
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
                    var urlRequest = this.url+ "/printReport9";
                    return clientService.popupReport(urlRequest, model);
                },
                getUserGroupMenu: function (model) {
                    var urlRequest = this.url+ "/getUserGroupMenu";
                    return clientService.post(urlRequest, model);
                },
                getZone: function (model) {
                    var urlRequest = this.url+ "/getZone";
                    return clientService.post(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
            }
        });
})();