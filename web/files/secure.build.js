
(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/views/' + view + '.html';
    }

    var module = angular.module('app.secure', ['ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize',
            'ngTouch', 'ngStorage', 'ui.router', 'ui.bootstrap', 'singular.ui','upload.button',
            'lr.upload','angularMoment', 'ui.utils.masks','smart-table','ngMessages','ngMaterial','flexcalendar'
        ]
    );

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/app/grupoequipamento/list');

        //$stateProvider.state('app.dashboard', {
        //    url: '/dashboard',
        //    templateUrl: 'src/secure/acompanhamento/painelcontrole/views/painelcontrole.list.html',
        //    controller: 'painelcontrole.ListCtrl'
        //});


    }])
        .run(['$rootScope','$state','$urlRouter','toaster','ui.Session', function($rootScope, $state,$urlRouter, toaster, Session){
            var perfil = window.APP.session.perfil_codigo;
            Session.setSession(window.APP.session);
            Session.setMenu(window.APP.menu);

            $rootScope.$on("$locationChangeStart",function(event, next, current){
                var url = next.substring(next.indexOf('#')+1),
                    state = $state.fromUrl(url);

                if (state.state.perfil) {
                    if (state.state.perfil.indexOf('|' + perfil + '|') == -1) {
                        event.preventDefault();
                    }
                }
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                if (toState.perfil) {
                    if (toState.perfil.indexOf('|' + perfil + '|') == -1) {
                        toaster.clear();
                        toaster.pop('error','ACESSO NEGADO','Seu usuário não tem permissão para executar esta ação!');
                        event.preventDefault();
                    }
                }
            })
        }]);

}());

(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/cadastro/views/' + view + '.html';
    }

    var module = angular.module('ideha.administracao', ['administracao.usuario','administracao.common']);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        /*
            // defina aqui seus states
            $stateProvider.state('modulestate', {
                url: '/modulestate',
                controller: 'Controller',
                templateUrl: getView('view')
            })
        */
    }]);

}());

(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/administracao/common/views/' + view + '.html';
    }

    var module = angular.module('administracao.common', []);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {


    }]);

}());

(function()
{
    /**
     * Define o serviço do Store de perfis de usuário.
     *
     * @author nome <marcony@netonsolucoes.com.br>
     */
    var UfStore = function($http, StoreFactory)
    {
        var service = StoreFactory.create('administracao','uf');


        return service;
    }

    angular.module('administracao.common').factory('administracao.UfStore', ['$http', 'ui.StoreFactory', UfStore]);

}());

(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/administracao/usuario/views/' + view + '.html';
    }

    var module = angular.module('administracao.usuario', []);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {


            // defina aqui seus states
            $stateProvider.state('app.usuario-list', {
                url: '/usuario/list',
                perfil: '|A|',
                controller: 'usuario.ListCtrl',
                templateUrl: getView('usuario.list')
            })
                .state('app.usuario-create', {
                    url: '/usuario/create',
                    perfil: '|A|',
                    controller: 'usuario.CreateCtrl',
                    templateUrl: getView('usuario.form')
                })
                .state('app.usuario-edit', {
                    url: '/usuario/edit/:id',
                    perfil: '|A|',
                    controller: 'usuario.EditCtrl',
                    templateUrl: getView('usuario.form')
                })

    }]);

}());

