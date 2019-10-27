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
     * @author Luan Carlo <Luan Carlo>
     */
    var SenhaService = function(
        $http,
        UI
    ) {
        var me = this;

        /**
         * Chama função para alteração de senha do usuário.
         *
         * @param {Object}   data
         * @param {Function} callback
         */
        me.changePass = function(data, callback){
            $http.post('session/session/changePass', data).success(callback)
        }

        return me;
    }

    angular.module('app.login').factory(
        'login.Senha',
        [
            '$http',
            'UI',
            SenhaService
        ]
    );

}());