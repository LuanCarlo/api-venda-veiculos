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
use SendGrid;

/**
 * Classe Session
 *
 * @Controller
 *
 * @package Session\Controller;
 */
class Session extends SingularController
{
    /**
     * Controlador que realiza a autenticação do usuário.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function login(Request $request)
    {
        $app = $this->app;
        $success = false;

        $usuario = $app['administracao.store.usuario']->findOneBy(array(
            'email' => '=:'.$request->get('email'),
            'senha' => '=:'.$app['administracao.store.usuario']->password($request->get('senha'))
        ));

        // usuário não localizado
        if (!$usuario) {
            return $app->json(array(
                'success' => false,
                'code' => '404'
            ));
        }
        unset($usuario['senha']);
        $app['session.service.session']->open($usuario);

        return $app->json(array(
            'success' => true,
            'code' => '200'
        ));

    }

    /**
     * Controlador responsável por efetuar o logout do usuário.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function logout(Request $request)
    {
        $app = $this->app;

        $app['session.service.session']->close();

        return $app->json(array(
            'success' => true
        ));
    }


    /**
     * Controlador que realiza a autenticação do usuário.
     *
     * @Route(method="get")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function isOpened() {

        $app = $this->app;
        return $app['session.service.session']->isOpened();
    }


    /**
     * Retorna a lista de acolhimentos do requerente
     *
     * @Route(method="get")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function sendEmail(Request $request)
    {
        $app = $this->app;
        $data = $request->request->all();
        $app['session.service.mailer']->sendEmail();

        return 'Alertas processados!';

    }
}