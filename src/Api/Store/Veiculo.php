<?php
namespace Api\Store;

use Singular\SingularStore;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Veiculo
 *
 * @Service
 *
 * @package Api\Store;
 */
class Veiculo extends SingularStore
{
    protected $table = 'veiculo';


    /**
     * Localiza os registros que casam com um conjunto de filtros.
     *
     * @param array $filters
     * @param array $pageOpts
     * @param array $sort
     *
     * @return array
     */
    public function findBy($filters, $pageOpts = array(), $sort = array())
    {
        $qb = $this->db->createQueryBuilder();

        if ($this->distinct) {
            $qb->select(' DISTINCT '.$this->distinct);

            if ($this->defaultSelect) {
                $qb->addSelect($this->defaultSelect);
            }
        } else {
            $qb->select('t.*');
        }

        $qb->from($this->table, 't')
            ->where('1 = 1');

        //verifica se tem filtros de datas e alteram a query de acordo com o filtro adicionado
        if(isset($filters['dt_inicio'])) {
            $qb->andWhere('t.ano >= "'.$filters['dt_inicio'].'"');
            unset($filters['dt_inicio']);
        }
        if(isset($filters['dt_fim'])) {
            $qb->andWhere('t.ano < "'.$filters['dt_fim'].'"');
            unset($filters['dt_fim']);
        }

        $qb->addSelect($this->select);
        $this->addJoin($qb);
        $this->addWhere($qb);
        $this->addGroupBy($qb);

        $filters = $this->addFilter($qb, $filters);
        $this->addSort($qb, $sort);

        return $this->paginate($qb, $pageOpts, $filters);
    }

}