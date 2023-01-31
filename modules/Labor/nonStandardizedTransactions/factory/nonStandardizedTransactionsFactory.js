(function () {
    'use strict';
    app.factory("nonStandardizedTransactionsFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "NonStandardizedTransactions",
                // url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/NonStandardizedTransactions",

                FilterSearch: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                filterPopup: function (model) {  
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.post(urlRequest,model);                    
                },   
                getId: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                }
            }
        });
})();