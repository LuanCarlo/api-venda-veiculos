(function()
{
    /**
     * Diretiva responsável por verificar se o usuário tem ou não acesso a un determinado componenete do sistema.
     *
     * @returns {{restrict: string, link: Function}}
     *
     * @constructor
     */
    var Acl = function($state,toaster)
    {
        return {
            priority: 1000,
            terminal: false,
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var acl = window.APP.acl;

                if (acl.indexOf('|' + $attr.acl + '|') == -1) {
                    $element.remove();
                }

            }
        }
    };

    angular.module('singular.ui').directive('acl', ['$state','toaster', Acl]);

}());

