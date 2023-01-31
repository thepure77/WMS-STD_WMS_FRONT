(function () {
    'use strict';
    app.factory("workOutstandingFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "WorkOutstanding",
                // url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/WorkOutstanding",

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
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
            }
        });
})();