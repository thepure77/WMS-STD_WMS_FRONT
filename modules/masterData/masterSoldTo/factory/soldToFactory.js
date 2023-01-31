(function () {
    'use strict';
    app.factory("soldToFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
        var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "SoldTo",
                url2 : webServiceAPI.Master_V2 + "SoldTo",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                filter: function (model) {
                    var urlRequest = this.url2+"/filterSoldTo";
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
                FilterSoldTo: function (model){
                    var urlRequest = this.url+ "/FilterSoldTo";
                    return clientService.post(urlRequest, model);
                },

                Export: function (model){
                    var urlRequest = this.url2+ "/ExportExcel";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();