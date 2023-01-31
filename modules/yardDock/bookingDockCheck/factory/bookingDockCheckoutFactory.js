(function () {
    'use strict';
    app.factory("bookingDockCheckoutFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            var newaction
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "checkOut",
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
                scan: function (model) {
                    var urlRequest = this.url+"/list_appointment";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url+"/get_appointment";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url+"/save";
                    return clientService.post(urlRequest, model);
                },
               
            }
        });

})();