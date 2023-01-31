(function () {
    'use strict';
    app.factory("reportCheckScanRollCageFactory",
        function (webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage + "RollCage",
                urlWCSRollcage: webServiceAPI.WCS + "MoveRollCage",
                searchFilter: function (model) {
                    var urlRequest = this.url + "/CheckTagout"
                    return clientService.post(urlRequest, model);
                },

                Get_Rollcage: function (model) {
                    var urlRequest = this.urlWCSRollcage + "/GET_TBL_IF_WMS_ROLLCAGE_STATUS";
                    return clientService.post(urlRequest, model);
                },
            }

        });
})();