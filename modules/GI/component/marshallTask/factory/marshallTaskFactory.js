app.factory("marshallTaskFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GI + "TaskList",
        getId: function (model) {
            var urlRequest = this.url + "/getTask/" + model;
            return clientService.get(urlRequest);
        },
    }
});