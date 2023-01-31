(function () {
    'use strict';
    app.factory("countryFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "AddressCountry",
                filter: function (model) {
                    var urlRequest = this.url;
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
                },
                getCountry: function (model) {                        
                    var urlRequest = this.url + "/getCountry";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                }, 
            }
        });

})();