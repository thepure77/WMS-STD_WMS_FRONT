(function () {
    'use strict';
    app.factory("routeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Route",
                filter: function (model) {
                    var urlRequest = this.url + "/filterRoute";
                    return clientService.get(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();