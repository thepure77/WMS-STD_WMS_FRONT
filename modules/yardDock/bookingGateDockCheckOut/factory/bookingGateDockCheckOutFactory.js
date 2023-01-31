(function () {
    'use strict';
    app.factory("bookingGateDockCheckOutFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            var newaction
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "balance",
                urlcheckin: webServiceAPI.YardDock + "checkIn",

                set: function (model , action) {
                    data = model;
                    newaction = action;
                },
                getAction: function () {
                    return newaction
                },
                getdata: function () {
                    return data
                },
                filter: function (model) {
                    var urlRequest = this.url + "/list_Gateappointmentout";
                    return clientService.post(urlRequest, model);
                },
                saveGateCheckin: function (model) {
                    var urlRequest = this.urlcheckin + "/saveGate";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();