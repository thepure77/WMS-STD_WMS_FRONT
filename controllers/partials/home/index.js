'use strict';

app.controller('indexController', ['$scope', '$window', function ($scope, $window) {
    Date.prototype.toShortFormat = function () {

        let monthNames = ["Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"];

        let day = this.getDate();

        let monthIndex = this.getMonth();
        let monthName = monthNames[monthIndex];

        let year = this.getFullYear();

        return `${day} ${monthName} ${year}`;
    }

    function init() {
        // $scope.date = getToday();
        $scope.date = new Date().toShortFormat();
        // $(document).ready(function(){    
        //     //Check if the current URL contains '# or hash'
        //     if(document.URL.indexOf("#")==-1){
        //         // Set the URL to whatever it was plus "#loaded".
        //         url = document.URL+"#loaded";
        //         location = "#loaded";
        //         //Reload the page using reload() method
        //         location.reload(true);
        //     }
        // });
    }
    init();

}]);

