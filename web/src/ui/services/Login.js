(function()
{
    'use strict';

    /**
     * Serviço que fornece a api para conexão.
     *
     * @constructor
     * @param $http
     * @param UI
     *
     * @author Luan Carlo <Luan Carlo>
     */
    var LoginService = function(
        $http,
        UI
    ) {
        var me = this;

        /**
         * Função que faz o login.
         *
         * @param {Object}   data
         * @param {Function} callback
         */
        me.requestLogin = function(data, callback){
            $http.post('session/session/login', data).success(callback)
        }

        return me;
    }

    angular.module('singular.ui').factory(
        'ui.Login',
        [
            '$http',
            'UI',
            LoginService
        ]
    );

}());