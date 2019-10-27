<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('create-front-module')
    ->setDefinition(array(
        new InputArgument("name",InputArgument::REQUIRED),
        new InputArgument("dest", InputArgument::OPTIONAL),
        new InputOption("namespace", null, InputOption::VALUE_OPTIONAL)
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Cria um novo modulo de front-end')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $fs = new Filesystem();

        $name = strtolower($input->getArgument('name'));
        $dest = strtolower($input->getArgument("dest"));
        $namespace = $input->getOption('namespace');

        if ($dest != "") {
            $destDir = $app['web_dir']."/src/".strtolower($dest)."/";
        } else {
            $destDir = $app['web_dir']."/src/";
        }

        $moduleDir = $destDir."/".strtolower($name);

        if (!$fs->exists($moduleDir)) {
            $fs->mkdir($moduleDir);
            $fs->mkdir($moduleDir."/controllers");
            $fs->mkdir($moduleDir."/directives");
            $fs->mkdir($moduleDir."/filters");
            $fs->mkdir($moduleDir."/services");
            $fs->mkdir($moduleDir."/views");

            $tpl = file_get_contents(__DIR__."/templates/FrontModule.tpl");

            $strName = $name;

            if ($namespace != "") {
                $strName = $namespace.".".$name;
            }

            // sobrescreve os parâmetros dinâmicos do template
            $tpl = str_replace('$name', strtolower($strName), $tpl);
            $tpl = str_replace('$dest', "src/".$dest."/".$name, $tpl);

            $fs->dumpFile($moduleDir."/".$name.'.js', $tpl);

            $output->writeln("<info>O modulo ".$input->getArgument("name")." foi criado com sucesso!</info>");


        } else {
            $output->writeln("<error>O modulo {$input->getArgument('name')} ja existe no destino informado!</error>");
        }
    });
