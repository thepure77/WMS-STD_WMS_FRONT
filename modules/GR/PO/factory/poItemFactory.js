app.factory("purchaseOrderItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.PO + "PurchaseOrderItem",
        GetByPurchaseOrderItemId: function (id) {
            var urlRequest = this.url + "/GetByPurchaseOrderItemId" + "/" + id;
            return clientService.get(urlRequest);
        },
    }
});