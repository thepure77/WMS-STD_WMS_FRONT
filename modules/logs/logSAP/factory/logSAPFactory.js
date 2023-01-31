(function () {
    'use strict';
    app.factory("logSAPFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getUser;
            var getData1;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master_V2 + "Log",

                filter: function (model){
                    var urlRequest = this.url+ "/filterLog";
                    return clientService.post(urlRequest, model);
                }, 

            }
        });

})();