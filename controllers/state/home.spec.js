describe('homeController', function() {
    beforeEach(module('myApp'));

    var $controller, homeController, $scope;

    beforeEach(inject(function(_$controller_, $rootScope) {
        
        $controller = _$controller_;
        $scope =  $rootScope.$new();

        homeController = $controller('homeController', { $scope: $scope });
    }))


    describe('$scope.component', function() {
        it('Check title', function() {
            expect($scope.component.title).toBe('KASCO TRUCK QUEUE');
        })

        it('Check User', function() {
            expect($scope.component.user).toBe('นาย เรียนรู้คน เรียนรู้โลก (บริษัท ตัวอย่างจำกัด)');
        })
    });

    it('First select menu', function() {
        expect($scope.selected).toContain('Home');
    });

});