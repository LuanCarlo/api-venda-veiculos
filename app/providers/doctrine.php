<?php
$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'dbs.options' => array (
        'database' => array(
            'driver'    => 'pdo_mysql',
            'port'      => getenv('DB_PORT') ?:3306,
            'host'      => getenv('DB_HOST') ?:$app["db.host"],
            'dbname'    => getenv('DB_NAME') ?:$app["db.name"],
            'user'      => getenv('DB_USER') ?:$app["db.user"],
            'password'  => getenv('DB_PASS') ?:$app["db.pass"],
            'charset'   => getenv('DB_CHARSET') ?:$app["db.charset"],
        ),
        'sqlite' => array(
            'driver'   => 'pdo_sqlite',
            'path'     => __DIR__.'/../../data/app.db'
        )
    ),
    'dbms' => 'mysql'
));