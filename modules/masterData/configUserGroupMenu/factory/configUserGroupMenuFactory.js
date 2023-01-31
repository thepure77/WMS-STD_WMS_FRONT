(function() {
    'use strict';
    app.factory("configUserGroupMenuFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "configUserGroupMenu",
                filter: function(model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                filterConfigUserGroupMenu: function(model) {
                    var urlRequest = this.url + "/filterConfigUserGroupMenu";
                    return clientService.post(urlRequest, model);
                },
                confirm: function(model) {
                    var urlRequest = this.url + "/confirm";
                    return clientService.post(urlRequest, model);
                },
                getUserGroupMenu: function(model) {
                    var urlRequest = this.url + "/getUserGroupMenu";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();