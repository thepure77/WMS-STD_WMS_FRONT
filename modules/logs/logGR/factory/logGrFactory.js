(function () {
    'use strict';
    app.factory("logGrFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Log",
                url2: webServiceAPI.Master_V2 + "Log",
                urlPO: webServiceAPI.PO + "PurchaseOrder",
                urlGR: webServiceAPI.GR + "GoodsReceive",
                url_Report:webServiceAPI.Report + "LogGrExport",
                
                filter: function (model){
                    var urlRequest = this.url2+ "/filterLoggr";
                    return clientService.post(urlRequest, model);
                }, 

                Export: function (model){
                    var urlRequest = this.url_Report+ "/Exportgr";
                    return clientService.downloadExcel(urlRequest, model);
                }, 

            }
        });
})();