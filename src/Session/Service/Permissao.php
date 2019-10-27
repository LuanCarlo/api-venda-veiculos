<?php
namespace Session\Service;

use Singular\SingularService;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Permissao
 *
 * @Service
 *
 * @package Session\Service;
 */
class Permissao extends SingularService
{
    /**
     * Recupera a relação de menus associada a um determinado usuário.
     *
     * @param integer $usuarioID
     *
     * @return array
     */
    public function getStringAcl($usuarioId)
    {
        $app = $this->app;

        $stringAcl = '';

        $componentes = $app['administracao.store.componente']->listComponentesByUsuarioId($usuarioId);

        foreach ($componentes as $componente) {
            $stringAcl ='|'.$componente['component_key'].'|'.$stringAcl;
        }

//        print_r($stringAcl);die;

        return $stringAcl;
    }


    /**
     * Cadastra no banco todas as permissões para todos os componentes para uma determinada função.
     *
     * @param integer $funcaoId
     */
    public function grantAccess($funcaoId)
    {
        $app = $this->app;


        $app['administracao.store.permissao']->removeBy(array('funcao_id' => $funcaoId));

        $componentes = $app['administracao.store.componente']->findAll();

        foreach ($componentes['results'] as $componente) {

//            print_r($componente);die;

            $data = array();

            $data['componente_id'] = $componente['id'];
            $data['funcao_id'] = $funcaoId;

            $app['administracao.store.permissao']->save($data);

        }

    }



}