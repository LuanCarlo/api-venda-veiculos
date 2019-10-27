<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$console
    ->register('compile-templates')
    ->setDefinition(array(
    ))
    ->setDescription('Gera cache dos arquivos de template')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $sourceDir = __DIR__."/../../web/src";

        $finder = new Finder();

        $compiled = "angular.module('sstcloud.tpls',[]).run(['\$templateCache', function(\$templateCache){";

        foreach ($finder->in($sourceDir)->files()->name('*.html') as $tpl) {
            $tplRef = $tpl->getRelativePathname();

            $file = fopen($tpl->getRealPath(), "r");
            $fileTpl = '';

            while(!feof($file)) {
                $str = trim(fgets($file),"\r\n");
                $str = str_replace("'","\'",$str);
                $str = str_replace('"','\"', $str);
                $fileTpl.= $str;
            }
            fclose($file);

            //if ($tpl->getFilename() == 'homepanel.html'){
                $compiled.= "\n\t\$templateCache.put('src/$tplRef',\"$fileTpl\");\n";
            //}


        }

        $compiled.= "\n}]);";

        file_put_contents($sourceDir."/../tpl/tpls.js", $compiled);

        $output->writeln('Templates gerados com sucesso!');
    });
