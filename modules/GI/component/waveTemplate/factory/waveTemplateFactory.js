(function () {
    'use strict';
    app.factory("waveTemplateFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "Wave",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                
            }
        });

})();