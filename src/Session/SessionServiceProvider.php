<?php
namespace Session;


use Singular\Provider\PackServiceProvider;
use Silex\Application;
use Session\Controller\Main;

class SessionServiceProvider extends PackServiceProvider
{
    protected $pack = 'session';

    /**
     * Registra as rotas de inicialização da aplicação.
     *
     * @param Application $app
     */
    public function connect(Application $app)
    {
        // define o serviço do controlador principal
        $app['session.controller.main'] = $app->share(function() use ($app) {
            return new Main($app, $app['packs'][$this->getPackName()]);
        });

        // define a rota de acesso autenticado da aplicação
        $app->get('/secure.app', 'session.controller.main:showSecure')->bind('secure');

        // define a rota de visualização da interface de registro e autenticação do sistema
        $app->get('/auth.app', 'session.controller.main:showAuth')->bind('auth');

        // define a rota default do sistema
        $app->get('/', 'session.controller.main:index');
    }
}