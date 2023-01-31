(function () {
    'use strict';
    app.factory("tranferDynamicSlottingFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master  + "DynamicSlotting",
                urlTranfer: webServiceAPI.GT  + "TranferDynamicSlotting",
                filterDynamicSlotting: function (model) {

                    var urlRequest = this.url + "/filterDynamicSlotting";
                    return clientService.post(urlRequest, model);
                },
                createDynamicSlotting: function (model) {

                    var urlRequest = this.url + "/createDynamicSlotting";
                    return clientService.post(urlRequest, model);
                },
                deleteDynamicSlotting: function (model) {

                    var urlRequest = this.url + "/deleteDynamicSlotting";
                    return clientService.post(urlRequest, model);
                },
                genDynamicSlotting: function (model) {

                    var urlRequest = this.urlTranfer + "/GenDynamicSlotting";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();