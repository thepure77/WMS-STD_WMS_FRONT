app.factory("checkStockItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.PlanGI + "PlanGoodsIssueItem",
        find: function (id) {
            var urlRequest = this.url + "/find" + "/" + id;
            return clientService.get(urlRequest);
        },
        find_with_wave: function (model) {
            var urlRequest = this.url + "/find_with_wave";
            return clientService.post(urlRequest,model);
        },
    }
});