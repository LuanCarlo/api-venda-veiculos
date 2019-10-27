<?php
namespace Session\Controller;

use Singular\SingularController;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Controller;
use Singular\Annotation\Route;
use Singular\Annotation\Direct;
use Singular\Annotation\Value;
use Singular\Annotation\Assert;
use Singular\Annotation\Convert;
use Singular\Annotation\After;
use Singular\Annotation\Before;

/**
 * Classe Main
 *
 * @Controller
 *
 * @package Session\Controller;
 */
class Main extends SingularController
{
    /**
     * Exibe a página principal de acesso autenticado do sistema.
     *
     * @Route(method="get", pattern="/secure.app", name="secure")
     *
     * @param Request $request
     */
    public function showSecure(Request $request)
    {
        $app = $this->app;

        // se a sessão não estiver aberta, redireciona para a página de autenticação
        if (!$app['session.service.session']->isOpened()) {
            return $app->redirect($app['url_generator']->generate('auth'));
        }

        // recupera a sessão aberta para o usuário
        $session = $app['session']->get($app['session.name']);

        // recupera o menu liberado para o usuário autenticado
        $menu = $app['session.service.menu']->getMenu($session['USUARIOID']);

        // recupera a string de permissao de usuário
        $acl = $app['session.service.permissao']->getStringAcl($session['USUARIOID']);

        // renderiza a página de acesso protegido do sistema
        return $app['twig']->render("secure.html", array(
            'menu' => json_encode($menu),
            'session' => json_encode($session),
            'acl' => json_encode($acl),
        ));
    }

    /**
     * Exibe a página principal de autenticação da aplicação.
     *
     * @Route(method="get", pattern="/auth.app", name="auth")
     *
     * @param Request $request
     */
    public function showAuth(Request $request)
    {
        $app = $this->app;

        // se já existir uma sessão aberta para o usuário, redireciona para a página protegida
        if ($app['session.service.session']->isOpened()) {
            return $app->redirect($app['url_generator']->generate('secure'));
        }

        // rederiza a página de autenticação
        return $app['twig']->render("auth.html");
    }

    /**
     * Redireciona para a página de autenticação.
     *
     * @Route(method="get", pattern="/")
     *
     * @param Request $request
     */
    public function index(Request $request)
    {
        $app = $this->app;

        // redireciona o acesso para a página de autenticação
        return $app->redirect($app["url_generator"]->generate("auth"));
    }


}