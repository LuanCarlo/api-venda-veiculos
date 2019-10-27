<?php

use Symfony\Component\Console\Application;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Console\Input\InputInterface;


$console = new Application('Singular Application', 'n/a');

$finder = new Finder();

$tasks = $finder->in(__DIR__."/tasks")->files()->name('*.php');

foreach ($tasks as $file){
    require $file->getRealpath();
}

return $console;