(function()
{
    'use strict';

    /**
     * Define um novo controlador.
     *
     * @author Marcony Pessotti <marconypessotti@netonsolucoes.com>
     */
    var UsuarioFormCtrl = function($scope, $state, $modal, SweetAlert, toaster,  UsuarioStore, PerfilStore, UfStore)
    {
        $scope.isEdit = false;

        $scope.UsuarioStore = UsuarioStore;
        $scope.PerfilStore = PerfilStore;
        $scope.UfStore = UfStore;

        $scope.atuacoes = [];
        $scope.atuacao = {uf: null};
        $scope.usuario = {};

        /**
         * Salva o registro de um usuário.
         */
        $scope.save = function(){
            toaster.clear();
            $scope.UsuarioStore.isSubmited = true;

            if ($scope.form.$invalid) {
                toaster.pop('error','Verifique o preenchimento do formulário!');
                return;
            }

            if ($scope.atuacoes.length == 0) {
                toaster.pop('error', 'Favor adicionar pelo menos um estado ao usuário!');
                return;
            }

            var usuario = angular.copy($scope.usuario);

            usuario.atuacoes = $scope.atuacoes;
            usuario.status = '1';

            $scope.UsuarioStore.save(usuario, function(response){
                toaster.clear();
                if (response.success) {
                    toaster.pop('success', 'Usuário incluído com sucesso!');
                    $state.go('app.usuario-edit',{id: response.record});
                    return ;
                }

                toaster.pop('error', 'CPF duplicado!');
            });
        }

        /**
         * Adiciona uma atuação ao registro do usuário.
         */
        $scope.addAtuacao = function(){
            var exists = false;
            toaster.clear();

            $scope.UfStore.isSubmited = true;

            if (!$scope.formAtuacao.$invalid) {

                angular.forEach($scope.atuacoes, function(atuacao){
                    if (atuacao.uf_id == $scope.atuacao.uf) {
                        exists = true;
                    }
                });

                if (exists) {
                    toaster.pop('error','O estado informado já foi incluído para o usuário!');
                    return;
                }

                var uf = $scope.UfStore.results.filter(function(item){
                    return item.id == $scope.atuacao.uf
                });

                $scope.atuacoes.push({
                    id: 0,
                    usuario_id: 0,
                    uf_id: $scope.atuacao.uf,
                    sigla: uf[0].sigla
                });

                $scope.atuacao = {uf: null};
                $scope.formAtuacao.$setPristine();
                $scope.UfStore.isSubmited = false;

            } else {
                toaster.pop('error', 'O estado precisa ser informado!');
            }
        }

        /**
         * Remove o registro de atuação do usuário.
         *
         * @param {integer} atuacaoId
         * @param {integer} idx
         */
        $scope.removeAtuacao = function(atuacaoId, idx) {
            $scope.atuacoes.splice(idx, 1);
            toaster.pop('success', 'Estado excluído com sucesso!');
        }

        // carrega os dados necessários nos campos do formulário
        $scope.PerfilStore.load();
        $scope.UfStore.load();

        // registra evento de destruição de escopo
        $scope.$on('$destroy', function(){
            $scope.UsuarioStore.isSubmited = false;
            $scope.UfStore.isSubmited = false;
        })
    }


    angular.module('administracao.usuario').controller('usuario.CreateCtrl',['$scope','$state','$modal','SweetAlert','toaster','usuario.UsuarioStore','usuario.PerfilStore','administracao.UfStore', UsuarioFormCtrl]);

}());

(function()
{
    'use strict';

    /**
     * Define um novo controlador.
     *
     * @author Marcony Pessotti <marconypessotti@netosolucoes.com>
     */
    var UsuarioFormCtrl = function($scope, $state, $stateParams, $modal, SweetAlert, toaster, UsuarioStore, PerfilStore, UfStore)
    {
        $scope.isEdit = true;
        $scope.hasRecord = true;

        $scope.UsuarioStore = UsuarioStore;
        $scope.PerfilStore = PerfilStore;
        $scope.UfStore = UfStore;

        $scope.atuacao = {uf: null};

        // recupera o registro do usuário a ser editado
        $scope.UsuarioStore.get($stateParams.id, function(record){
            if (!record) {
                $scope.hasRecord = false;
                return;
            }
            record.dt_nascimento = moment(record.dt_nascimento).format('DD/MM/YYYY');
            $scope.usuario = record;
        });

        // carrega a lista de atuações associadas ao usuário a ser editado
        function loadAtuacoes() {
            $scope.deletedAtuacao = 0;
            $scope.UsuarioStore.listAtuacoes($stateParams.id, function(response){
                $scope.atuacoes = response.results;
            });
        }

        loadAtuacoes();

        /**
         * Adiciona uma atuação ao registro do usuário.
         */
        $scope.addAtuacao = function(){
            toaster.clear();

            $scope.UfStore.isSubmited = true;

            if (!$scope.formAtuacao.$invalid) {
                $scope.UsuarioStore.addAtuacao($stateParams.id, $scope.atuacao.uf, function(success){
                    toaster.clear();
                    if (success) {
                        toaster.pop('success', 'Estado incluído com sucesso!');
                        $scope.atuacao = {uf: null};
                        $scope.formAtuacao.$setPristine();
                        $scope.UfStore.isSubmited = false;
                        if ($scope.deletedAtuacao > 0){
                            $scope.UsuarioStore.removeAtuacao($scope.deletedAtuacao, function(success){
                                if (success) {
                                    loadAtuacoes();
                                }
                            });
                        } else {
                            loadAtuacoes();
                        }
                    } else {
                        toaster.pop('error','O estado informado já foi incluído para o usuário!');
                    }
                })
            } else {
                toaster.pop('error', 'O estado precisa ser informado!');
            }
        }

        /**
         * Remove o registro de atuação do usuário.
         *
         * @param {integer} atuacaoId
         * @param {integer} idx
         */
        $scope.removeAtuacao = function(atuacaoId, idx) {
            if ($scope.atuacoes.length == 1) {
                toaster.pop('success', 'Estado excluído com sucesso!');
                $scope.atuacoes.splice(idx, 1);
                $scope.deletedAtuacao = atuacaoId;

                return;
            }

            $scope.UsuarioStore.removeAtuacao(atuacaoId, function(success){
                toaster.clear();
                if (success) {
                    toaster.pop('success', 'Estado excluído com sucesso!');
                    $scope.atuacoes.splice(idx, 1);
                }
            });
        }

        /**
         * Salva o registro de um usuário.
         */
        $scope.save = function(){
            toaster.clear();

            $scope.UsuarioStore.isSubmited = true;

            if ($scope.form.$invalid) {
                toaster.pop('error','Verifique o preenchimento do formulário!');
                return;
            }

            if ($scope.atuacoes.length == 0) {
                toaster.pop('error', 'Favor adicionar pelo menos um estado ao usuário!');
                return;
            }

            var usuario = angular.copy($scope.usuario);

            $scope.UsuarioStore.save(usuario, function(response){
                toaster.clear();

                if (response.success) {
                    toaster.pop('success', 'Usuário alterado com sucesso!');
                    return ;
                }

                toaster.pop('error', 'CPF duplicado!');
            })
        }

        // carrega os dados necessários nos campos do formulário
        $scope.PerfilStore.load();
        $scope.UfStore.load();

        // registra evento de destruição de escopo
        $scope.$on('$destroy', function(){
            $scope.UsuarioStore.isSubmited = false;
            $scope.UfStore.isSubmited = false;
        })

    }


    angular.module('administracao.usuario').controller('usuario.EditCtrl',['$scope','$state','$stateParams','$modal','SweetAlert','toaster','usuario.UsuarioStore','usuario.PerfilStore','administracao.UfStore', UsuarioFormCtrl]);

}());

