(function()
{
    'use strict';

    /**
     * Controlador responsável pela alteração de senha do usuário.
     *
     * @author Luan Carlo <Luan Carlo>
     */
    var SenhaModalCtrl = function(
        $scope,
        $http,
        $modalInstance,
        toaster,
        record)
    {
        $scope.isSubmited = false;

        $scope.usuario = {
            id: record.id
        }

        /**
         * Fecha a janela.
         */
        $scope.cancel = function() {
            $modalInstance.dismiss();
        }

        $scope.checkField = function(field){
            return $scope.isSubmited || field.$dirty;
        }

        /**
         * Salva o registro de uma tag de tecnico.
         */
        $scope.save = function(){
            $scope.isSubmited = true;

            if ($scope.form.$invalid){
                toaster.pop('error','Verifique o preenchimento do formulário!');
                return;
            }

            $http.post('./administracao/usuario/changePass', $scope.usuario).success(function(response){
                if (response.success){
                    toaster.pop('success','Senha alterada com sucesso!');
                    $modalInstance.close();
                } else {
                    toaster.pop('error', 'Senha antiga não confere!');
                }
            })
        }

    }

    angular.module('singular.ui').controller(
        'ui.SenhaModalCtrl',
        [
            '$scope',
            '$http',
            '$modalInstance',
            'toaster',
            'record',
            SenhaModalCtrl
        ]
    );

}());