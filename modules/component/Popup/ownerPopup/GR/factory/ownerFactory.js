(function () {
    'use strict';
    app.factory("ownerPopFactoryGr",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/Ownerfilter";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();