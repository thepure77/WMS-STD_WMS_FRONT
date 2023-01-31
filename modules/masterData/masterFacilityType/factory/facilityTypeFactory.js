(function() {
    'use strict';
    app.factory("facilityTypeFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "FacilityType",
                filter: function(model) {
                    var urlRequest = this.url + "/list";
                    return clientService.post(urlRequest, model);
                },
                find: function(model) {
                    var urlRequest = this.url + "/get";
                    return clientService.post(urlRequest, model);
                },
                SaveChanges: function(model) {
                    var urlRequest = this.url + "/save";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function(model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();