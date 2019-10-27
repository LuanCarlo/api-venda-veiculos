<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('grant-access')
    ->setDefinition(array(
        new InputArgument("funcao_id",InputArgument::REQUIRED),
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Cadastra no banco todas as permissões para todos os componentes para uma determinada função.')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {

        $funcaoId = $input->getArgument("funcao_id");
        $app['session.service.permissao']->grantAccess($funcaoId);

        $output->writeln("<info>Permissão garantida para todos os componentes!</info>");

    });
