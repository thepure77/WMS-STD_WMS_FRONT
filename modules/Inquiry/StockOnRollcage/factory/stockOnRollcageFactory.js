(function () {
    'use strict';
    app.factory("stockOnRollcageFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "StockOnRollcage",
                urlDropDown: webServiceAPI.BinBalance + "PickBinbalance",

                setParam: function (model) {
                    getData1 = model;
                },
                getParam: function () {
                    return getData1;
                },

                filterByProduct: function (model){
                    var urlRequest = this.url+ "/filterByProduct";
                    return clientService.post(urlRequest, model);
                }, 
                filterByLocatuion: function (model){
                    var urlRequest = this.url+ "/filterByLocatuion";
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