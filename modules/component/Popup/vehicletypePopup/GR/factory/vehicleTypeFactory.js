(function () {
    'use strict';
    app.factory("vehicleTypeFactoryGr",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",               
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/VahicleTypefilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();