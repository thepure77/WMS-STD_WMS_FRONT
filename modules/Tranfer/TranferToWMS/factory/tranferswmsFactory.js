(function () {
    'use strict';
    app.factory("tranferWMSFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.OMS + "OMStoAMZ",

                tranferGI: function (id) {
                    var urlRequest = this.url + "/TranferGI" + "/" + id;
                    return clientService.get(urlRequest);
                },
                tranferGR: function (id) {
                    var urlRequest = this.url + "/TranferGR" + "/" + id;
                    return clientService.get(urlRequest);
                }
            }
        });
})();