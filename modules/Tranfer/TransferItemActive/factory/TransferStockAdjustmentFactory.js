(function () {
    'use strict';
    app.factory("TransferStockAdjustmentFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferStockAdjustment",
                filterowner: function (model) {
                    var urlRequest = this.url + "/filterOwner";
                    return clientService.get(urlRequest, model);
                },
                filterWarehouse: function (model) {
                    var urlRequest = this.url + "/filterWarehouse";
                    return clientService.get(urlRequest, model);
                },
                confirm: function (model) {                        
                    var urlRequest = this.url + "/ConfirmMarshall";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {  
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                }, 
                ScanLocation: function (model) {
                    var urlRequest = this.url + "/ScanLocation";
                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.url + "/SumQty";
                    return clientService.post(urlRequest, model);
                },  
                ScanProduct: function (model) {
                    var urlRequest = this.url + "/ScanProduct";
                    return clientService.post(urlRequest, model);
                },  
                CheckScanLocation: function (model) {
                    var urlRequest = this.url + "/CheckLocation";
                    return clientService.post(urlRequest, model);
                },                       
            }
        });

})();