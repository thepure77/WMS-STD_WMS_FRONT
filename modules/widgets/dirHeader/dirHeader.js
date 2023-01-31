app.directive("dirHeader", function (ngAuthSettings, $translate, ngLangauge) {
    return {
        restrict: 'E',
        scope: { toolbar: '=', user: '@' },
        controller: function ($scope, $timeout, $state/*, authService*/, dpMessageBox, commonService, pageLoading, localStorageService, userFactory, $window) {
            $scope.langSelected = {};
            $scope.langItems = ngLangauge;
            $scope.langSelected[0] = true;
            $scope.switLang = {};
            if ($window.localStorage['LANGUAGE'] == "th") {
                $scope.switLang.name = 'TH'
                $translate.use('th');
            }else
            {
                $scope.switLang.name = 'EN'
                $translate.use('en');
            }

            var loading = pageLoading;
            var messageBox = dpMessageBox;

            var viewModel = userFactory;
            // let Username = viewModel.getParam();
            let Username =  JSON.parse(localStorage.userlogin);
            if (Username != undefined) {
                $scope.data = Username.first_Name + " - " + Username.last_Name;
                $scope.userGroupName = $window.localStorage['userGroupName']
            }




            $scope.toggleHtml = function () {
                // if ($window.localStorage['isReload'] == 1) {
                //     $window.localStorage['isReload'] = 0;
                //     // $window.location.reload();
                //     $state.reload();
                // }
                $('html').toggleClass('sidebar-left-opened');
                //$('html').toggleClass('sidebar-left-opened');
            };

            $scope.changepassword = function () {
                $window.localStorage['checkchangepassword'] = 1 ;
                viewModel.setParam2(JSON.parse(localStorage.userlogin));
                $state.go('wms.user_form');
            };

            $scope.logOut = function () {
                messageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: "ออกจากระบบ",
                    message: 'คุณต้องการออกจากระบบใช่หรือไม่'
                }).then(function ok() {
                    loading.show();
                    viewModel.reset();
                    $timeout(function () {
                        // authService.logOut();
                        loading.hide();
                        $state.go('login');
                        // windows.reload();
                    }, 1000);
                });
            };

            // $scope.changLang = function (index) {
            //     var lang = $scope.langItems[index].lang;
            //     for (var prop in $scope.langItems) {
            //         $scope.langSelected[prop] = false;
            //     }
            //     $scope.langSelected[index] = true;
            //     $translate.use(lang);
            // }

            // Bank Add
            $scope.changLang = function(param) {
                
                $scope.lang = $scope.langItems.filter(c => c.name != param);
                var lang = $scope.lang[0].lang;
                var _switlang = "";
                if (lang == 'th') {
                    $scope.langSelected[0] = false;
                    $scope.langSelected[1] = true;
                    _switlang = $scope.langItems.filter(c => c.lang == lang);

                } else {
                    $scope.langSelected[1] = false;
                    $scope.langSelected[0] = true;
                    _switlang = $scope.langItems.filter(c => c.lang == lang);
                }
                $scope.switLang.name = _switlang[0].name;
                $translate.use(lang);

                $window.localStorage.setItem("LANGUAGE", lang);
            }

        },
        controllerAs: 'headerCtrl',
        templateUrl: "modules/widgets/dirHeader/dirHeader.html",
    }
});