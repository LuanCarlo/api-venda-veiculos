<?php

namespace Singular;

/**
 * Classe do controlador básico da aplicação.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 *
 * @package Singular
 */
class SingularController extends SingularService
{
    /**
     * Nome do pacote a que o controlador pertence.
     *
     * @var string
     */
    protected $pack = '';

    /**
     * Store default vinculado ao controlador.
     *
     * @var string
     */
    protected $store = '';

    /**
     * Parâmetros de ordenação default.
     *
     * @var array
     */
    protected $sort = array();

    /**
     * Parâmetros de paginação default.
     *
     * @var array
     */
    protected $paging = array(
        'start' => 0,
        'limit' => 200
    );

    /**
     * Inicializa o controlador definindo sua associação com a aplicação e o pacote onde foi criado.
     *
     * @param Application $app
     * @param String      $pack
     */
    public function __construct(Application $app, $pack)
    {
        $this->app = $app;
        $this->pack = $pack;
    }

    /**
     * Recupera o store default associado ao controlador.
     *
     * @return Store
     *
     * @throws \Exception
     */
    protected function getStore()
    {
        if (!$this->store) {
            $this->store = $this->getServiceName();
        }

        $storeService = $this->pack->getPackName().".store.".$this->store;

        if (!$this->app[$storeService]) {
            throw new \Exception("O store ".$storeService." não foi registrado na aplicação!");
        }

        return $this->app[$storeService];
    }

    /**
     * Recupera um serviço específico registrado na aplicação.
     *
     * @param String $service
     *
     * @return Object
     *
     * @throws \Exception
     */
    protected function getService($service)
    {
        if (!isset($this->app[$service])) {
            throw new \Exception("O serviço ".$service." não foi registrado na aplicação!");
        }

        return $this->app[$service];
    }

    /**
     * Retorna o nome do serviço local do controlador.
     *
     * @return string
     */
    protected function getServiceName()
    {
        $reflector = new \ReflectionClass($this);

        return strtolower($reflector->getShortName());
    }

    /**
     * Retorna os filtros básicos do store
     */
    protected function getBaseFilters()
    {
        return array();
    }

    /**
     * Retorna o nome da classe do controlador.
     *
     * @return string
     */
    protected function getClassName()
    {
        $reflector = new \ReflectionClass($this);

        return $reflector->getName();
    }

    /**
     * Retorna o nome direto da classe, sem namespaces.
     *
     * @return string
     */
    protected function getShortName()
    {
        $reflector = new \ReflectionClass($this);

        return $reflector->getShortName();
    }
} 