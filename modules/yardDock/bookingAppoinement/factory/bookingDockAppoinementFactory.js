(function () {
    'use strict';
    app.factory("bookingDockAppoinementFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "balance",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                filter: function (model) {
                    var urlRequest = this.url + "/list_appointment";
                    return clientService.post(urlRequest, model);
                },
                saveCheckin: function (model) {
                    var urlRequest = this.url2 + "/save";
                    return clientService.post(urlRequest, model);
                },
                filterCheckIn: function (model) {
                    var urlRequest = this.url2 + "/list_appointment";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();