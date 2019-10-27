<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('create-components-and-migration')
    ->setDefinition(array(
        new InputArgument("nome_modulo",InputArgument::REQUIRED),
        new InputArgument("icone",InputArgument::REQUIRED),
        new InputArgument("menu_modulo_id",InputArgument::REQUIRED),
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Cria no banco um componente do tipo módulo contendo os seus componentes básicos, e retorna ' .
    'uma SQL com os statements referentes à criação destes componentes, para criação de uma migration.')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {

        $nomeModulo = $input->getArgument("nome_modulo");
        $icone = $input->getArgument("icone");
        $menuModuloId = $input->getArgument("menu_modulo_id");

        $migrationSQL = $app['administracao.service.componente']->createComponentsAndMigration($nomeModulo, $icone,
        $menuModuloId);

        $output->writeln("<info>Componentes criados.</info>\n");
        $output->writeln("<info>SQL para migration:</info>\n");
        $output->writeln($migrationSQL);
        $output->writeln("");

    });
