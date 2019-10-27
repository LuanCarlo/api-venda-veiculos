<?php
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ParameterBag;

$app->after(function (Request $request, Response $response) use ($app) {
    if ($response instanceof JsonResponse ) {
        $content = json_decode($response->getContent(), true);
        $content['monitor.time'] = microtime(true) - $app['monitor.start_time'];
        $response->setContent(json_encode($content));

        if (isset($content['error'])) {
            $response->setStatusCode(200);
        }
    }
});