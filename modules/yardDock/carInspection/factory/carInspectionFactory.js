(function () {
    'use strict';
    app.factory("carInspectionFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "CarInspection",

            
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";
                    return clientService.post(urlRequest, model);
                },
                rejectStatus: function (model) {
                    var urlRequest = this.url + "/rejectStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdowndock: function (model) {
                    var urlRequest = this.url + "/dropdowndock";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });
})();