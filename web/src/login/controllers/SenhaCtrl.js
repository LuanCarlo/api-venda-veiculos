(function()
{
    'use strict';

    /**
     * Controlador responsável pela view de alteração de senha do sistema.
     *
     * @constructor
     * @author Luan Carlo <luancarlo.paulo@gmail.com>
     * @param {object} $scope
     * @param {object} toaster
     * @param {object} Senha
     */
    var SenhaCtrl = function(
        $scope,
        toaster,
        Senha
    ) {

        $scope.user = {};
        $scope.isSubmited = false;


        $scope.change = function() {
            $scope.isSubmited = true;

            if (!$scope.form.$invalid) {
                $scope.isWaiting = true;
                Senha.changePass($scope.user, function(response) {
                    $scope.isWaiting = false;
                    if (response.success) {
                        toaster.pop(
                            'success',
                            'A senha foi enviada com sucesso, para o e-mail cadastrado!'
                        );
                    } else {
                        toaster.pop(
                            'error',
                            'Email não cadastrado!'
                        );
                    }

                });
            } else {
                toaster.pop(
                    'error',
                    'Preencha o Campo Email!'
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
        'login.SenhaCtrl',
        [
            '$scope',
            'toaster',
            'login.Senha',
            SenhaCtrl
        ]
    );
    
}());