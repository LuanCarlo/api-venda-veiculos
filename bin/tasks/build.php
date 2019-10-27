<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\DomCrawler\Crawler;

$console
    ->register('build')
    ->setDefinition(array(
        //new InputArgument("url",InputArgument::REQUIRED)
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Gera o build da aplicação')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {

    });
