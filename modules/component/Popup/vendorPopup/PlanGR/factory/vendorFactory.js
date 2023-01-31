(function () {
    'use strict';
    app.factory("vendorPlanFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Vendor",
                filter: function (model) {
                    var urlRequest = this.url+ "/filterPopup";
                    return clientService.post(urlRequest, model);
                },
                // vendorPopupSearch: function (model) {
                //     var urlRequest = this.url+ "/OwnerVendorfilter";
                //     return clientService.post(urlRequest, model);
                // },
                
            }
        });

})();