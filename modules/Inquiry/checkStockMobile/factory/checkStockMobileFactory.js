(function () {
    'use strict';
    app.factory("checkStockMobileFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "Stock",
                urlDropDown: webServiceAPI.BinBalance + "PickBinbalance",

                // mobileFilterByProduct: function (model){
                //     var urlRequest = this.url+ "/CheckStockMobile/mobileFilterByProduct";
                //     return clientService.post(urlRequest, model);
                // }, 
                mobileFilterByLocation: function (model){
                    var urlRequest = this.url+ "/CheckStockMobile/mobileFilterByLocation";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownProductType: function (model){
                    var urlRequest = this.urlDropDown+ "/dropdownProductType";
                    return clientService.post(urlRequest, model);
                },                 
                dropdownLocation: function (model){
                    var urlRequest = this.urlDropDown+ "/dropdownLocation";
                    return clientService.post(urlRequest, model);
                },                 
                dropdownZone: function (model){
                    var urlRequest = this.urlDropDown+ "/dropdownZone";
                    return clientService.post(urlRequest, model);
                },                 
                dropdownItemStatus: function (model){
                    var urlRequest = this.urlDropDown+ "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                }, 

            }
        });
})();