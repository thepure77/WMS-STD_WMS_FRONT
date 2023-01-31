(function() {
    'use strict';
    app.factory("vendorFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Vendor",
                url2: webServiceAPI.Master_V2 + "Vendor",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                filter: function(model) {
                    var urlRequest = this.url2 + "/filter";
                    return clientService.post(urlRequest, model);
                },
                find: function(model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getId: function(model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/Delete";
                    return clientService.post(urlRequest, model);
                },
                add: function(model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function(model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                search: function(model) {
                    var urlRequest = this.url + "/search";
                    return clientService.post(urlRequest, model);
                },
                FilterVendor: function(model) {
                    var urlRequest = this.url + "/FilterVendor";
                    return clientService.post(urlRequest, model);
                },
                popupSearch: function(model) {
                    var urlRequest = this.url + "/popupSearch";
                    return clientService.post(urlRequest, model);
                },

                Export: function(model) {
                    var urlRequest = this.url2 + "/ExportExcel";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();