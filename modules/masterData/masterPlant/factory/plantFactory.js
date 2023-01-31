(function () {
    'use strict';
    app.factory("plantFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Plant",
                url2: webServiceAPI.Master_V2 + "Plant",
                set: function(model) {
                    data = model;
                },
                get: function() {
                   return data
                },
                filter: function (model) {
                    var urlRequest = this.url2+"/filterPlant";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url2 + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url2+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url2+ "/Delete";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url2;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url2;
                    return clientService.post(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url2+ "/Export";
                    return clientService.post(urlRequest, model);
                }     
            }
        });

})();