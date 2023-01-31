(function () {
    'use strict';
    app.factory("agingFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "Aging",

                filter: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 

            }
        });
})();