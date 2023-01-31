(function () {
    'use strict';
    app.factory("loadFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Load + "Load",


            }
        });

})();