(function()
{
    'use strict';

    /**
     * Define um novo controlador.
     *
     * @author nome <email>
     */
    var UsuarioListCtrl = function($scope, $state, $modal,  $localStorage, SweetAlert,toaster, UsuarioStore)
    {
        $scope.UsuarioStore = UsuarioStore;

        $scope.query = null;

        $scope.hideFilter = $localStorage.usuarioHideFilter;

        $scope.$watch('hideFilter', function() {
            $localStorage.usuarioHideFilter = $scope.hideFilter;
        });

        //$scope.UsuarioStore.load(function(){});


        $scope.changeStatus = function(usuario, status){
            $scope.UsuarioStore.changeStatus(usuario.id, status, function(){
                var message = 'Inativação realizada com sucesso!';

                if (status == 1){
                    message = 'Ativação realizada com sucesso!';
                }

                usuario.status = status;
                toaster.pop('success', message);
            })
        }

        $scope.$watch('UsuarioStore.sort', $scope.UsuarioStore.load, true);

    }

    angular.module('administracao.usuario').controller('usuario.ListCtrl',['$scope','$state', '$modal', '$localStorage','SweetAlert','toaster','usuario.UsuarioStore', UsuarioListCtrl]);

}());

(function()
{
    /**
     * Define o serviço do Store de usuário.
     *
     * @author nome <marcony@netonsolucoes.com.br>
     */
    var AtuacaoStore = function($http, StoreFactory)
    {
        var service = StoreFactory.create('administracao','atuacao');

        return service;
    }

    angular.module('administracao.usuario').factory('usuario.AtuacaoStore', ['$http', 'ui.StoreFactory', AtuacaoStore]);

}());

(function()
{
    /**
     * Define o serviço do Store de perfis de usuário.
     *
     * @author nome <marcony@netonsolucoes.com.br>
     */
    var PerfilStore = function($http, StoreFactory)
    {
        var service = StoreFactory.create('administracao','perfil');

        service.sort = ['perfil'];

        return service;
    }

    angular.module('administracao.usuario').factory('usuario.PerfilStore', ['$http', 'ui.StoreFactory', PerfilStore]);

}());

