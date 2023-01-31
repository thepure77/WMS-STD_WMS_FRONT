(function () {
    'use strict';
    app.factory("soldToShipToFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "SoldToShipTo",
                
                filter: function (model) {
                    var urlRequest = this.url+"/filterSoldToShipTo";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChanges";
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
                FilterSoldToShipTo: function (model){
                    var urlRequest = this.url+ "/FilterSoldToShipTo";
                    return clientService.post(urlRequest, model);
                },
                SaveSoldToShipToList: function (model) {
                    var urlRequest = this.url+ "/SaveSoldToShipToList";
                    return clientService.post(urlRequest, model);
                },
                filterShipTo: function (model) {
                    var urlRequest = this.url+"/filterShipTo";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();