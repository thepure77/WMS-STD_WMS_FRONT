(function () {
    'use strict';
    app.factory("productAssemblyFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProductAssembly",
                filter: function (model) {
                    var urlRequest = this.url+"/filterProductAssembly";
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
                dropdownProductconversion: function (model) {
                    var urlRequest = webServiceAPI.Master+ "Productconversion/productConversionfilter";
                    return clientService.post(urlRequest, model);
                },
                dropdownVolume: function(model) {
                    var urlRequest = webServiceAPI.Master + "Volume/volumedropdown";
                    return clientService.post(urlRequest, model);
                },
                dropdownWeight: function(model) {
                    var urlRequest = webServiceAPI.Master + "Weight/weightdropdown";
                    return clientService.post(urlRequest, model);
                }
                // add: function (model) {
                //     var urlRequest = this.url;
                //     return clientService.post(urlRequest, model);
                // },
                // edit: function (model) {
                //     var urlRequest = this.url;
                //     return clientService.post(urlRequest, model);
                // },  
                // search: function (model) {
                //     var urlRequest = this.url+ "/search";
                //     return clientService.post(urlRequest, model);
                // },
                // FilterProductAssembly: function (model){
                //     var urlRequest = this.url+ "/FilterProductAssembly";
                //     return clientService.post(urlRequest, model);
                // }
            }
        });

})();