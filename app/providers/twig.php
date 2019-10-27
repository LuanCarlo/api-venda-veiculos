<?php
$app->register(new \Silex\Provider\TwigServiceProvider(), array(
    "twig.path" => $app["base_dir"]."/views"
));

$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {
    $twig->addGlobal('injector', $app['injector']);

    return $twig;
}));

$app["twig"] = $app->share($app->extend("twig", function($twig, $app){
    $lexer = new Twig_Lexer($twig, array(
        "tag_variable" => array("[[","]]"),
        'interpolation' => array('#[[', ']]'),
    ));


    $twig->setLexer($lexer);

    return $twig;
}));