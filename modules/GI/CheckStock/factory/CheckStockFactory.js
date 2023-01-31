(function () {
    'use strict';
    app.factory("checkStockFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                urlDropdown: webServiceAPI.PlanGI + "DropdownPlanGoodsIssue",

                url: webServiceAPI.PlanGI + "CheckStrock",

                CheckSctock_filter: function (model) {
                    var urlRequest = this.url + "/CheckSctock_filter";
                    return clientService.post(urlRequest, model);
                },
                getSctock_filter: function (model) {
                    var urlRequest = this.url + "/getSctock_filter";
                    return clientService.post(urlRequest, model);
                },
                dropdownRound: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();