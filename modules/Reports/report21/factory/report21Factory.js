(function () {
    'use strict';
    app.factory("report21Factory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Report21",
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
                    var urlRequest = this.url+ "/printReport21";
                    return clientService.popupReport(urlRequest, model);
                },
                getLocationType: function (model) {
                    var urlRequest = this.url+ "/getLocationType";
                    return clientService.post(urlRequest, model);
                },
                getYn: function (model) {
                    var urlRequest = this.url+ "/getYn";
                    return clientService.post(urlRequest, model);
                },
                getBlock: function (model) {
                    var urlRequest = this.url+ "/getBlock";
                    return clientService.post(urlRequest, model);
                },
                autoSearchLocation: function (model) {
                    var urlRequest = this.url+ "/autoSearchLocation";
                    return clientService.post(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
            }
        });
})();