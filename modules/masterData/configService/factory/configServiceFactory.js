(function () {
    'use strict';
    app.factory("configServiceFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getUser;
            var getData1;

            return {
                storageName: "userTokenStorage",
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ServiceChargeList",
                urlDropdown: webServiceAPI.Master + "Currency",

                filter: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                
                filterServiceChargePopup: function (model){
                    var urlRequest = this.url+ "/filterServiceChargePopup";
                    return clientService.post(urlRequest, model);
                }, 
                SaveChanges: function (model){
                    var urlRequest = this.url+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                }, 
                filterServiceChargeFix: function (model){
                    var urlRequest = this.url+ "/filterServiceChargeFix";
                    return clientService.post(urlRequest, model);
                }, 
                SaveServiceChargeFix: function (model){
                    var urlRequest = this.url+ "/SaveServiceChargeFix";
                    return clientService.post(urlRequest, model);
                }, 
                deleteServiceChargeFix: function (model){
                    var urlRequest = this.url+ "/deleteServiceChargeFix";
                    return clientService.post(urlRequest, model);
                },
                filterView_WRL: function (model){
                    var urlRequest = this.url+ "/filterView_WRL";
                    return clientService.post(urlRequest, model);
                },
                saveStorage: function (model){
                    var urlRequest = this.url+ "/SaveStorageCharge";
                    return clientService.post(urlRequest, model);
                },
                dropdownCurrency: function (model){
                    var urlRequest = this.urlDropdown+ "/currencydropdown";
                    return clientService.post(urlRequest, model);
                },
                findStorageCharge: function (model){
                    var urlRequest = this.url+ "/findStorageCharge";
                    return clientService.post(urlRequest, model);
                },
                filterSelectAll: function (model){
                    var urlRequest = this.url+ "/filterSelectAll";
                    return clientService.post(urlRequest, model);
                },

                
            }
        });

})();