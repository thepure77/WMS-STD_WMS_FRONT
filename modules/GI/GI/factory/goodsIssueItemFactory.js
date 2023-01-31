app.factory("goodsIssueItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GI + "GoodsIssueItem",
        getByGoodIssueId: function (model) {
            var urlRequest = this.url + "/GetByGoodIssueId";
            return clientService.post(urlRequest,model);
        },
        getDelete: function (model) {
            var urlRequest = this.url + "/" + model;
            return clientService.delete(urlRequest);
        },
        find: function (model) {
            var urlRequest = this.url + "/find/" + model;
            return clientService.get(urlRequest);
        },
    }
});