(function()
{
    /**
     * Define o serviço do Store de usuário.
     *
     * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
     * @author Marcony Pessotti <marcony@netonsolucoes.com.br>
     */
    var UsuarioStore = function($http, StoreFactory)
    {
        var me = StoreFactory.create('administracao','usuario');

        /**
         * Altera o status de um usuário.
         *
         * @param {integer} id
         * @param {string} status
         * @param {function} callback
         */
        me.changeStatus = function(id, status, callback){
            me.save({id: id, status: status}, callback);
        }

        /**
         * Carrega a lista de atuações do usuário.
         *
         * @param {integer} usuarioId
         * @param {function} callback
         */
        me.listAtuacoes = function(usuarioId, callback){
            me.call('listAtuacoes',{usuario_id: usuarioId}, callback);
        }

        /**
         * Carrega a lista de usuarios coordenadores relacionados a atuacao do usuário logado no sistema
         *
         * @param {integer} usuarioId
         * @param {function} callback
         */
        me.listUsuariosGestores = function(usuarioId, callback){
            me.call('listUsuariosGestores',{usuario_id: usuarioId}, callback);
        }

        /**
         * Carrega a lista de usuarios técnicos relacionados a atuacao do usuário logado no sistema
         *
         * @param {integer} usuarioId
         * @param {function} callback
         */
        me.listUsuariosTecnicos = function(usuarioId, callback){
            me.call('listUsuariosTecnicos',{usuario_id: usuarioId}, callback);
        }

        /**
         * Carrega a lista de usuario pelo id
         *
         * @param {integer} usuarioId
         * @param {function} callback
         */
        me.getUser = function(usuarioId, callback){
            me.call('getUser',{usuario_id: usuarioId}, callback);
        }

        /**
         * Adiciona um estado na lista de atuações do usuário.
         *
         * @param {integer} usuarioId
         * @param {integer} estadoId
         * @param {function} callback
         */
        me.addAtuacao = function(usuarioId, estadoId, callback) {
            me.call('addAtuacao', {usuario_id: usuarioId, uf_id: estadoId}, function(response){
                callback(response.success);
            });
        }

        /**
         * Remove um registro de atuação do usuário.
         *
         * @param {integer} atuacaoId
         * @param {function} callback
         */
        me.removeAtuacao = function(atuacaoId, callback) {
            me.call('removeAtuacao', {atuacao_id: atuacaoId}, function(response){
                callback(response.success);
            });
        }

        return me;
    }

    angular.module('administracao.usuario').factory('usuario.UsuarioStore', ['$http', 'ui.StoreFactory', UsuarioStore]);

}());

(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/cadastro/views/' + view + '.html';
    }

    var module = angular.module('', ['']);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        /*
            // defina aqui seus states
            $stateProvider.state('modulestate', {
                url: '/modulestate',
                controller: 'Controller',
                templateUrl: getView('view')
            })
        */
    }]);

}());

(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/cadastro/grupoequipamento/views/' + view + '.html';
    }

    var module = angular.module('cadastro.grupoequipamento', []);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {


            // defina aqui seus states
            $stateProvider.state('app.grupoequipamento-list', {
                url: '/grupoequipamento/list',
                //perfil: '|A|T|C|CG|',
                controller: 'grupoequipamento.ListCtrl',
                templateUrl: getView('grupoequipamento.list')
            })
                .state('app.grupoequipamento-create', {
                    url: '/redeprotecao/create',
                    //perfil: '|A|T|C|',
                    controller: 'grupoequipamento.CreateCtrl',
                    templateUrl: getView('grupoequipamento.form')
                })
                .state('app.grupoequipamento-edit', {
                    url: '/grupoequipamento/edit/:id',
                    //perfil: '|A|T|C|',
                    controller: 'grupoequipamento.EditCtrl',
                    templateUrl: getView('grupoequipamento.form')
                })
                .state('app.grupoequipamento-show', {
                    url: '/grupoequipamento/show/:id',
                    //perfil: '|A|T|C|CG|',
                    controller: 'grupoequipamento.ShowCtrl',
                    templateUrl: getView('grupoequipamento.form')
                })


    }]);

}());

(function()
{
    /**
     * Define um novo controlador.
     *
     * @author Marcony Pessotti <marconypessotti@netonsolucoes.com.br>
     */
    var GrupoEquipamentoFormCtrl = function($scope, $state, $modal, SweetAlert, toaster,  GrupoEquipamentoStore)
    {
        $scope.isCreate = true;
        $scope.hasRecord = true;

        $scope.GrupoEquipamentoStore = GrupoEquipamentoStore;
        $scope.GrupoEquipamentoStore.isSubmited = false;

        $scope.grupoequipamento = {};

        $scope.forms = {gerais: {}}


        /**
         * Aciona o método para a criação de um registro de rede de proteção.
         */
        $scope.save = function() {
            toaster.clear();
            $scope.GrupoEquipamentoStore.isSubmited = true;

            if ($scope.forms.grupo.$invalid) {
                toaster.pop('error','Verifique o preenchimento do formulário!');
                return;
            }

            var grupoequipamento = angular.copy($scope.grupoequipamento);

            $scope.GrupoEquipamentoStore.save(grupoequipamento, function(response){
                toaster.clear();
                if (response.success) {
                    toaster.pop('success', 'Inclusão realizada com sucesso!');
                    $state.go('app.grupoequipamento-edit',{id: response.record});
                    return ;
                }
                if(response.success == false){
                    toaster.clear();
                    toaster.pop('error', 'Já existe um Grupo de Equipamentos com este nome.');
                }

                toaster.pop('error', 'Falhou ao tentar incluir o registro!');
            })

        }

    }

    'use strict';
    angular.module('cadastro.grupoequipamento').controller('grupoequipamento.CreateCtrl',['$scope','$state','$modal','SweetAlert','toaster','grupoequipamento.GrupoEquipamentoStore', GrupoEquipamentoFormCtrl]);

}());

