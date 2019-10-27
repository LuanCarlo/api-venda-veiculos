<?php
namespace Singular;

use Silex\RedirectableUrlMatcher as BaseRedirectableUrlMatcher;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RequestContext;
use Singular\Register;
use Symfony\Component\Routing\Route;


class RedirectableUrlMatcher extends BaseRedirectableUrlMatcher
{
    /**
     * @var \Singular\Register
     */
    protected $register;

    /**
     * @var array
     */
    protected $packs;

    /**
     * @param RouteCollection $routes
     * @param RequestContext $context
     * @param Register $register
     * @param array $packs
     */
    public function __construct(RouteCollection $routes, RequestContext $context, Register $register, $packs, $map)
    {
        $this->routes = $routes;
        $this->context = $context;
        $this->packs = $packs;
        $this->register = $register;
        $this->map = $map;
    }

    /**
     * {@inheritdoc}
     */
    public function match($pathinfo)
    {
        try {
            $this->allow = array();

            if (!$ret = $this->matchCollection(rawurldecode($pathinfo), $this->routes)) {
                throw 0 < count($this->allow)
                    ? new MethodNotAllowedException(array_unique(array_map('strtoupper', $this->allow)))
                    : new ResourceNotFoundException();
            }

            $parameters =  $ret;

        } catch (ResourceNotFoundException $e) {
            if ('/' === substr($pathinfo, -1) || !in_array($this->context->getMethod(), array('HEAD', 'GET'))) {
                throw $e;
            }

            try {
                parent::match($pathinfo.'/');

                return $this->redirect($pathinfo.'/', null);
            } catch (ResourceNotFoundException $e2) {
                throw $e;
            }
        }

        return $parameters;
    }

    /**
     * {@inheritdoc}
     */
    protected function matchCollection($pathinfo, RouteCollection $routes)
    {
        $this->loadAnnotationRoute($pathinfo);

        return parent::matchCollection($pathinfo, $routes);
    }

    /**
     * Tenta carregar uma rota anotada em um controlador de acordo com o pathinfo.
     *
     * @param $pathinfo
     */
    protected function loadAnnotationRoute($pathinfo)
    {
        @list($empty, $pack, $controller) = explode('/', $pathinfo);

        if (!isset($this->packs[$pack])) {
            return;
        }

        if (isset($this->map[$controller])) {
            $controller = $this->map[$controller];
        }

        $controller = $this->underscoreToCamelCase($controller, true);

        $fullClassName = $this->packs[$pack]->getNameSpace()."\\Controller\\".$controller;

        if (class_exists($fullClassName)) {
            $this->register->registerController($fullClassName, $this->packs[$pack]);
        }
    }

    /**
     * Convert strings with underscores into CamelCase.
     *
     * @param $string
     * @param bool $firstCharCaps
     *
     * @return mixed
     */
    private function underscoreToCamelCase( $string, $firstCharCaps = false)
    {
        if( $firstCharCaps == true ) {
            $string[0] = strtoupper($string[0]);
        }

        $func = create_function('$c', 'return strtoupper($c[1]);');

        return preg_replace_callback('/_([a-z])/', $func, $string);
    }
} 