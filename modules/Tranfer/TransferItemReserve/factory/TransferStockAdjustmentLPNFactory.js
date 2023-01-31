(function () {
    'use strict';
    app.factory("TransferStockAdjustmentLPNFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferStockAdjustmentLPN",
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
                ScanLPN: function (model) {
                    var urlRequest = this.url + "/ScanLPN";
                    return clientService.post(urlRequest, model);
                },  
                ScanProduct: function (model) {
                    var urlRequest = this.url + "/ScanProduct";
                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.url + "/SumQty";
                    return clientService.post(urlRequest, model);
                },      
                CheckScanLPN: function (model) {
                    var urlRequest = this.url + "/CheckScanLPN";
                    return clientService.post(urlRequest, model);
                },                   
            }
        });

})();