(function()
{
    'use strict';

    /**
     * Define um novo controlador.
     *
     * @author Marcony Pessotti <marconypessotti@netonsolucoes.com.br>
     */
    var GrupoEquipamentoFormCtrl = function($scope, $state, $stateParams, $modal, SweetAlert, toaster, GrupoEquipamentoStore)
    {
        $scope.isEdit = true;
        $scope.hasRecord = true;

        $scope.GrupoEquipamentoStore = GrupoEquipamentoStore;

        $scope.forms = {};

        // recupera o registro a ser editado
        $scope.GrupoEquipamentoStore.get($stateParams.id, function(record){
            if (!record) {
                $scope.hasRecord = false;
                return;
            }
            $scope.grupoequipamento = record;
        });

        /**
         * Aciona o método para a criação de um registro de rede de proteção.
         */
        $scope.save = function(){
            toaster.clear();
            $scope.GrupoEquipamentoStore.isSubmited = true;

            if ($scope.forms.gerais.$invalid) {
                toaster.pop('error','Verifique o preenchimento do formulário!');
                return;
            }

            if ($scope.telefones.length == 0) {
                toaster.pop('error', 'Para concluir ação é necessário adicionar pelo menos um telefone')
                return;
            }

            if ($scope.referencias.length == 0) {
                toaster.pop('error', 'Para concluir ação é necessário adicionar pelo menos uma referência');
                return;
            }

            var grupoequipamento = angular.copy($scope.grupoequipamento);

            $scope.GrupoEquipamentoStore.save(grupoequipamento, function(response){
                toaster.clear();
                if (response.success) {
                    toaster.pop('success', 'Alteração realizada com sucesso!');
                    return ;
                }

                toaster.pop('error', 'Falhou ao tentar alterar o registro!');
            })

        }


        // registra evento de destruição de escopo
        $scope.$on('$destroy', function(){
            $scope.GrupoEquipamentoStore.isSubmited = false;
        })


    }


    angular.module('cadastro.grupoequipamento').controller('grupoequipamento.EditCtrl',['$scope','$state','$stateParams','$modal','SweetAlert','toaster','grupoequipamento.GrupoEquipamentoStore', GrupoEquipamentoFormCtrl]);

}());

(function()
{
    'use strict';

    /**
     * Define um novo controlador.
     *
     * @author nome <email>
     */
    var GrupoEquipamentoListCtrl = function($scope, $state, $modal,  $localStorage, SweetAlert,toaster, GrupoEquipamentoStore)
    {
        $scope.GrupoEquipamentoStore = GrupoEquipamentoStore;

        $scope.query = null;

        $scope.hideFilter = $localStorage.grupoequipamentoHideFilter;

        $scope.$watch('hideFilter', function() {
            $localStorage.grupoequipamentoHideFilter = $scope.hideFilter;
        });

        $scope.GrupoEquipamentoStore.load(function(){});

        /* Remove o registro de uma rede de proteção.
         *
         * @param {integer} grupoequipamentoId
         * @param {integer} idx
         */
        $scope.removeGrupoEquipamento = function(grupoequipamentoId, idx) {
            $scope.GrupoEquipamentoStore.remove(grupoequipamentoId, function(success){
                if (success) {
                    $scope.GrupoEquipamentoStore.load({});
                } else {
                    toaster.pop('error','Não é possível excluir o registro informado!');
                }

            });
        }

        $scope.$watch('GrupoEquipamentoStore.sort', $scope.GrupoEquipamentoStore.load, true);

    }

    angular.module('cadastro.grupoequipamento').controller('grupoequipamento.ListCtrl',['$scope','$state', '$modal', '$localStorage','SweetAlert','toaster','grupoequipamento.GrupoEquipamentoStore', GrupoEquipamentoListCtrl]);

}());

