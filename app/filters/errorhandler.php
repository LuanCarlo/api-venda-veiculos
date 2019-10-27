<?php
use Symfony\Component\HttpFoundation\JsonResponse;

$app->error(function (\Exception $e, $code) use ($app) {

    if (!$app['debug']){
        return new JsonResponse(array(
            'success' => false,
            'error' => $e->getCode(),
            'stacktrace' => $e->getTraceAsString()
        ), 200);
    }
});