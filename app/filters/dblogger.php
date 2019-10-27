<?php
use \Symfony\Component\HttpFoundation\Request;

$app->before(function(Request $request) use ($app){
    $app['db.logger'] = $app->share(function(){
        return new Doctrine\DBAL\Logging\DebugStack();
    });

    if ($app['debug']){
        $app['db.config']->setSQLLogger($app['db.logger']);
    }
});

$app->after(function() use ($app) {
    // Log all queries as DEBUG.
    foreach ( $app['db.logger']->queries as $query ) {
        $app['monolog']->debug($query['sql'], array(
            'params' => $query['params'],
            'types' => $query['types']
        ));
    }
});