(function()
{
    /**
     * Define o serviço do Store de usuário.
     *
     * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
     * @author Marcony Pessotti <marcony@netonsolucoes.com.br>
     */
    var GrupoEquipamentoStore = function($http, StoreFactory)
    {
        var me = StoreFactory.create('cadastro','grupoequipamento');

        /**
         * Perfis de usuário que podem excluir redes de proteção
         * @type {string}
         */
        //me.perfilDelete = '|C|T|A|';

        /**
         * Mapa do filtro de consultas.
         *
         * @type {Object}
         */
        me.filterMap = {
            tipo_id: '=:',
            subtipo_id: '=:',
            uf_id: '=:',
            municipio_id: '=:'
        }

        return me;
    }

    angular.module('cadastro.grupoequipamento').factory('grupoequipamento.GrupoEquipamentoStore', ['$http', 'ui.StoreFactory', GrupoEquipamentoStore]);

}());

(function()
{
    'use strict';

    var getView = function(view){
        return 'src/secure/common/views/' + view + '.html';
    }

    var module = angular.module('ideha.common', []);

    module.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {


    }]);

}());

(function()
{
    /**
     * Define o serviço do webservice de localização de endereço pelo cep.
     *
     * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
     */
    var Cep = function($http, toaster)
    {
        var me = this;

        /**
         * Chama o webservice de localização de endereço para localizar o endereço do cep recebido como parâmetro.
         *
         * @param {integer} cep
         * @param {function} callback
         */
        me.findEndereco = function(cep, callback){
            $http.get("//viacep.com.br/ws/"+ cep +"/json").then(function(response){
                if (response.status == 200){
                    if (!response.data.erro){
                        callback(response.data);
                    } else {
                        toaster.pop('error','Endereço não localizado!');
                        callback({});
                    }

                } else {
                    toaster.pop('error','Não foi possível localizar o endereço pelo CEP informado!');
                }
            })
        }

        return me;
    }

    angular.module('ideha.common').factory('common.Cep', ['$http','toaster',  Cep]);

}());

