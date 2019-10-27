<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

$console
    ->register('get-modified-tables-since')
    ->setDefinition(array(
        new InputArgument("dt_inicio_periodo", InputArgument::REQUIRED),
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Retorna a lista de tabelas que foram modificadas desde o período que foi informado como
    parâmetro (período no formato padrão timestamp do MySQL). A consulta é feita na tabela "timestamp_log".')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {

        try {

            $dtInicio = $input->getArgument("dt_inicio_periodo");

            $db = $app['db'];

            // O 2o parâmetro do "fetchAll" define que deve ser retornada a 1a coluna do result set (índice 0).
            $tabelas = $db->query(

                'SELECT nome_tabela, timestamp FROM timestamp_log WHERE timestamp >= \'' . $dtInicio . '\';'

            )->fetchAll(PDO::FETCH_ASSOC);


            $mascaraOutput = "%-30s \t%s";

            foreach ($tabelas as $tabela) {

                $output->writeln('');

                $output->writeln("<fg=blue>" .

                    sprintf($mascaraOutput, $tabela['nome_tabela'], $tabela['timestamp'])

                    . "</>");

                $output->writeln('');
            }

        } catch (\Exception $e) {
            print_r($e->getMessage()); die;
        }

    });
