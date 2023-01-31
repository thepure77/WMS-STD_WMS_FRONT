(function() {
    'use strict';
    app.factory("reportPrintTagPopupFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master,

                filter: function(model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
            }
        });

})();