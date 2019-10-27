<?php

namespace Singular\Provider;

use Silex\Application;
use Silex\ServiceProviderInterface;
use Silex\ControllerProviderInterface;

/**
 * Classe PackServiceProvider, implementa a estrutura básica de um pacote.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 *
 * @package Singular\Provider
 */
class PackServiceProvider implements ServiceProviderInterface, ControllerProviderInterface
{
    /**
     * @var string
     */
    protected $pack = '';

    /**
     * @param Application $app
     */
    public function register(Application $app)
    {
        $pack = $this->pack;
        $app['packs'][$pack] = $this;
    }

    /**
     * @param Application $app
     */
    public function boot(Application $app){}

    /**
     * @param Application $app
     */
    public function connect(Application $app){}

    /**
     * Retorna o shortname do pacote.
     *
     * @return string
     */
    public function getPackName()
    {
        return $this->pack;
    }

    /**
     * Retorna o namespace do pacote.
     *
     * @return string
     */
    public function getNameSpace()
    {
        $reflection = new \ReflectionClass(get_class($this));

        return $reflection->getNamespaceName();
    }

} 