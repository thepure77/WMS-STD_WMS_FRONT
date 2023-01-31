(function () {
    'use strict';
    app.factory("productPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProductOwner",
                getProduct: function (model) {                        
                    var urlRequest = this.url + "/getProductV2";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();