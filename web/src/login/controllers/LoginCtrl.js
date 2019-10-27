(function()
{
    'use strict';

    /**
     * Controlador responsável pela view de login do sistema.
     *
     * @param $scope
     * @param $http
     * @param $state
     *
     * @constructor
     * @author Luan Carlo <Luan Carlo>
     */
    var LoginCtrl = function(
        $scope,
        toaster,
        Login
    ) {
        var messages = {
            '401': 'Seu usuário expirou!',
            '404': 'Usuário ou senha inválidos!',
            '403': 'Seu usuário está bloqueado!'
        };

        $scope.user = {};
        $scope.isSubmited = false;


        /**
         * Tenta realizar a autenticação remota do usuário.
         */
        $scope.login = function() {
            $scope.isSubmited = true;

            if (!$scope.form.$invalid){
                $scope.isWaiting = true;

                Login.requestLogin($scope.user, function(response){
                    $scope.isWaiting = false;
                    if (response.success) {
                        self.location.reload();
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
        }

        /**
         * Verifica o preenchimento de um campo do formulário.
         *
         * @param field
         * @returns {boolean}
         */
        $scope.checkField = function(field) {
            return $scope.isSubmited || field.$dirty;
        }

    }

    angular.module('app.login').controller(
        'login.LoginCtrl',
        [
            '$scope',
            'toaster',
            'login.Login',
            LoginCtrl
        ]
    );

}());