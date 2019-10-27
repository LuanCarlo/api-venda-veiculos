<?php
/**
 * Registra o provedor de serviços do monolog.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 */
$app->register(new \Silex\Provider\MonologServiceProvider(),array(
    'monolog.logfile' => __DIR__.'/../../web/files/tmp/dev.log',
));