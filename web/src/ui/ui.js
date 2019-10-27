(function()
{
    'use strict';

    var getView = function(view){
        return 'src/ui/views/' + view + '.html';
    }

    var uiModule = angular.module('singular.ui',[
        'toaster',
        'angular-loading-bar',
        'ngSweetAlert',
        'rt.select2',
        'ui.select',
        '720kb.datepicker',
        'idf.br-filters',
        'ngPatternRestrict',
        'siTable',
        'ui.utils',
        'ngMask',
        'textAngular',
        'ui.mask',
        'datatables',
        'datatables.fixedcolumns'
    ])
        .constant('UI', {
            "url": ""
        }).config(['$httpProvider','$stateProvider', function($httpProvider, $stateProvider) {
            //$httpProvider.defaults.useXDomain = true;
            //$httpProvider.defaults.headers.common.
            //delete $httpProvider.defaults.headers.common['X-Requested-With'];

            $stateProvider.state('app', {
                url: '/app',
                abstract: true,
                controller: 'ui.UiCtrl',
                templateUrl: getView('app')
            })
                .state('app.teste',{
                    url: '/teste',
                    templateUrl: getView('teste')
                });

        }]);

}());