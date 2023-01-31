(function () {
    'use strict';
    app.factory("masterDockTypeFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.Master + "masterDockType",
                url: webServiceAPI.YardDock + "dockType",
                filter: function (model) {
                    var urlRequest = this.url + "/list";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/get";
                    return clientService.post(urlRequest, model);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url + "/save";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                FilterItemStatus: function (model){
                    var urlRequest = this.url+ "/FilterItemStatus";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();