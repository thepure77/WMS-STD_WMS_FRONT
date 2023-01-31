(function () {
    'use strict';
    app.factory("statusPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProcessStatus",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                popupFilter: function (model) {    
                    var urlRequest = this.url + "/popupFilter";
                    return clientService.post(urlRequest,model);                    
                },   
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {                    
                    var urlRequest = this.url + "/getDelete";
                    return clientService.post(urlRequest,model);
                },               
            }
        });

})();