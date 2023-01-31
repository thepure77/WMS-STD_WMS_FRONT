(function () {
    'use strict';
    app.factory("soldToOwnerPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "SoldTo",
                urlOwnerSoldTo:webServiceAPI.Master + "OwnerSoldTo",
                filter: function(model) {
                    var urlRequest = this.url + "/filterPopupSoldTo";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
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
                SaveChanges: function (select) {
                    var urlRequest = this.urlOwnerSoldTo+ "/SaveChanges";
                    return clientService.post(urlRequest, select);
                },

            }
        });

})();