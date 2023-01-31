(function() {
    'use strict';
    app.factory("warehouseOwnerFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "WHOwner",
                filter: function(model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                find: function(model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/Delete";
                    return clientService.post(urlRequest, model);
                }             
            }
        });

})();