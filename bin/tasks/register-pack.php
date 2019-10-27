<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('register-pack')
    ->setDefinition(array(
        new InputArgument("name",InputArgument::REQUIRED)
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Registra (ativa) um pacote na aplicação')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $fs = new Filesystem();

        $namespace = $input->getArgument("name");

        $packDir = $app['base_dir']."/src/".ucfirst($namespace)."/";

        if ($fs->exists($packDir)){
            $namespace = str_replace('/','\\',$namespace);

            // pega o nome final do pacote
            $packName = ucfirst(array_pop(explode('\\',$namespace)));

            $tplRegister = file_get_contents(__DIR__."/templates/packregister.tpl");
            $tplRegister = str_replace('$PACK', $namespace."\\".$packName, $tplRegister);

            $fs->dumpFile($app['base_dir']."/app/packs/".strtolower($packName).".php", $tplRegister);

            $output->writeln("<info>O pacote ".$input->getArgument("name")." foi ativado com sucesso!</info>");
        } else {
            $output->writeln("<error>O pacote {$input->getArgument('name')} não existe existe!</error>");
        }
    });
