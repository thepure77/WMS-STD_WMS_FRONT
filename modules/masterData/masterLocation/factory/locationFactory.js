(function () {
    'use strict';
    app.factory("locationFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master_V2 + "Location",
                urlLocationWorkArea: webServiceAPI.Master_V2 + "LocationWorkArea",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                filter: function (model) {
                    var urlRequest = this.url+"/filterLocation";
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
                FilterLocation: function (model){
                    var urlRequest = this.url+ "/FilterLocation";
                    return clientService.post(urlRequest, model);
                },
                filterWorkArea: function (model){
                    var urlRequest = this.urlLocationWorkArea + "/filterWorkArea";
                    return clientService.post(urlRequest, model);
                },
                GetLocationV2: function (model){
                    var urlRequest = this.urlLocationWorkArea + "/GetLocationV2";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                }    
            }
        });

})();