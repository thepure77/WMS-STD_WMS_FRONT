(function () {
    'use strict';
    app.factory("claimItemFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.OMS + "Claim",

                getByclaimId: function (id) {
                    var urlRequest = this.url + "/getByclaimId" + "/" + id;
                    return clientService.get(urlRequest);
                }
            }
        });
})();