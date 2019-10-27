<?php
namespace Session\Service;

use Singular\SingularService;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Session
 *
 * @Service
 *
 * @package Session\Service;
 */
class Session extends SingularService
{
    /**
     * Abre a sessão do usuário.
     *
     * @param array $data
     */
    public function open($data)
    {
        $app = $this->app;

        $app['administracao.store.usuario']->save(array(
            'id' => $data['id'],
            'ultimologin' => date('Y-m-d H:i:s')
        ));

        $app['session']->set($app['session.name'], $data);
    }

    /**
     * Verifica se existe uma sessão aberta para o usuário.
     *
     * @return boolean
     */
    public function isOpened()
    {
        $isOpened = false;

        $app = $this->app;

        if ($app['session']->get($app['session.name'])){
            $isOpened = true;
        }

        return $isOpened;
    }

    /**
     * Fecha uma sessão aberta para o usuário.
     *
     */
    public function close()
    {
        $app = $this->app;

        $app['session']->remove($app['session.name']);


        unset($app['session.name']);
        session_destroy();

//        print_r($app['session.name']);die;

        return true;
    }

    /**
     * Injeta o filtro da atuação do usuário.
     *
     * @param Request $request
     */
    public function injectFilterAtuacao(Request $request)
    {
        $app = $this->app;

        $session = $this->app['session']->get($app['session.name']);

        $key = 'uf.id';

        if ($request->attributes->get('_controller') == 'cadastro.controller.uf:find'){
            $key = 't.id';
        }

        $filter = $request->request->get('filter');
        $filter[$key] = "in:".$session['atuacoes'];
        $request->request->set('filter', $filter);
    }
}