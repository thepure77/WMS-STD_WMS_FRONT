app.directive("slide", function ($timeout) {
        return {
            restrict: 'AE',
            templateUrl: 'widgets/silde/view.html',
            $scope: {
                images: '=?',
            },

            link: function ($scope, elem, attrs) {
                $scope.images = $scope.images;
                $scope.currentIndex = 0;
                $scope.nextImg = function () {
                    $scope.currentIndex < $scope.images.length - 1 ? $scope.currentIndex++ : $scope.currentIndex = 0;
                    // var video = angular.element(elem).find("video");


                    // video["0"].pause();

                }
                $scope.prevImg = function () {
                    $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.currentIndex = $scope.images.length - 1
                    // var video = angular.element(elem).find("video");
                    // video["0"].pause();

                }
                $scope.$watch('currentIndex', function () {
                    $scope.images.forEach(function (image) {
                        image.visible = false;
                    })
                    $scope.images[$scope.currentIndex].visible = true;
                })
                // var timer;
                // var sliderFunc = function(){
                //   timer = $timeout(function(){
                //     $scope.next();
                //     timer = $timeout(sliderFunc,2000);
                //   },2000)
                // }
                // sliderFunc();
                // $scope.$on('$destroy',function(){
                //   $timeout.cancel(timer);
                // })
            }
        }
    });

