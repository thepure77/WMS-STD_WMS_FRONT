(function () {
    'use strict';
    app.factory("rePrintTagFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "RePrintTag",
                urlTransfer: webServiceAPI.GT,

                filterTagItem: function (model) {
                    var urlRequest = this.url + "/FilterTagItem";
                    return clientService.post(urlRequest, model);
                },

                ///////Transfer///////////
                filterTagTransfer: function (model) {
                    var urlRequest = this.urlTransfer + "RePrintTag/RePrintTagSearch";
                    return clientService.post(urlRequest, model);
                },
                printReportTagPutawayTransfer: function (model) {
                    var urlRequest = this.urlTransfer + "Transfer/printTagPutawayTransfer";
                    return clientService.popupReport(urlRequest, model);
                },
            }
        });
})();