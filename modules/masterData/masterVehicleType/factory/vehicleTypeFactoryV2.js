(function () {
    'use strict';
    app.factory("vehicleTypeFactoryV2",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "vehicleType",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url + "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                }      
            }
        });

})();