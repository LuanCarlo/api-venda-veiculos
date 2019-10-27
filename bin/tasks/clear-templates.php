<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$console
    ->register('clear-templates')
    ->setDefinition(array(
    ))
    ->setDescription('Remove os arquivos de cache de template')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $sourceDir = __DIR__."/../../web/src";

        $finder = new Finder();

        $compiled = "angular.module('sstcloud.tpls',[]).run(['\$templateCache', function(\$templateCache){";

        $compiled.= "\n}]);";

        file_put_contents($sourceDir."/../tpl/tpls.js", $compiled);

        $output->writeln('Templates removidos com sucesso!');
    });
