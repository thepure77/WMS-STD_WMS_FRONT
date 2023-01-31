(function () {
    'use strict';
    app.factory("logFileAdimFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.LogsUser + "Logs",
                urlDropdown: webServiceAPI.LogsUser + "PickBinbalance",

                filter: function (model){
                    var urlRequest = this.url+ "/filterAdmin";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownMenu: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownMenu";
                    return clientService.post(urlRequest, model);
                },

            }
        });
})();