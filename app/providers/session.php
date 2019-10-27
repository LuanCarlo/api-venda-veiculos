<?php
$app->register(new Silex\Provider\SessionServiceProvider(array(
    'session.storage.save_path' => dirname(__DIR__) . '/../tmp/sessions'
)));