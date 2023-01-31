(function () {
    'use strict';
    app.factory("scanPickItemFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanPickItem",

                GetDataScanTaskItem: function (model){
                    var urlRequest = this.url+ "/GetDataScanTaskItem";
                    return clientService.post(urlRequest, model);
                }, 
            }
        });

})();