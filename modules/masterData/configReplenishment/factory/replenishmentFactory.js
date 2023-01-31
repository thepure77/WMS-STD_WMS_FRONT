(function () {
    'use strict';
    app.factory("replenishmentFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Replenishment + "replenishment",
                saveData: function (model) {

                    var urlRequest = this.url + "/save";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/list" ;
                    return clientService.post(urlRequest , model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/delete" ;
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
                search: function (model) {
                    var urlRequest = this.url + "/search";
                    return clientService.post(urlRequest, model);
                },

                filterDocumentType: function (model) {
                    var urlRequest = this.url + "/filterDocumentType";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/get";
                    return clientService.post(urlRequest, model);
                },
                SaveChangesDocumentType: function (model) {
                    var urlRequest = this.url + "/SaveChangesDocumentType";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();