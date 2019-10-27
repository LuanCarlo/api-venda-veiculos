<?php
namespace Session\Store;

use Singular\SingularStore;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Aplicacao
 *
 * @Service
 *
 * @package Session\Store;
 */
class Aplicacao extends SingularStore
{
    protected $table = 'menu_aplicacao';

    /**
     * Recupera as aplicações que o usuário possui acesso.
     *
     * @param int $usuarioId
     *
     * @return array
     */
    public function getApplications($usuarioId)
    {
        $qb = $this->db->createQueryBuilder();

        $qb->select('t.*')
            ->from($this->table,'t')
            ->where('t.ativo = "1"')
            ->orderBy('t.ordem','ASC');

        return $this->db->fetchAll($qb->getSQL());
    }
}