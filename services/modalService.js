'use strict'
app.factory('dynamicModal', function ($q, $http) {

    var message = 'greeting na';

    var dynamicModalService = {};

    dynamicModalService.confirm = function() {
        return 'greeting na';
    }

    return dynamicModalService;
});