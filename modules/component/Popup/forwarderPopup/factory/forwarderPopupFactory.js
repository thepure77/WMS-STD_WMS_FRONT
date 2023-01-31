(function () {
    'use strict';
    app.factory("forwarderPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Forwarder",

                filter: function (model) {
                    var urlRequest = this.url + "/ForwarderFilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();