(function () {
    'use strict';
    app.factory("bookingGateDockCheckSummaryFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            var newaction
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "balance",

                filter: function (model) {
                    var urlRequest = this.url + "/list_GateappointmentSummary";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();