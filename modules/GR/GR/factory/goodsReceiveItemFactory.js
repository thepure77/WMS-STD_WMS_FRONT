app.factory("goodsReceiveItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GR + "GoodsReceiveItem",

        getByGoodReceiveId: function (id) {
            var urlRequest = this.url + "/GetByGoodReceiveId" + "/" + id;
            return clientService.get(urlRequest);
        },
        getPlanGoodReceivePopup: function (model) {
            var urlRequest = this.url + "/GetPlanGoodReceivePopup";
            return clientService.post(urlRequest, model);
        },
        checkCopyItem: function (model) {
            var urlRequest = this.url + "/CheckCopyItem";
            return clientService.post(urlRequest, model);
        },getPoContrackByGoodReceiveId: function (id) {
            var urlRequest = this.url + "/getPoContrackByGoodReceiveId" + "/" + id;
            return clientService.get(urlRequest);
        }
    }
});    