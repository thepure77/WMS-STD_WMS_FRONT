app.factory("goodReceiveFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GR + "GoodsReceiveItem",
        getId: function (model) {
            var urlRequest = this.url + "/getId";
            return clientService.post(urlRequest,model);
        },
    }
});