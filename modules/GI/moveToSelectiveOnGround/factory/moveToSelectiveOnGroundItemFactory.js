(function () {
    'use strict';
    app.factory("moveToSelectiveOnGroundItemFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanPickItem",

                GetDataScanTaskItem: function (model){
                    var urlRequest = this.url+ "/GetDataScanTaskMoveToselective";
                    return clientService.post(urlRequest, model);
                }, 
            }
        });

})();