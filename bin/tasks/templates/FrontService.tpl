(function()
{
    /**
     * Define um novo serviço.
     *
     * @author nome <email>
     */
    var $name = function($http)
    {
        var me = this;


        return me;
    }

    angular.module('$module').factory('$module.$name', ['$http', $name]);

}());