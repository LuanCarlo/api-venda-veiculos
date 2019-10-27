<?php
/**
 * Registra o provedor de serviços do monolog.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 */
$app->register(new \Silex\Provider\MonologServiceProvider(),array(
    'monolog.logfile' => $app['base_dir'].'/web/files/tmp/dev.log',
));