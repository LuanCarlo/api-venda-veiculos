<?php

namespace Singular;

/**
 * Classe do serviço básico da aplicação.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 *
 * @package Singular
 */
class SingularService
{
    /**
     * Nome do pacote a que o serviço pertence.
     *
     * @var string
     */
    protected $pack = '';

    /**
     * Inicializa o serviço com a referência à aplicação.
     *
     * @param Application $app
     * @param String      $pack
     */
    public function __construct(Application $app, $pack)
    {
        $this->app = $app;
        $this->pack = $pack;
    }
} 