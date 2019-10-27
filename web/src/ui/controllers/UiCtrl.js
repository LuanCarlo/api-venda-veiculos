(function()
{
    'use strict';

    /**
     * Controlador da principal do sistema.
     *
     * @param $scope
     * @param $localStorage
     * @param $window
     * @constructor
     */
    var UiCtrl = function(
        $scope,
        $rootScope,
        $state,
        $localStorage,
        $window,
        $modal,
        SweetAlert,
        Session,
        Notification)
    {
        $scope.logout = function() {
            SweetAlert.swal({
                    title: "Sair",
                    text: "Deseja realmente sair do sistema?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Sim",
                    cancelButtonText: 'Não',
                    closeOnConfirm: false},
                function(confirm){
                    if (confirm){

                        /*var url = window.location.hash;
                        url = url.substring(1);
                        console.log(url);

                        $localStorage.state = url;*/
                        Session.setSession(null);

                        Session.logout(function(){

                            self.location.reload();
                        });

                    }
                });
        };

        $scope.changePass = function() {
            var modal = $modal.open({
                templateUrl: 'src/ui/views/senha.modal.html',
                controller: 'ui.SenhaModalCtrl',
                size: 'sm',
                resolve: {
                    record: function () {
                        return Session.session;
                    }
                }
            });

            modal.result.then(function () {
                $scope.session.session.trocar_senha = '0';
            }, function () {
            });
        };

        /*$rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $scope.selectedModule = toState.menu || toState.name;
            })
*/
        // $scope.selectedModule = $state.current.menu || $state.current.name;

        $scope.session = Session;

        // força a troca de senha do usuário
        if ($scope.session.session.ATIVO == '3') {
            $scope.changePass();
        }

        $scope.notification = Notification

        $scope.notification.addNotification({
            message: 'Notificação 1',
            date: new Date()
        });


    };

    angular.module('singular.ui').controller(
        'ui.UiCtrl',
        [
            '$scope',
            '$rootScope',
            '$state',
            '$localStorage',
            '$window',
            '$modal',
            'SweetAlert',
            'ui.Session',
            'ui.Notification',
            UiCtrl
        ]);
}());