(function () {
    'use strict';
    app.factory("logTransfersFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Log",
                url_2: webServiceAPI.Master_V2 + "Log",
                url2: webServiceAPI.Report + "LogTransferExport",

                filter: function (model){
                    var urlRequest = this.url_2+ "/filterLogtf";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url2 + "/ExportTransfer";
                    return clientService.downloadExcel(urlRequest, model);
                },

            }
        });
})();