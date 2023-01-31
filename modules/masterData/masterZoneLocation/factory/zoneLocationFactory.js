(function () {
    'use strict';
    app.factory("zoneLocationFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "zoneLocation",
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
                }

                // filter: function (model) {
                //     var urlRequest = this.url ;
                //     return clientService.get(urlRequest);
                // },
                // getId: function (model) {
                //     var urlRequest = this.url + "/" + model;
                //     return clientService.get(urlRequest);
                // },
                // getDelete: function (model) {
                //     var urlRequest = this.url + "/" + model;
                //     return clientService.delete(urlRequest);
                // },
                // add: function (model) {
                //     var urlRequest = this.url;
                //     return clientService.post(urlRequest, model);
                // },
                // edit: function (model) {
                //     var urlRequest = this.url;
                //     return clientService.post(urlRequest, model);
                // },
                // search: function (model) {
                //     var urlRequest = this.url+ "/search";
                //     return clientService.post(urlRequest, model);
                // }
            }
        });

})();