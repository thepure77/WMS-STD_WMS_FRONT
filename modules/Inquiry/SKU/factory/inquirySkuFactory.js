(function () {
    'use strict';
    app.factory("inquirySkuFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "InventoryStock",
                search: function (model) {                    
                    var urlRequest = this.url + "/searchSKU";
                    return clientService.post(urlRequest, model);
                },
                GetStockDetails: function (model) {                
                    var urlRequest = this.url + "/getSKU_StockDetails";
                    return clientService.post(urlRequest, model);
                },
                GetSKUConversion: function (model) {                
                    var urlRequest = this.url + "/getSKU_SKUConversion";
                    return clientService.post(urlRequest, model);
                },
                GetSKUAllocatedBy: function (model) {                
                    var urlRequest = this.url + "/getSKU_SKUAllocatedBy";
                    return clientService.post(urlRequest, model);
                },
                // ExportSKU: function(model) {
                //     var urlRequest = this.url+ "/ExportExcelSKU";
                //     return clientService.downloadExcelInquiry(urlRequest, model);
                // },
            }
        });
})();

