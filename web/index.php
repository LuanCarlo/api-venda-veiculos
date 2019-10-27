<?php

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Debug\ErrorHandler;


ErrorHandler::register();


date_default_timezone_set ('America/Sao_Paulo');

$fs = new Filesystem();

// se o arquivo não existir
if (!$fs->exists(__DIR__.'/files/tmp/dev.log')) {
    if (!$fs->exists(__DIR__."/files/tmp/")) {
        $fs->mkdir(__DIR__."/files/tmp/");
    }

    $fs->touch(__DIR__."/files/tmp/dev.log");
}


$app = new Singular\Application(array(
    "base_dir"=>__DIR__.'/../',
    "web_dir"=>__DIR__,
    "src_dir" => __DIR__."/src",
    "deploy_dir" => "files",
    "env"=>'prod'
));

$app->get('/log/show', function()use($app){
    echo "<pre>";
    return file_get_contents(__DIR__."/files/tmp/dev.log");
});

$app->get('/log/clear', function(){
    file_put_contents(__DIR__."/files/tmp/dev.log","");

    return "OK";
});

$app->get('/info', function(){
    phpinfo();
});

$app->get('/clear/deploy', function() use ($app, $fs){
    $finder = new Finder();

    $finder->files()->in($app['deploy_dir']);

    $response = "";

    foreach ($finder as $file) {
        $response .= "Removido: ".$file->getRealpath().PHP_EOL;
        $fs->remove($file->getRealpath());
    }

    echo "<pre>";
    return $response;

});

$app->run();
