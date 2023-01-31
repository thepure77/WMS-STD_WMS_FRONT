(function () {
    'use strict';
    app.factory("bypassPartialFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "bypassPartial",

                filter: function (model) {
                    var urlRequest = this.url + "/filterbypassPartial";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                },   
            }
        });

})();