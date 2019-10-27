<?php
namespace Api\Store;

use Singular\SingularStore;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe AcessorioVeiculo
 *
 * @Service
 *
 * @package api\Store;
 */
class AcessorioVeiculo extends SingularStore
{
    protected $table = 'acessorio_veiculo';

    /**
     * Lista de campos a serem trazidos na consulta de select.
     *
     * @var array
     */
    protected $select = array(
        'a.nome, a.descricao'
    );

    /**
     * Outras tabelas a serem vinculadas na consulta.
     *
     * @var array
     */
    protected $joins = array(
        array('table' => 'acessorio', 'alias' => 'a', 'condition' => 'a.id = t.acessorio_id')
    );

}