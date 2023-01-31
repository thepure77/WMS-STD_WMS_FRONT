(function () {
    'use strict';
    app.factory("shipToFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                urlmaster:  webServiceAPI.Master,
                url: webServiceAPI.Master + "ShipTo",
                url2: webServiceAPI.Master_V2 + "ShipTo",
                set: function(model) {
                    data = model;
                },
                get: function() {
                   return data
                },
                filter: function (model) {
                    var urlRequest = this.url2+"/filterShipTo";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url2 + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url2+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/Delete";
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
                FilterShipTo: function (model){
                    var urlRequest = this.url+ "/filterShipTo";
                    return clientService.post(urlRequest, model);
                },
                filterShiptoPopup: function (model){
                    var urlRequest = this.url+ "/filterShiptoPopup";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url2+ "/Export";
                    return clientService.post(urlRequest, model);
                },
                dropdownbusinessUnit: function (model) {
                    debugger
                    var urlRequest = this.urlmaster + "BusinessUnit/filter";
                    return clientService.post(urlRequest, model);
                },   
            }
        });

})();