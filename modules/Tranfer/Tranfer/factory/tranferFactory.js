(function () {
    'use strict';
    app.factory("tranferFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferItem",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                CheckBinBalance: function (model) {
                    var urlRequest = this.url + "/CheckBinBalance";
                    return clientService.post(urlRequest, model);
                },                    
                scanTagNo: function (model) {
                    var urlRequest = this.url + "/ScanTagNo";
                    return clientService.post(urlRequest, model);
                }, 
                Save: function (model) {
                    var urlRequest = this.url + "/SaveDataRelocation";
                    return clientService.post(urlRequest, model);
                },                     
                scanTagNoReserve: function (model) {
                    var urlRequest = this.url + "/ScanTagNoReserve";
                    return clientService.post(urlRequest, model);
                },                     
                checkProductList: function (model) {
                    var urlRequest = this.url + "/CheckProductList" + "/" + model;
                    return clientService.post(urlRequest);
                },  
                SumQty: function (model) {
                    var urlRequest = this.url + "/SumQty";
                    return clientService.post(urlRequest, model);
                }                 
            }
        });

})();