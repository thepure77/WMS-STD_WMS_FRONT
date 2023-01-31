(function () {
    'use strict';
    app.factory("bookingDockCheckFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "balance",
                url2: webServiceAPI.YardDock + "checkIn",
                url3: webServiceAPI.YardDock + "checkOut",

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
                cancel: function (model) {
                    var urlRequest = this.url + "/cancel_appointment";
                    return clientService.post(urlRequest, model);
                },saveGateCheckin: function (model) {
                    debugger
                    var urlRequest = this.url2 + "/saveGate";
                    return clientService.post(urlRequest, model);
                },addout: function (model) {
                    debugger
                    var urlRequest = this.url3 + "/saveGateOut";
                    return clientService.post(urlRequest, model);
                },filterin: function (model) {
                    var urlRequest = this.url + "/list_Gateappointment";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();