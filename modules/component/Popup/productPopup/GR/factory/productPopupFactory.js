(function () {
    'use strict';
    app.factory("productPopupFactoryGr",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",
                getProduct: function (model) {     
                    var urlRequest = this.url + "/ProductFilterPopup";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();