(function () {
    'use strict';
    app.factory("importFileFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Import,
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                importsPGR: function (model) {
                    var urlRequest = this.url + "/imports/plangr";
                    return clientService.post(urlRequest, model);
                },
                confirmPGR: function (model) {
                    var urlRequest = this.url + "/imports/plangr_confirm";
                    return clientService.post(urlRequest, model);
                }
                ,
                importsPGI: function (model) {
                    var urlRequest = this.url + "/imports/plangi";
                    return clientService.post(urlRequest, model);
                },
                confirmPGI: function (model) {
                    var urlRequest = this.url + "/imports/plangi_confirm";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();