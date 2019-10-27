<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('create-front-view')
    ->setDefinition(array(
        new InputArgument("view",InputArgument::REQUIRED),
        new InputArgument("dest",InputArgument::REQUIRED),
        new InputOption("title", null, InputOption::VALUE_OPTIONAL)
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Cria uma nova view de front-end')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $fs = new Filesystem();

        $view = $input->getArgument("view");
        $dest = strtolower($input->getArgument("dest"));
        $title = $input->getOption('title');


        $destDir = $app['web_dir']."/src/".$dest."/views/";

        if ($fs->exists($destDir)) {

            $tpl = file_get_contents(__DIR__."/templates/FrontView.tpl");
            $tpl = str_replace('$title', $title, $tpl);

            $fs->dumpFile($destDir.$view.".html", $tpl);

            $output->writeln("<info>A view ".$view." foi criada com sucesso!</info>");

        } else {
            $output->writeln("<error>O diretorio de destino {$input->getArgument('dest')} não existe existe!</error>");
        }
    });
