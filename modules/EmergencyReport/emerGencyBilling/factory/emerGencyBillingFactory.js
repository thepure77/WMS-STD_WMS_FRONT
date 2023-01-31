(function () {
    'use strict';
    app.factory("emerGencyBillingFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "EmergencyBilling",

                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                
                printOutDeliveryNoteemergency: function (model) {
                    var urlRequest = this.url + "/printOutDeliveryNoteEmergency";
                    return clientService.popupReport(urlRequest, model);
                },
            }
        });
})();