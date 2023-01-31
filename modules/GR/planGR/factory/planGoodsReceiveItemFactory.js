app.factory("planGoodsReceiveItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.PlanGR + "PlanGoodsReceiveItem",
        getByPlanGoodReceiveId: function (id) {
            var urlRequest = this.url + "/getByPlanGoodReceiveId" + "/" + id;
            return clientService.get(urlRequest);
        },
        getId: function (model) {
            var urlRequest = this.url + "/find/" + model;
            return clientService.get(urlRequest);
        },
        GetGoodsReceiveItem: function (model) {
            var urlRequest = this.url + "/getGoodsReceiveItem" + "/" + model;
            return clientService.get(urlRequest);
        },
        GetRemainQty: function (model) {
            var urlRequest = this.url + "/getRemainQty" + "/" + model;
            return clientService.get(urlRequest);
        },
        getPurchaseOrderPopup: function (model) {
            var urlRequest = webServiceAPI.PlanGR+"PopupPlanGoodsReceive/GetPlanPOPopup";
            return clientService.post(urlRequest, model);
        },
        returnmatdoc: function (id) {
            var urlRequest = this.url + "/returnmatdoc" + "/" + id;
            return clientService.get(urlRequest);
        },
    }
});