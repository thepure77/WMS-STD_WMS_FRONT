(function () {
    'use strict';
    app.factory("logCancelFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            //รอ api /Execel
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Log",
                url_2: webServiceAPI.Master_V2 + "Log",
                url2: webServiceAPI.Report + "LogCancelExport",
               
                filterCancel: function (model){
                    var urlRequest = this.url_2+ "/filterLogCancel";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url2 + "/ExportCancel";
                    return clientService.downloadExcel(urlRequest, model);
                },

            }
        });
})();