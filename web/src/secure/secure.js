(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/views/' + view + '.html';
    };

    var module = angular.module(
        'app.secure',
        [
            'ngAnimate',
            'ui.router',
            'singular.ui',
            'ngJsTree',
            'ngCookies',
            'ngStorage',
            'ngGrantt',
            'summernote',
            'ui.bootstrap',
            'ui.sortable',
            'ngResource',
            'ngSanitize',
            'easypiechart',
            'localytics.directives',
            'ngTouch',
            'ui.router',
            'singular.ui',
            'upload.button',
            'lr.upload',
            'angularMoment',
            'ui.utils.masks',
            'smart-table',
            'ngMessages',
            'ngMaterial',
            'flexcalendar',
            'froala',
            'colorpicker.module',
            'ui.sortable',
            'ui.calendar'
        ]
    );

    module.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$localStorageProvider',
        function($stateProvider, $urlRouterProvider, $localStorageProvider) {
            var state = '/app/servicedesk/dashboard';

            /* Se o state salvo no local storage for o de login, não deve ocorrer o redirecionamento para ele, pois
            o sistema tentaria redirecionar para um state inexistente (o state de login existe somente em auth.app),
            onde o usuário fica em uma tela em branco. */
            if (typeof $localStorageProvider.$get('ngStorage').state != 'undefined' &&
                $localStorageProvider.$get('ngStorage').state != '/login') {
                state = $localStorageProvider.$get('ngStorage').state;
            }

            $urlRouterProvider.otherwise(state);
        }
    ])
        .run([
            '$rootScope',
            '$state',
            '$localStorage',
            '$urlRouter',
            '$location',
            'toaster',
            'ui.Session',
            function($rootScope, $state, $localStorage, $urlRouter, $location, toaster, Session){

                var acl = window.APP.acl;

                var perfil = window.APP.session.perfil_codigo;
                Session.setSession(window.APP.session);
                Session.setMenu(window.APP.menu);
                Session.startSessionValidator();

                $rootScope.$on("$locationChangeStart",function(event, next, current){
                    var url = next.substring(next.indexOf('#')+1),
                        state = $state.fromUrl(url);

                    if (state){
                        if (state.self.acl) {
                            if (acl.indexOf('|' + state.self.acl + '|') == -1) {
                                event.preventDefault();
                            }
                        }
                    }
                });


                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                    if (toState.acl) {
                        if (acl.indexOf('|' + toState.acl + '|') == -1) {
                            toaster.clear();
                            toaster.pop('error','ACESSO NEGADO','Seu usuário não tem permissão para executar esta ação!');
                            event.preventDefault();
                        }
                    }
                });


                $rootScope.$on('$locationChangeSuccess', function(){

                    var url = window.location.hash;

                    url = url.substring(1);
                    $localStorage.state = url;

                });

            }

        ]);

}());