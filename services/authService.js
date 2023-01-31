'use strict';

// refence : www.codeproject.com/Articles/784106/AngularJS-Token-Authentication-using-ASP-NET-Web-A
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$state', 'webServiceAPI', 'authenConstant',
    function ($http, $q, localStorageService, ngAuthSettings, $state, webServiceAPI, authenConstant) {
        var serviceBase = webServiceAPI + authenConstant.url;
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false,
            roleId: ""
        };

        // var _saveRegistration = function (registration) {
        //
        //     _logOut();
        //
        //     return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
        //         return response;
        //     });
        // };

        var _login = function (loginData) {
            // console.log('loginData > ', loginData)
            var deferred = $q.defer();

            var data = "User=" + loginData.Username + "&Password=" + loginData.Password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }

            var baseUrl = serviceBase;
            var t = {
                User: loginData.Username,
                Password: loginData.Password
            }

            $http.post(baseUrl, t)
                .success(function (response, status, headers, config) {                    
                    if (status == 200) {

                        if (response != null) {
                            localStorageService.set('authorizationData_OMS', {
                                app: response.app,
                                menu_ACT: response.menu_ACT,
                                token: response.token,
                                userGroup: response.userGroup,
                                userName: response.userName,
                            });
                        } else {
                            alert('ล็อคอินผิดพลาด กรุณาเช็ค Username และ Password');
                        }
                    }

                    _authentication.isAuth = true;
                    _authentication.userName = response.username;
                    _authentication.useRefreshTokens = response.useRefreshTokens;
                    _authentication.userGroup = response.userGroup;

                    deferred.resolve(response);

                }).error(function (err, status) {
                    console.log('useRefreshTokens : unauthorizatio', err);
                    localStorageService.remove('authorizationData_OMS');
                    deferred.reject(err);
                });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData_OMS');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;
            _authentication.userGroup = "";
            sessionStorage.clear();

            /*
            var max = sessionStorage.length;
            for (var i = 0; i < max; i++) {
                var key = sessionStorage.key(i);
                sessionStorage.removeItem(key);
            }
            */

        };

        var _fillAuthData = function () {
            //console.log('authService.fillAuthData at ', new Date().getTime());
            var authData = localStorageService.get('authorizationData_OMS');
            var currnetState = $state.current.name;

            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
                _authentication.userGroup = authData.userGroup;
                //console.log('fillAuthData : authorizatio', new Date().getTime());
                return true;
            } else {
                localStorageService.remove('authorizationData_OMS');
                $state.go('login');
                return false;
                //console.log('fillAuthData : unauthorizatio', new Date().getTime(), 'authData >>', authData);
            }
        }
        var _switchCompany = function () {

        }
        var _token = function () {
            return localStorageService.get("authorizationData_OMS");
        }

        var _profile = function () {
            var defer = $q.defer();

            var url = webServiceAPI + 'Account/AD/Profile';

            $http.get(url).then(function (result) {

                if (result.status === 200) {

                    if (result != null) {

                        // localStorageService.set('authorizationData_OMS_Profile', result.data);
                        defer.resolve(result.data);
                    } else {
                        defer.resolve(result);
                    }
                } else {
                    //localStorageService.remove('authorizationData_OMS');
                    defer.reject(result);
                }
            }).catch(function (error) {
                //localStorageService.remove('authorizationData_OMS');
                defer.reject({ 'Message': 'Login Fail' });
            });

            return defer.promise;
        }
        // authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.switchCompany = _switchCompany;
        authServiceFactory.token = _token;
        authServiceFactory.profile = _profile;

        authServiceFactory.company = function (value) {
            if (value) {
                localStorageService.set('authorizationCompanyProfile', value);
            } else {
                return localStorageService.get('authorizationCompanyProfile');
            }
        };
        authServiceFactory.user = function (value) {
            if (value) {
                localStorageService.set('authorizationUsers', value);
            } else {
                return localStorageService.get('authorizationUsers');
            }
        };



        return authServiceFactory;
    }]);
