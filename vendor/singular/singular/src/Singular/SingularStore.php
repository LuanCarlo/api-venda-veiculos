<?php

namespace Singular;

use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\Query\QueryBuilder;

/**
 * Classe do store básico da aplicação.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 *
 * @package Singular
 */
class SingularStore extends SingularService
{
    /**
     * Tabela origem do store.
     *
     * @var string
     */
    protected $table;

    /**
     * Campo utilizado como chave da tabela.
     *
     * @var string
     */
    protected $id = 'id';

    /**
     * Campo utilizado para definição do nome da sequence da tabela.
     *
     * @var string
     */
    protected $sequence = null;

    /**
     * Nome da conexão default.
     *
     * @var string
     */
    protected $conn = 'default';

    /**
     * @var \Doctrine\DBAL\Driver\Connection
     */
    protected $db;

    /**
     * @var string
     */
    protected $defaultSelect = 't.*';

    /**
     * @var null
     */
    protected $distinct = null;

    /**
     * @var array
     */
    protected $select = array();

    /**
     * Lista de joins.
     *
     * @var array
     */
    protected $joins = array();

    /**
     * Lista de condições padrão.
     *
     * @var array
     */
    protected $wheres = array();

    /**
     * Lista de groupBy da cláusula sql.
     *
     * @var array
     */
    protected $groupBy = array();

    /**
     * Inicializa o Store.
     *
     * @param Application $app
     */
    public function __construct(Application $app, $pack)
    {
        parent::__construct($app, $pack);

        $this->db = $this->getConnection();
    }

    /**
     * Seta em tempo de execução o nome da tabela a ser utilizada pelo store.
     *
     * @param String $table
     * @param String $conn
     */
    public function setTable($table, $conn = 'default')
    {
        $this->table = $table;
        $this->conn = $conn;
        $this->db = $this->getConnection();
    }

    /**
     * Adiciona condições nas cláusulas where.
     *
     * @param array $list
     */
    public function addClauses($list)
    {
        $this->wheres = array_merge($this->wheres, $list);
    }

    /**
     * Localiza um registro pelo seu id.
     *
     * @param integer $id
     *
     * @return Array
     */
    public function find($id)
    {
        $qb = $this->db->createQueryBuilder();

        $qb->select($this->defaultSelect)
            ->from($this->table, 't')
            ->where('t.'.$this->id." = :id");

        $qb->addSelect($this->select);
        $this->addJoin($qb);
        $this->addWhere($qb);
        $this->addGroupBy($qb);

        return $this->db->fetchAssoc($qb->getSQL(), array(
            'id' => $id
        ));
    }

    /**
     * Localiza o primeiro registro que casa com um conjunto de filtros.
     *
     * @param array $filters
     *
     * @return array
     */
    public function findOneBy($filters)
    {
        $qb = $this->db->createQueryBuilder();

        $qb->select($this->defaultSelect)
            ->from($this->table, 't')
            ->where('1 = 1');

        $qb->addSelect($this->select);
        $this->addJoin($qb);
        $this->addWhere($qb);

        $filters = $this->addFilter($qb, $filters);

        return $this->db->fetchAssoc($qb->getSQL(), $filters);
    }

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

        $qb->addSelect($this->select);
        $this->addJoin($qb);
        $this->addWhere($qb);
        $this->addGroupBy($qb);

        $filters = $this->addFilter($qb, $filters);
        $this->addSort($qb, $sort);

