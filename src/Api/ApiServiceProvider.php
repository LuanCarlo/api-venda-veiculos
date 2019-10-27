<?php
namespace Api;


use Silex\Application;
use Singular\Provider\PackServiceProvider;

class ApiServiceProvider extends PackServiceProvider
{
    protected $pack = 'api';

    public function boot(Application $app)
    {
        $app['service.map']['acessorioveiculo'] = 'AcessorioVeiculo';
    }
}