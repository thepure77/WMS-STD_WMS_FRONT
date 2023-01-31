(function () {
    'use strict';
    app.factory("t3plFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "3PL",
                filter: function (model) {
                    var urlRequest = this.url;
                    return clientService.get(urlRequest);
                },              
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();