        return $this->paginate($qb, $pageOpts, $filters);
    }

    /**
     * Localiza todos os registros da tabela.
     *
     * @param array $pageOpts
     * @param array $sort
     *
     * @return array
     */
    public function findAll($pageOpts = array(), $sort = array())
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

        $qb->from($this->table,'t')
            ->where('1 = 1');

        $qb->addSelect($this->select);
        $this->addJoin($qb);
        $this->addWhere($qb);
        $this->addGroupBy($qb);

        $this->addSort($qb, $sort);

        return $this->paginate($qb, $pageOpts);
    }

    /**
     * Salva um registro no banco de dados.
     *
     * @param Array $data
     *
     * @return Mixed
     */
    public function save($data)
    {
        if (!isset($data[$this->id])) {
            $data[$this->id] = 0;
        }

        if (0 === $data[$this->id]) {
            unset($data[$this->id]);

            $id = $this->insert($data);
        } else {
            if ($this->find($data[$this->id])) {
                $this->update($data);
            } else {
                $this->insert($data);
            }

            $id = $data[$this->id];
        }

        return $id;
    }

    /**
     * Exclui um registro da tabela.
     *
     * @param Integer $id
     *
     * @return Boolean
     */
    public function remove($id)
    {
        try {
            $this->db->delete($this->table, array(
                $this->id => $id
            ));

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Exclui um registro da tabela por uma condição composta.
     *
     * @param array $filter
     *
     * @return bool
     */
    public function removeBy(array $filter)
    {
        try {
            $this->db->delete($this->table, $filter);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Insere um novo registro na tabela.
     *
     * @param array $data
     *
     * @return Mixed
     */
    protected function insert($data)
    {
        try {

            $this->db->insert($this->table, $this->fromArray($data));

            if ($this->sequence){
                $id = $this->db->lastInsertId($this->sequence);
            } else {
                $id = $this->db->lastInsertId($this->id);
            }

        } catch (\Exception $e) {
            throw $e;
        }

        return $id;
    }

    /**
     * Atualiza um registro na tabela.
     *
     * @param array $data
     * @return mixed
     * @throws \Exception
     */
    protected function update($data)
    {
        try {
            $this->db->update($this->table, $this->fromArray($data), array(
                $this->id => $data[$this->id]
            ));

            $id = $data[$this->id];

        } catch (\Exception $e) {
            throw $e;
        }

        return $id;
    }

    /**
     * Adiciona parâmetros de ordenação ao QueryBuilder.
     *
     * @param QueryBuilder $qb
     * @param array        $sort
     */
    protected function addSort($qb, $sort)
    {
        foreach ($sort as $property => $direction) {
            $qb->addOrderBy($property, $direction);
        }
    }

    /**
     * Pagina o resultado de uma consulta.
     *
     * @param QueryBuilder $qb
     * @param Array        $pageOpts
     * @param Array        $filters
     *
     * @return Array
     */
    protected function paginate($qb, $pageOpts, $filters = array())
    {
        $db = $this->db;

//        $total = count($db->fetchAll($qb->getSQL(), $filters));
        $stmtTotal = $db->executeQuery($qb->getSQL(), $filters);
        $total = $stmtTotal->rowCount();

        if (isset($pageOpts['start'])) {
            $qb->setFirstResult(isset($pageOpts['start']) ? $pageOpts['start'] : 0)->
            setMaxResults(isset($pageOpts['limit']) ? $pageOpts['limit'] : 200);
        }

        $result = $db->fetchAll($qb->getSQL(), $filters);

        return array(
            'total' => $total,
            'results' => $result
        );
    }

    /**
     * Adiciona os filtros ao query builder.
     *
     * @param QueryBuilder $qb
     * @param array $filters
     *
     * @return array
     */
    protected function addFilter($qb, $filters)
    {
        $list = array();

        $sgbd = isset($this->app['dbms']) ? $this->app['dbms'] : 'mysql';

        foreach ($filters as $key => $filter) {
            if (strpos($key, '.') === false){
                $keyAlias = "t.".$key;
            } else {
                $keyAlias = $key;
                $key = str_replace('.','_',$key);
            }

            $params = explode(':',$filter);

            if (count($params) == 1) {
                if (!in_array($filter, array('isnull','isnotnull','in','notin'))){
                    array_unshift($params, 'like');
                }

                if (in_array($filter, array('isnull','isnotnull'))){
                    array_unshift($params, $filter);
                }
            }

            $filter = $params[1];

            switch ($params[0]) {
                case 'like':
                    $list[$key] = "%$filter%";

                    if ($sgbd == 'postgres'){
                        $qb->andWhere($keyAlias.' ilike :'.$key);
                    } else {
                        $qb->andWhere($keyAlias.' like :'.$key);
                    }

                    break;
                case 'in':
                    $qb->andWhere($keyAlias.' IN ('.$filter.')');
                    break;
                case 'notin':
                    $qb->andWhere($keyAlias.' NOT IN ('.$filter.')');
                    break;
                case 'isnull':
                    $qb->andWhere($keyAlias.'  IS NULL');
                    break;
                case 'isnotnull':
                    $qb->andWhere($keyAlias.'  IS NOT NULL');
                    break;
                default:
                    $list[$key] = $filter;
                    $qb->andWhere($keyAlias.' '.$params[0].' :'.$key);
                    break;
            }


        }

        return $list;
    }

    /**
     * Adiciona joins à consulta.
     *
     * @param QueryBuilder $qb
     */
    protected function addJoin($qb)
    {
        foreach ($this->joins as $join) {

            if (!isset($join['type'])) {
                $join['type'] = 'join';
            }

            if ($join['type'] == 'left') {
                $qb->leftJoin('t',$join['table'], $join['alias'], $join['condition']);
            } else {
                $qb->join('t',$join['table'], $join['alias'], $join['condition']);
            }
        }
    }

    /**
     * Adiciona groupby à consulta.
     *
     * @param QueryBuilder $qb
     */
    protected function addGroupBy($qb)
    {
        foreach ($this->groupBy as $group) {
            $qb->addGroupBy($group);
        }
    }

    /**
     * Adiciona cláusulas where padrão nas consultas.
     *
     * @param QueryBuilder $qb
     */
    protected function addWhere($qb)
    {
        $this->addFilter($qb, $this->wheres);
    }

    /**
     * Mapeia os dados recebidos de um array nos campos existentes na tabela.
     *
     * @param Array $source
     *
     * @return Array
     */
    protected function fromArray($source)
    {
        $data = array();
        $columnNames = $this->getColumnNames();

        foreach ($source as $key => $value) {

            if (in_array($key, $columnNames)) {

                if (is_string($value)) {
                    $value = ($value);
                }

                $data[$key] = $value;
            }
        }

        return $data;
    }

    /**
     * Aplica filtro baseado no GridFeature Filter.
     *
     * @param  Array  $filters
     * @return string
     */
    protected function getGridFilter($filters)
    {
        // GridFilters sends filters as an Array if not json encoded
        if (is_array($filters)) {
            $encoded = false;
        } else {
            $encoded = true;
            $filters = json_decode($filters);
        }

        $where = ' 0 = 0 ';
        $qs = '';

        // loop through filters sent by client
        if (is_array($filters)) {
            for ($i=0;$i<count($filters);$i++) {
                $filter = $filters[$i];

                // assign filter data (location depends if encoded or not)
                if ($encoded) {
                    $field = $filter->field;
                    $value = $filter->value;
                    $compare = isset($filter->comparison) ? $filter->comparison : null;
                    $filterType = $filter->type;
                } else {
                    $field = $filter['field'];
                    $value = $filter['value'];
                    $compare = isset($filter['comparison']) ? $filter['comparison'] : null;
                    $filterType = $filter['type'];
                }

                switch ($filterType) {
                    case 'string' : $qs .= " AND ".$field." LIKE '%".$value."%'"; Break;
                    case 'list' :
                        if (strstr($value,',')) {
                            $fi = explode(',',$value);
                            for ($q=0;$q<count($fi);$q++) {
                                $fi[$q] = "'".$fi[$q]."'";
                            }
                            $value = implode(',',$fi);
                            $qs .= " AND ".$field." IN (".$value.")";
                        } else {
                            $qs .= " AND ".$field." = '".$value."'";
                        }
                        Break;
                    case 'boolean' : $qs .= " AND ".$field." = ".($value); Break;
                    case 'numeric' :
                        switch ($compare) {
                            case 'eq' : $qs .= " AND ".$field." = ".$value; Break;
                            case 'lt' : $qs .= " AND ".$field." < ".$value; Break;
                            case 'gt' : $qs .= " AND ".$field." > ".$value; Break;
                        }
                        Break;
                    case 'date' :
                        switch ($compare) {
                            case 'eq' : $qs .= " AND ".$field." = '".date('Y-m-d',strtotime($value))."'"; Break;
                            case 'lt' : $qs .= " AND ".$field." < '".date('Y-m-d',strtotime($value))."'"; Break;
                            case 'gt' : $qs .= " AND ".$field." > '".date('Y-m-d',strtotime($value))."'"; Break;
                        }
                        Break;
                }
            }
            $where .= $qs;
        }

        return $where;
    }

    /**
     * Retorna os nomes das colunas da tabela.
     *
     * @return Array
     *
     * @return Array
     */
    protected function getColumnNames()
    {
        $names = array();
        $columns = $this->db->getSchemaManager()->listTableColumns($this->table);

        if (count($columns) == 0) {
            $schema = $this->schema ?: $this->app['db.schema'];
            $fullTable = $schema.".".$this->table;
            $columns = $this->db->getSchemaManager()->listTableColumns($fullTable);
        }

        foreach ($columns as $column) {
            $names[] = $column->getName();
        }

        return $names;
    }

    /**
     * Recupera a conexão utilizada pelo store.
     *
     * @return Connection
     */
    protected function getConnection()
    {
        if ('default' == $this->conn) {
            return $this->app['db'];
        } else {
            return $this->app['dbs'][$this->conn];
        }
    }
} 