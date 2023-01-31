app.factory("truckLoadItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.Load + "TruckLoadItem",

        find: function (id) {
            var urlRequest = this.url + "/find" + "/" + id;
            return clientService.get(urlRequest);
        },
        findDetail: function (id) {
            var urlRequest = this.url + "/findDetail" + "/" + id;
            return clientService.get(urlRequest);
        }
    }
});