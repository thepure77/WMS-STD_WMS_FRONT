'use strict';
app.controller('testController', ['$scope', 'ngAuthSettings', '$state', 'authService', 'pageLoading', '$window', 'commonService', '$timeout', '$compile', '$translate',
    function($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService, $timeout, $compile, $translate) {
        // selector

        // config language
        $scope.language = 'en';
        $scope.languages = ['en', 'th'];
        $scope.updateLanguage = function() {
            $translate.use($scope.language);
        };

        $scope.pdfUrl = 'http://kmmc.in/wp-content/uploads/2014/01/lesson2.pdf';


        $scope.exceloutput;

        $scope.$watch('exceloutput', function(newdata, old) {
            console.log(newdata);
        });


        $scope.title = "Modal Example!!!";
        $scope.showModal1 = false;
        $scope.showModal2 = false;

        $scope.test = 1;

        $scope.hide = function(m) {
            if (m === 1) {
                $scope.showModal1 = false;
            } else {
                $scope.showModal2 = false;
            }
        }

        $scope.modalOneShown = function() {
            console.log('model one shown');
        }

        $scope.modalOneHide = function() {
            console.log('model one hidden');
        }

        // calendar 
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event', // an option!
            currentTimezone: 'America/Chicago' // an option!
        };
        /* event source that contains custom events on the scope */
        $scope.events = [
            { title: 'Message1', start: new Date(y, m, 1), backgroundColor: '#1840FF' },
            { title: 'Message2', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2), backgroundColor: '#00FF7F' },
            { id: 999, title: 'Message3', start: new Date(y, m, d - 3, 16, 0), allDay: false, backgroundColor: '#FFA0D5' },
            { id: 999, title: 'Message4', start: new Date(y, m, d + 4, 16, 0), allDay: false, backgroundColor: '#00FF7F' },
            { title: 'Message5', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false, backgroundColor: '#FFA0D5' },
            { title: 'Message6', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/', backgroundColor: '#AA82FF' }
        ];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function(start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
            callback(events);
        };

        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            eventColor: 'yellow',
            events: [
                { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
            ]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function(date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function(value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function() {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index, 1);
        };
        /* Change View */
        $scope.changeView = function(view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function(calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        $scope.eventRender = function(event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        $scope.changeLang = function() {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
                $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                $scope.changeTo = 'Hungarian';
            }
        };
        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

    }
]);


app.controller('uploadController', ['$scope', 'ngAuthSettings', '$state', 'authService', 'pageLoading', '$window', 'commonService', '$timeout', '$compile', '$translate', 'Upload',
    function($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService, $timeout, $compile, $translate, Upload) {
        // upload file
        $scope.submit = function() {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };

        // upload on file select or drop
        $scope.upload = function(file) {
            Upload.upload({
                url: 'http://localhost:21822/api/upload/multipart',
                data: { file: file, 'username': $scope.username }
            }).then(function(resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

    }
]);