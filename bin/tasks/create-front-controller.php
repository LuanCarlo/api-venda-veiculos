<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('create-front-controller')
    ->setDefinition(array(
        new InputArgument("name",InputArgument::REQUIRED),
        new InputArgument("dest",InputArgument::REQUIRED),
        new InputArgument("module", InputArgument::REQUIRED)
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Cria um novo controlador de front-end')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $fs = new Filesystem();

        $name = $input->getArgument("name");
        $dest = strtolower($input->getArgument("dest"));
        $module = strtolower($input->getArgument('module'));


        $destDir = $app['web_dir']."/src/".$dest."/controllers/";

        if ($fs->exists($destDir)){

            $tpl = file_get_contents(__DIR__."/templates/FrontController.tpl");
            $tpl = str_replace('$name', $name, $tpl);
            $tpl = str_replace('$module', $module, $tpl);

            $fs->dumpFile($destDir.$name.".js", $tpl);

            $output->writeln("<info>O controlador ".$input->getArgument("name")." foi criado com sucesso!</info>");


        } else {
            $output->writeln("<error>O diretorio de destino {$input->getArgument('dest')} não existe existe!</error>");
        }
    });
