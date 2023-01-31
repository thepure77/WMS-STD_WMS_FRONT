(function () {
    'use strict';
    app.factory("ownerFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Owner",
                urlOwnerColor: webServiceAPI.Master + "OwnerColor",
                urlOwnerVendor: webServiceAPI.Master + "OwnerVendor",
                urlOwnerSoldTo: webServiceAPI.Master + "OwnerSoldTo",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                filterVendor: function (model) {
                    var urlRequest = this.urlOwnerVendor + "/findOwnerVendor/" + model;
                    return clientService.get(urlRequest);
                },
                filterSoldTo: function (model) {
                    var urlRequest = this.urlOwnerSoldTo + "/findOwnerSoldTo/" + model;
                    return clientService.get(urlRequest);
                },
                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url + "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                getDeleteOwnerVendor: function (model) {
                    var urlRequest = this.urlOwnerVendor + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                getDeleteOwnerSoldTo: function (model) {
                    var urlRequest = this.urlOwnerSoldTo + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                filterOwnerPopupV2: function (model){
                    var urlRequest = this.url+ "/filterOwnerPopupV2";
                    return clientService.post(urlRequest, model);
                },ownercolor :function (model){
                    var urlRequest = this.urlOwnerColor;
                    return clientService.get(urlRequest, model);
                }


            }
        });

})();