(function () {
    'use strict';
    app.factory("logGiFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Log",
                url2: webServiceAPI.Master_V2 + "Log",
                urlPGI: webServiceAPI.PlanGI + "PlanGoodsIssue",
                urlGI: webServiceAPI.GI + "GoodsIssue",
                url_Report:webServiceAPI.Report + "LogGiExport",

                filter: function (model){
                    var urlRequest = this.url2+ "/filterLoggi";
                    return clientService.post(urlRequest, model);
                }, 

                Export: function (model){
                    var urlRequest = this.url_Report+ "/Exportgi";
                    return clientService.downloadExcel(urlRequest, model);
                }, 

            }
        });
})();