(function()
{
    'use strict';

    /**
     * Serviço que fornece a api para conexão.
     *
     * @param $http
     * @param UI
     *
     * @constructor
     */
    var SessionService = function(
        $http,
        UI,
        $timeout,
        SweetAlert,
        $rootScope,
        Login,
        toaster,
        $compile
    ) {
        var me = this;
        me.session  = null;
        me.menu = null;

        /**
         * Seta a sessão do usuário no sistema.
         *
         * @param session
         */
        me.setSession = function(session){
            me.session = session;
        };

        /**
         * Recupera a sessão aberta para o usuário.
         *
         * @returns {*}
         */
        me.getSession = function(){
            return me.session;
        };


        me.startSessionValidator = function() {

            $timeout(function() {

                if(me.getSession() != null) {

                    $http.get('session/session/isOpened', { ignoreLoadingBar: true }).success(function(response) {

                        if(response != '1') {

                            var avatar = me.getSession().AVATAR;

                            if(avatar === null || avatar == '') avatar = "assets/img/user.png";

                            SweetAlert.swal({
                                title: "Sessão expirada!",
                                text: "" +
                                "<img src=\"" + avatar + "\" style=\"width: 128px; height: 128px;\" class=\"" +
                                "img-thumbnail img-circle\"> <br>" +
                                "<h4>" + me.getSession().NOME + "</h4> <br>" +
                                "Você foi desconectado do sistema por inatividade. Por favor insira a sua senha de " +
                                "acesso para renovar a sua sessão. <br>" +
                                "<div id=\"session_alert_form_container\"></div>",

                                html: true,
                                allowEscapeKey: false,
                                showCancelButton: true,
                                cancelButtonText: "Sair",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            }, function(confirm) {

                                if(confirm) {

                                    $scope.login();

                                } else {

                                    me.setSession(null);

                                    me.logout(function(){
                                        self.location.reload();
                                    });

                                }

                            });

                            var form_html = "" +
                                "<form name=\"form_sessao\" class=\"form-validation\" novalidate ng-submit=\"login()\" autocomplete=\"off\" style=\"margin-top: 20px;\">" +

                                "<md-input-container class=\"md-icon-float col-sm-12 m-t-md\">" +

                                "<label style=\"font-size: 1.4rem;\">Senha</label>" +
                                "<md-icon><i class=\"fa fa-lock\"></i></md-icon>" +
                                "<input ng-model=\"user.senha\" name=\"senha\" type=\"password\" style=\"font-size: 1.4rem;\" required>" +
                                "<div ng-messages=\"form_sessao.senha.$error\" role=\"alert\" ng-if=\"checkField(form_sessao.senha)\" >" +
                                "<ng-message when=\"required\">O campo senha precisa ser preenchido</ng-message>" +
                                "</div>" +

                                "</md-input-container>" +

                                "</form>";


                            var $scope = $rootScope.$new();

                            var messages = {
                                '401': 'Seu usuário expirou!',
                                '404': 'Senha inválida!',
                                '403': 'Seu usuário está bloqueado!'
                            };

                            $scope.user = {};
                            $scope.user.email = me.getSession().EMAIL;
                            $scope.isSubmited = false;


                            /**
                             * Tenta realizar a autenticação remota do usuário.
                             */
                            $scope.login = function() {
                                $scope.isSubmited = true;

                                if (!$scope.form_sessao.$invalid){
                                    $scope.isWaiting = true;

                                    Login.requestLogin($scope.user, function(response){
                                        $scope.isWaiting = false;
                                        if (response.success) {

                                            swal.close();
                                            me.startSessionValidator();

                                        } else {
                                            toaster.pop(
                                                'error',
                                                messages[response.code]
                                            );
                                        }

                                    });
                                } else {
                                    toaster.pop(
                                        'error',
                                        'Verifique o preenchimento do formulário'
                                    );
                                }
                            };

                            /**
                             * Verifica o preenchimento do formulário.
                             *
                             * @returns boolean
                             */
                            $scope.checkField = function(field) {
                                if (field) {
                                    return field.$dirty;
                                }
                            };


                            var linking_function = $compile(form_html);
                            var form_element = linking_function($scope);

                            var stop = false;
                            setTimeout(function(){ stop = true; }, 10000);

                            // Verifica se o javascript já deu "parse" no formulário para inserir a senha, que será renderizado pelo SweetAlert
                            var verifica_container = function() {

                                setTimeout(function(){

                                    if(document.getElementById('session_alert_form_container') != null && window.onkeydown != null) {

                                        $('#session_alert_form_container').append(form_element);
                                        window.onkeydown = null;

                                    } else if(stop == false) {
                                        verifica_container();
                                    }

                                }, 5);

                            };

                            verifica_container();

                        } else if(me.getSession() != null) {
                            me.startSessionValidator();
                        }

                    });

                }


            }, 60000);

        };


        /**
         * Seta o menu de navegação principal do sistema.
         *
         * @param menu
         */
        me.setMenu = function(menu){
            me.menu = menu;
        }


        /**
         * Função que encerra a sessão aberta para o usuário.
         *
         * @param {Function} callback
         */
        me.logout = function(callback){
            $http.post(UI.url + 'session/session/logout', {}).success(function(response){
                if (response.success) {
                    callback();
                }
            })
        }

        return me;
    };

    angular.module('singular.ui').factory(
        'ui.Session',
        [
            '$http',
            'UI',
            '$timeout',
            'SweetAlert',
            '$rootScope',
            'ui.Login',
            'toaster',
            '$compile',
            SessionService
        ]);
}());
