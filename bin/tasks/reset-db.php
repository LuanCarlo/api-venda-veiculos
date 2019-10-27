<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

date_default_timezone_set ('America/Sao_Paulo');

$console
    ->register('reset-db')
    ->setDefinition(array(
    ))
    ->setDescription('Sincroniza o banco de dados local aplicando as migrations')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $fs = new Filesystem();

        $bancoDir = $app['base_dir']."/banco/";
        $migrationDir = $app['base_dir']."/banco/migrations/";

        if ($fs->exists($migrationDir)) {
            try {
                // conexão
                $dbh = new PDO('mysql:host='.$app['db.host'].';', $app['db.user'], $app['db.pass']);
                $dbh->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
                $dbh->exec('SET CHARACTER SET utf8;');

                // apaga o banco de dados
                $dbh->query('drop database '.$app['db.name'].';');
                $output->writeln("<info>Banco ".$app['db.name']." apagado!</info>");

                // cria o banco de dados
                $dbh->query('CREATE DATABASE '.$app['db.name'].' DEFAULT COLLATE utf8_general_ci;');
                $output->writeln("<info>Banco ".$app['db.name']." criado!</info>");

                $output->writeln("<info>Importando banco...</info>");
                $fs->remove($app['base_dir']."/.dbup/applied");
                $fs->mkdir($app['base_dir']."/.dbup/applied/");
                exec($app["mysql.bin"]." -u ".$app["db.user"]." -p".$app["db.pass"]." ".$app["db.name"]." < ".$bancoDir."create-database.sql");
                $output->writeln("<info>Banco de dados importado!</info>");

                $dbh = null;
            } catch (PDOException $e) {
                print "Error!: " . $e->getMessage() . "<br/>";
                die();
            }




        } else {
            $output->writeln("<error>O diretorio banco/migrations nao existe!</error>");
        }

    });
