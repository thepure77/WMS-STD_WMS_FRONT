'use strict';

// refence : www.codeproject.com/Articles/784106/AngularJS-Token-Authentication-using-ASP-NET-Web-A

app.factory('authInterceptorService', ['$q', '$location','localStorageService', 'ngAuthSettings',  function ($q, $location, localStorageService, ngAuthSettings) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
        var authData = localStorageService.get('toKen');
        if (authData) {
            // var isExpired = jwtHelper.isTokenExpired(authData);
            // if(!isExpired)
            // {
            //     // config.headers.Authorization = 'Bearer ' + authData;
            //     // config.headers["Access-Control-Allow-Origin"] = '*';
            // }
        // else {
        //         var isRefreshing = localStorageService.get('isRefreshing');

        //         if(!isRefreshing){
        //             localStorageService.set('isRefreshing', true);

        //             let toKenRefresh = {};
        //             toKenRefresh.refresh = localStorageService.get('toKenRefresh');
                
        //             // getToken(toKenRefresh);
        //         }
        //     }
        }
        return config;
    }

    // function getToken(toKenRefresh) {
    //     var userFactory = $injector.get("userFactory");
    //     userFactory.getToken(toKenRefresh).then(function (res) {
    //         localStorageService.set('isRefreshing', false);

    //         if (res.data.status == "ERROR") {
    //             localStorageService.remove('toKen');
    //             localStorageService.remove('toKenRefresh');
    //             userFactory.reset();
    //             $state.go('login');
    //         }
    //         else{
    //             localStorageService.set('toKen', res.data.model.token);
    //             localStorageService.set('toKenRefresh', res.data.model.refresh);
    //         }
    //     });
    // }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            localStorageService.remove('toKen');
            $state.go('login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
