<?php
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ParameterBag;

$app->before(function (Request $request) use ($app) {
    $session = $app['session']->get($app['session.name']);

    if ($session) {
        foreach ($session as $key => $value) {
            $request->request->set("session.".$key, $value);
        }
    }
}, 511);