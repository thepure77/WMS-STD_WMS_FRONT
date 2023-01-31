(function () {
    'use strict';
    app.factory("documentTypePlanGiFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                filterDocPGI: function (model) {
                    var urlRequest = this.url + "/documentTypefilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();