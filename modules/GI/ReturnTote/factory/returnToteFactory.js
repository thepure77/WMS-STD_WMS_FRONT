(function () {
    'use strict';
    app.factory("returnToteFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Load  + "RerurnTote",

                Scanshipment: function (model) {
                    var urlRequest = this.url + "/Scanshipment" ;
                    return clientService.post(urlRequest, model);
                },   
                SavereturnTote: function (model) {
                    var urlRequest = this.url + "/SavereturnTote" ;
                    return clientService.post(urlRequest, model);
                },
                SearchReturntote: function (model) {
                    var urlRequest = this.url + "/SearchReturntote" ;
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();   