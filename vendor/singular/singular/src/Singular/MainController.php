<?php

namespace Singular;

/**
 * Class MainController.
 *
 * Controlador principal de uma aplicação singular.
 *
 * @package Singular
 *
 * @author Otávio Fernandes <otavio@neton.com.br>
 */
class MainController
{
    /**
     * Referência à aplicação Singular.
     *
     * @var Application
     */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;

        $this->defineRoutes();
    }

    /**
     * Define rotas básicas utilizadas e disponibilizadas pela aplicação principal.
     */
    private function defineRoutes()
    {
        $app = $this->app;

        /**
         * Rota que instala os componentes do singular na aplicação.
         *
         * @param Boolean $override se os arquivos de views devem ser sobrescritos
         */
        $app->get('singular/install/{override}', function($override) use ($app) {
            $app['singular.installer']->install((boolean)$override);
            return "Singular instalado";
        })->value('override', false);

    }
}