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
    var NotificationService = function($http, UI)
    {
        var me = this;

        /**
         * Array de Notificações.
         *
         * @type {Array}
         */
        me.notifications = [];

        /**
         * Adiciona uma notificação na lista de notificações.
         *
         * @param {Function} callback
         */
        me.addNotification = function(notification) {
            me.notifications.push(notification);
        }

        return me;
    }

    angular.module('singular.ui').factory(
        'ui.Notification',
        [
            '$http',
            'UI',
            NotificationService
        ]
    );
}());