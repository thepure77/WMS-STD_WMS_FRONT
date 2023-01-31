(function () {
    'use strict';
    app.factory("theOneCardFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "POS",
                filter: function (model) {
                    var urlRequest = this.url + "/filterTheOneCard" + "/" + model;
                    return clientService.get(urlRequest);
                },
                
            }
        });

})();