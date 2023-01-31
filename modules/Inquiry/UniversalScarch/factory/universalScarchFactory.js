(function () {
    'use strict';
    app.factory("universalScarchFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Universalscarch",

                universalscarch: function (model){
                    var urlRequest = this.url+ "/Universalscarch";
                    return clientService.post(urlRequest, model);
                },

            }
        });
})();