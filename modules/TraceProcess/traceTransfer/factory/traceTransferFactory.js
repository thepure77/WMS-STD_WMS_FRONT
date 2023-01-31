(function () {
    'use strict';
    app.factory("traceTransferFactory",
        function (webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.Replenishment + "replenishment",
                url: webServiceAPI.Report + "TruckLoad",
                url1: webServiceAPI.Master + "EquipmentStatus",
                urlGT: webServiceAPI.GT + "DropdownGoodsTransfer",

                searchFilter: function (model) {
                    var urlRequest = this.url + "/printOutTraceTransferReplenish"
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {
                    var urlRequest = this.urlGT + "/dropdownStatus";
                    return clientService.post(urlRequest, model);
                },
                resultFind: function (model) {
                    var urlRequest = this.url + "/generateTaskPiecePick";
                    return clientService.post(urlRequest, model);
                },
            }

        });
})();