<?php
/**
 * Created by PhpStorm.
 * User: oaugustus
 * Date: 25/01/16
 * Time: 15:01
 */
$app->register(new Silex\Provider\SwiftmailerServiceProvider());

$app['swiftmailer.options'] = array(
    'host' => $app['mailer.host'],
    'port' => $app['mailer.port'],
    'username' => $app['mailer.username'],
    'password' => $app['mailer.password'],
    'encryption' => null,//'ssl',
    'auth_mode' => null//'login'
);
