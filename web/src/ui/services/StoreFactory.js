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
    var StoreFactory = function(
        $http,
        UI,
        SweetAlert,
        toaster,
        Session
    ) {
        var me = this,
            session = Session.getSession();

        /**
         * Cria um serviço com funcionalidades de Crud Padrão.
         *
         * @param {string} pack Pacote do backend ao qual pertence o controlador.
         * @param {string} controller Controlador do backend pertencente ao pacote.
         *
         * @return {object}
         */
        me.create = function(pack, controller) {

            function getUrl(){
                return pack + '/' + controller;
            }

            /**
             * Recupera os parâmetros de ordenação.
             *
             * @param {array} params
             * @return {object}
             */
            function getSort(params){
                var sort = {};

                angular.forEach(params, function(param){
                    var direction = 'ASC';

                    if (param.charAt(0) == '-') {
                        direction = 'DESC';
                        param = param.substr(1);
                    }

                    sort[param] = direction;
                })

                return sort;
            }

            /**
             * Recupera os filtros a serem aplicados na consulta.
             *
             * @param {object} filters
             * @return {object}
             */
            function getFilter(filters){
                var filter = {};

                angular.forEach(filters, function(value, key){
                    if (that.filterMap[key]) {
                        if (typeof that.filterMap[key] == 'object'){
                            var property = that.filterMap[key].prop;

                            if (!that.filterMap[key].convert){
                                filter[property] = that.filterMap[key].value + value;
                            } else {
                                filter[property] = that.filterMap[key].value + that.filterMap[key].convert(value);
                            }

                        } else {
                            filter[key] = that.filterMap[key]+ value;
                        }
                    } else {
                        filter[key] = value;
                    }
                })

                return filter;
            }

            var that = {
                results: [],
                total: 0,
                filterFocus: false,
                isSubmited: false,
                sort: [],
                paging: {
                    currentPage: 1,
                    pageSize: 50
                },
                filterMap: {
                },
                filter: {
                },

                /**
                 * Verifica se o usuário pode executar a ação de exclusão de um registro.
                 *
                 * @returns {boolean}
                 */
                canRemove : function () {
                    if (that.perfilDelete) {
                        if (that.perfilDelete.indexOf('|' + session.perfil_codigo + '|') == -1) {
                            return false;
                        }
                    }

                    return true;
                },

                /**
                 * Limpa os filtros aplicados a uma listagem de registros.
                 *
                 * @param {function} callback
                 */
                clearFilter : function(callback) {
                    that.filter = {};
                    that.load(callback);
                },

                /**
                 * Checa a validação de um campo do formulário para exibição de mensagem de erro.
                 *
                 * @param {object} field
                 * @returns {boolean|FormController.$dirty|*|ngModel.NgModelController.$dirty}
                 */
                checkField : function(field,name) {
                    if (field) {
                        return that.isSubmited || field.$dirty;
                    }
                },

                /**
                 * Chama método remoto para recuperação de um registro a partir do seu ID.
                 *
                 * @param {integer} id
                 * @param {function} callback
                 */
                get : function(id, callback){
                    var url = getUrl();

                    $http.post(url + '/get', {id: id}).success(function(response){
                        callback(response.result);
                    });
                },

                /**
                 * Chama método remoto para atualização/inserção de um registro.
                 *
                 * @param {object} data
                 * @param {function} callback
                 */
                save : function(data, callback){
                    var url = getUrl();

                    $http.post(url + '/save', data).success(function(response){
                        callback(response);
                    });
                },

                /**
                 * Chama método remoto para exclusão de um registro.
                 *
                 * @param {integer} id
                 * @param {function} callback
                 */
                remove : function(id, callback) {
                    if (that.canRemove()) {
                        SweetAlert.swal({
                            title: "Atenção",
                            text: "Deseja realmente apagar este registro?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Sim",
                            cancelButtonText: 'Não',
                            closeOnConfirm: true},
                        function(confirm) {
                            if (confirm) {
                                that.call('remove', {id: id}, function(response){
                                    if (response.success) {
                                        toaster.pop('success','Exclusão realizada com sucesso!');
                                        callback(true);
                                    } else {
                                        callback(false);
                                    }
                                });
                            }
                        });

                    } else {
                        toaster.clear();
                        toaster.pop('error','ACESSO NEGADO','Seu usuário não tem permissão para executar esta ação!');
                    }
                },

                /**
                 * Recupera um registro na lista d registros carregados por uma determinada propriedade.
                 *
                 * @param {string} field
                 * @param {string} value
                 * @param {string} property
                 * @param {array}  list
                 *
                 * @return {integer}
                 */
                getBy : function(field, value, property, list){
                    var source = that.results;

                    if (list) {
                        source = list;
                    }

                    var record = $.grep(source, function(item){ return item[field] == value; });

                    if (record.length > 0){
                        if (property){
                            return record[0][property];
                        }

                        return record[0];
                    }
                },

                /**
                 * Chama um método remoto na api.
                 *
                 * @param {string} method
                 * @param {object} params
                 * @param {function} callback
                 */
                call : function(method, params, callback){
                    var url = getUrl();

                    $http.post(url + '/' + method, params).success(callback);
                },

                /**
                 * Função que carrega a relação de registros.
                 *
                 * @param {function} callback
                 */
                load : function(callback) {

                    if ('function' != typeof callback) {
                        callback = function(){}
                    }

                    var params = {
                            paging: {
                                start: (that.paging.currentPage -1) * that.paging.pageSize,
                                limit: that.paging.pageSize
                            },
                            filter: getFilter(that.filter),
                            sort: getSort(that.sort)
                        },
                        url = getUrl();

                    $http.post(url + '/find', params).success(function(response){
                        that.results = response.results;
                        that.total = response.total;
                        callback(that);
                        that.filterFocus = true;
                    });
                }
            }

            return that;
        }

        return me;
    }

    angular.module('singular.ui').factory(
        'ui.StoreFactory',
        [
            '$http',
            'UI',
            'SweetAlert',
            'toaster',
            'ui.Session',
            StoreFactory
        ]);
}());