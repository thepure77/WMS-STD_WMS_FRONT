(function () {
    'use strict';
    app.factory("containerTypeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ContainerType",
                filter: function (model) {
                    var urlRequest = this.url;
                    return clientService.get(urlRequest);
                },              
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();