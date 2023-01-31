(function () {
    'use strict';
    app.factory("giMemoFactory",
        function (webServiceAPI, clientService) {
            var getData;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "Memo",
                urlGI: webServiceAPI.GI + "GoodsIssueItem",
                urlDropdown: webServiceAPI.BinBalance + "PickBinbalance",

                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentTypeMEMO";
                    return clientService.post(urlRequest, model);
                },
                filterMEMO: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                filterMEMOItem: function (id) {
                    var urlRequest = this.url + "/filteritem" + "/" + id;
                    return clientService.get(urlRequest);
                },
                add: function (model) {
                    var urlRequest = this.url + "/CreateUpdate";
                    return clientService.post(urlRequest, model);
                },
                getByGoodIssueId: function (id) {
                    var urlRequest = this.urlGI + "/find" + "/" + id;
                    return clientService.get(urlRequest);
                },
            }
        });
})();