(function () {
    'use strict';
    app.factory("roundFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Round",
                filter: function (model) {
                    
                    var urlRequest = this.url + "/filterRound";
                    return clientService.get(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();