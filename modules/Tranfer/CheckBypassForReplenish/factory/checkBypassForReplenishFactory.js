(function () {
    'use strict';
    app.factory("checkBypassForReplenishFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "checkBypassForReplenish",

                filter: function (model) {
                    var urlRequest = this.url + "/filtercheckBypassForReplenish";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                },   
            }
        });

})();