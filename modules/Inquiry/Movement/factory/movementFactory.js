(function () {
    'use strict';
    app.factory("movementFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "Movement",
                urlDropDown: webServiceAPI.BinBalance + "PickBinbalance",

                filter: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlDropDown+ "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductType: function (model){
                    var urlRequest = this.urlDropDown+ "/dropdownProductType";
                    return clientService.post(urlRequest, model);
                },  

            }
        });
})();