(function()
{
    /**
     * Define o serviço do Stores estáticos do sistema.
     *
     * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
     * @author Marcony Pessotti <marcony@netonsolucoes.com.br>
     */
    var CommonStore = function($http, StoreFactory)
    {
        var me = this;

        /**
         * Fonte de dados estática de tipo de pessoa.
         *
         * @type {array}
         */
        me.tipoPessoaStore = [
            {id: 'J', value: 'Jurídica'},
            {id: 'F', value: 'Física'}
        ]

        /**
         * Fonte de dados estática de tipo de telefones.
         *
         * @type {array}
         */
        me.tipoTelefoneStore = [
            {id: 'R', value: 'Residencial'},
            {id: 'C', value: 'Celular'},
            {id: 'T', value: 'Trabalho'},
            {id: 'V', value: 'Recado'}
        ]

        /**
         * Fonte de dados estática de status do requerente.
         *
         * @type {array}
         */
        me.statusRequerente = [
            {id: 'T', value: 'Triagem'},
            {id: 'A', value: 'Em analise'},
            {id: 'D', value: 'Desligado e Suspender'}
        ]

        /**
         * Fonte de dados estática de estado civil de um individuo
         * Casado, Divorciado, Separado, Solteiro, União Estável, Viúvo
         *
         * @type {array}
         */
        me.estadoCivilStore = [
            {id: 'C', value: 'Casado'},
            {id: 'A', value: 'Divorciado'},
            {id: 'SE', value: 'Separado'},
            {id: 'SO', value: 'Solteiro'},
            {id: 'UE', value: 'União Estável'},
            {id: 'V', value: 'Viúvo'}
        ]

        /**
         * Fonte de dados estática de orientacao sexual de um individuo
         * selecione, Bissexual, Gay, Heterossexual, Lésbica, Não informado, Nenhuma das alternativas, Outros, Travesti
         *
         * @type {array}
         */
        me.orientacaoSexualStore = [
            {id: 'BI', value: 'Bissexual'},
            {id: 'G', value: 'Gay'},
            {id: 'H', value: 'Heterossexual'},
            {id: 'NI', value: 'Não informado'},
            {id: 'NA', value: 'Nenhuma das alternativas'},
            {id: 'O', value: ' Outros'},
            {id: 'T', value: 'Travesti'}
        ]


        /**
         * Fonte de dados estática de orientacao sexual de um individuo
         * selecione, Homem, Homem Transexual, Mulher, Mulher Transexual, Transexual, Travesti, Outros, Não informado
         *
         * @type {array}
         */
        me.identidadeGeneroStore = [
            {id: 'H', value: 'Homem'},
            {id: 'HT', value: 'Homem Transexual'},
            {id: 'M', value: 'Mulher'},
            {id: 'MT', value: ' Mulher Transexual'},
            {id: 'T', value: 'Transexual'},
            {id: 'TR', value: 'Travesti'},
            {id: 'O', value: ' Outros'},
            {id: 'NI', value: 'Não informado'}
        ]

        /**
         * Fonte de dados estática de cor de um individuo
         * selecione, Branca, Preta, Amarela, Parda
         *
         * @type {array}
         */
        me.corStore = [
            {id: 'B', value: 'Branca'},
            {id: 'P', value: 'Preta'},
            {id: 'A', value: 'Amarela'},
            {id: 'R', value: 'Parda'}
        ]

        /**
         * Fonte de dados estática de escolaridade de um individuo
         * selecione, Ensino fundamental completo, Fundamental incompleto, Ensino médio incompleto, Ensino médio completo, Superior incompleto, Superior completo, Não determinado, Pós-graduação completa, Pós graduação incompleta
         *
         * @type {array}
         */
        me.escolaridadeStore = [
            {id: 'FC', value: 'Ensino fundamental completo'},
            {id: 'FI', value: 'Fundamental incompleto'},
            {id: 'EI', value: 'Ensino médio incompleto'},
            {id: 'EC', value: 'Ensino médio completo'},
            {id: 'SI', value: 'Superior incompleto'},
            {id: 'SC', value: 'Superior completo'},
            {id: 'ND', value: 'Não determinado'},
            {id: 'PC', value: 'Pós-graduação completa'},
            {id: 'PI', value: 'Pós-graduação incompleta'}
        ]

        /**
         * Fonte de dados estática de tipo de identificacao de um individuo
         * selecione, RG, CTPS, CNH, RANI
         *
         * @type {array}
         */
        me.tipoIdentificacaoStore = [
            {id: 'RG', value: 'RG'},
            {id: 'CTPS', value: 'CTPS'},
            {id: 'CNH', value: 'CNH'},
            {id: 'RANI', value: 'RANI'}
        ]

        /**
         * Fonte de dados estática de tipo de deficiencia de um individuo
         * selecione, Deficiência Auditiva, Deficiência Física, Deficiência Intelectual, Deficiência Visual
         *
         * @type {array}
         */
        me.deficienciaStore = [
            {id: 'A', value: 'Deficiência Auditiva'},
            {id: 'F', value: 'Deficiência Física'},
            {id: 'I', value: 'Deficiência Intelectual'},
            {id: 'V', value: 'Deficiência Visual'}
        ]

        /**
         * Fonte de dados estática de tempo de atuação da militancia
         *         Não informado,1 à 6 meses, 6 à 12 meses, 1 à 5 anos, 5 à 10 anos, 10 à 15 anos , + 15 anos
         *
         * @type {array}
         */
        me.tempoAtuacaoStore = [
            {id: '1', value: 'Não informado'},
            {id: '2', value: '1 à 6 meses'},
            {id: '3', value: '6 à 12 meses'},
            {id: '4', value: '1 à 5 anos'},
            {id: '5', value: '5 à 10 anos'},
            {id: '6', value: '10 à 15 anos'},
            {id: '7', value: '+ 15 anos'}
        ]

        /**
         * Fonte de dados estática de tipo de comunidade
         * indígena, rural, quilombola
         *
         * @type {array}
         */
        me.tipoComunidadeStore = [
            {id: 'I', value: 'Indígena'},
            {id: 'R', value: 'Rural'},
            {id: 'Q', value: 'Quilombola'}
        ]

        /**
         * Fonte de dados estática de titulacoes das comunidades
         * Certificação, RTID, Decreto
         *
         * @type {array}
         */
        me.titulacaoStore = [
            {id: 'C', value: 'Certificação'},
            {id: 'R', value: 'RTID'},
            {id: 'D', value: 'Decreto'}
        ]

        /**
         * Fonte de dados estática de data ultima eleição
         *  1 ano, 2 anos, 3 anos, 4 anos, mais de 5 anos
         *
         * @type {array}
         */
        me.dataEleicaoStore = [
            {id: '1', value: '1 ano'},
            {id: '2', value: '2 anos'},
            {id: '3', value: '3 anos'},
            {id: '4', value: '4 anos'},
            {id: '5', value: 'mais de 5 anos'}
        ]


        /* Fonte de dados estática de cagos da diretoria de uma comunidade
         *  Selecione, Diretor, tesoureiro, secretário, presidente, vice precidente, outros , sócio, conselheiro
         *
         * @type {array}
         */
        me.cargoDiretoriaStore = [
            {id: 'D', value: 'Diretor'},
            {id: 'T', value: 'Tesoureiro'},
            {id: 'S', value: 'Secretário'},
            {id: 'P', value: 'Presidente'},
            {id: 'VP', value: 'Vice precidente'},
            {id: 'SO', value: 'Sócio'},
            {id: 'C', value: 'Conselheiro'},
            {id: 'O', value: 'Outros'}
        ]

        /* Fonte de dados estática de formas de abastecimento de agua da comunidade
         *  Poço ou Nascente, cisternas, rede geral de distribuição, outras formas
         *
         * @type {array}
         */
        me.fonteAbastecimentoStore = [
            {id: 'P', value: 'Poço ou Nascente'},
            {id: 'C', value: 'Cisternas'},
            {id: 'R', value: 'Rede geral de distribuição'},
            {id: 'O', value: 'Outras formas'}
        ]

        /* Fonte de dados estática de escoamento sanitario da comunidade
         *  Direto para rio, lago ou mar, Vala a céu aberto, Fossa rudimentar,Fossa séptica, Rede coletora de esgoto pluvial,Outra forma
         *
         * @type {array}
         */
        me.escoamentoSanitarioStore = [
            {id: 'R', value: 'Direto para rio, lago ou mar'},
            {id: 'V', value: 'Vala a céu aberto'},
            {id: 'FR', value: 'Fossa rudimentar'},
            {id: 'FS', value: 'Fossa séptica'},
            {id: 'RC', value: 'Rede coletora de esgoto pluvial'},
            {id: 'O', value: 'Outra forma'}
        ]

        /* Fonte de dados estática de coleta de lixo da comunidade
         *  Selecione, Sim, sem coleta seletiva, Sim, com coleta seletiva, Não há coleta
         *
         * @type {array}
         */
        me.coletaLixoStore = [
            {id: 'SS', value: 'Sim, sem coleta seletiva'},
            {id: 'SC', value: 'Sim, com coleta seletiva'},
            {id: 'N', value: 'Não há coleta'}
        ]


        /* Fonte de dados estática de meio de comunicação da comunidade
         *  Selecione, Carta, Telefone publico, telefone residencial, telefone celular, internet, não há dados
         *
         * @type {array}
         */
        me.principalMeioComunicacaoStore = [
            {id: 'C', value: 'Carta'},
            {id: 'TP', value: 'Telefone publico'},
            {id: 'TR', value: 'Telefone residencial'},
            {id: 'TC', value: 'Telefone celular'},
            {id: 'I', value: 'Internet'},
            {id: 'N', value: 'Não há dados'}
        ]

        /* Fonte de dados estática da frequencia do programa saude familia
         *  Selecione, 3 vezes por semana, 2 vezes por semana, 1 vez por semana, quinzenalmente, mensalmente, trimestral
         *
         * @type {array}
         */
        me.frequenciaPsfStore = [
            {id: '3', value: '3 vezes por semana'},
            {id: '2', value: '2 vezes por semana'},
            {id: '1', value: '1 vez por semana'},
            {id: 'Q', value: 'quinzenalmente'},
            {id: 'M', value: 'mensalmente'},
            {id: 'T', value: 'trimestral'}
        ]

        /* Fonte de dados estática das competencias
         *  Estadual, Municipal, Nacional
         *
         * @type {array}
         */
        me.CompetenciaStore = [
            {id: 'M', value: 'Municipal'},
            {id: 'E', value: 'Estadual'},
            {id: 'F', value: 'Nacional'}
        ]

        return me;
    }

    angular.module('ideha.common').factory('common.CommonStore', ['$http', 'ui.StoreFactory', CommonStore]);

}());

(function()
{
    /**
     * Define o serviço do Store de perfis de usuário.
     *
     * @author nome <marcony@netonsolucoes.com.br>
     */
    var MunicipioStore = function($http, StoreFactory)
    {
        var me = StoreFactory.create('cadastro','municipio');

        /* Traz a lista de municipios de acirdo com o UFId passado como parametro
         *
         * @param {integer} UfId
         * @param {function} callback
         */
        me.listByUfId = function(UfId, callback) {
            me.call('listByUfId', {uf_id: UfId}, function(response){
                me.results = response.results;
                callback(response);
            });
        }

        return me;
    }

    angular.module('ideha.common').factory('common.MunicipioStore', ['$http', 'ui.StoreFactory', MunicipioStore]);

}());

(function()
{
    /**
     * Define o serviço do Store de perfis de usuário.
     *
     * @author nome <marcony@netonsolucoes.com.br>
     */
    var UfStore = function($http, StoreFactory)
    {
        var service = StoreFactory.create('cadastro','uf');


        return service;
    }

    angular.module('ideha.common').factory('common.UfStore', ['$http', 'ui.StoreFactory', UfStore]);

}());
