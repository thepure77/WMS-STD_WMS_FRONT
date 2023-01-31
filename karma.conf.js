// Karma configuration
// Generated on Wed Dec 12 2018 11:02:30 GMT+0700 (SE Asia Standard Time)
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/chart.js/dist/Chart.js',
      'node_modules/angular-chart.js/dist/angular-chart.js',
      'node_modules/angular-local-storage/dist/angular-local-storage.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-ui-calendar/src/calendar.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
      'www/lib/ng-file-upload/ng-file-upload.min.js',
      'assets/ui-sortable/sortable.min.js',
      'node_modules/moment/moment.js',
      'node_modules/angular-moment/angular-moment.js',
      'node_modules/angular-mocks/angular-mocks.js',
      '*.js',
      'controllers/**/*.js',
      'services/*.js',
      'modules/**/*.spec.js',
      'assets/dpPageLoad/pageLoad.js',
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
