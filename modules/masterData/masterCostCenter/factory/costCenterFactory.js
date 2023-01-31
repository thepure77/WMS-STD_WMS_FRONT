(function () {
    'use strict';
    app.factory("costCenterFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master_V2 + "CostCenter",
                filter: function (model) {
                    var urlRequest = this.url+"/CostCenterfilter";
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
                FilterCostCenter: function (model){
                    var urlRequest = this.url+ "/FilterCostCenter";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                }     
            }
        });

})();