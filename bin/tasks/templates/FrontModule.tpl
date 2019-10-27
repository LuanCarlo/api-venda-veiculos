(function()
{
    'use strict';

    var getView = function(view){
        return '$dest/views/' + view + '.html';
    }

    var module = angular.module('$name', []);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        /*
            // defina aqui seus states
            $stateProvider.state('modulestate', {
                url: '/modulestate',
                controller: 'Controller',
                templateUrl: getView('view')
            })
        */
    }]);

}());