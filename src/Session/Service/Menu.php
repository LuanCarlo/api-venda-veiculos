<?php
namespace Session\Service;

use Singular\SingularService;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Menu
 *
 * @Service
 *
 * @package Session\Service;
 */
class Menu extends SingularService
{
    /**
     * Recupera a relação de menus associada a um determinado usuário.
     *
     * @param integer $usuarioID
     *
     * @return array
     */
    public function getMenu($usuarioId)
    {
        $app = $this->app;

        $menu = array();

        $aplicacoes = $app['session.store.aplicacao']->getApplications($usuarioId);

        foreach ($aplicacoes as $aplicacao) {

            $aplicacao['modules'] = $app['session.store.modulo']->getModulosByAplicacao($usuarioId, $aplicacao['id']);

            if (count($aplicacao['modules']) > 0) {
                $menu[] = $aplicacao;
            }
        }

        return $menu;
    }
}