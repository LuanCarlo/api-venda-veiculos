<?php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

$console
    ->register('create-pack')
    ->setDefinition(array(
        new InputArgument("name",InputArgument::REQUIRED)
        //new InputOption('some-option', null, InputOption::VALUE_NONE, 'Some help'),
    ))
    ->setDescription('Cria e registra um novo pacote na aplicação')
    ->setCode(function (InputInterface $input, OutputInterface $output) use ($app) {
        $fs = new Filesystem();

        $namespace = $input->getArgument("name");

        $packDir = $app['base_dir']."/src/".ucfirst($namespace)."/";

        if (!$fs->exists($packDir)){
            // cria o diretório do pacote inclusive do namespace
            $fs->mkdir($packDir);
            $fs->mkdir($packDir."/Controller");
            $fs->mkdir($packDir."/Store");
            $fs->mkdir($packDir."/Service");

            $namespace = str_replace('/','\\',$namespace);

            // pega o nome final do pacote
            $packName = ucfirst(array_pop(explode('\\',$namespace)));

            $tpl = file_get_contents(__DIR__."/templates/PackServiceProvider.tpl");

            // sobrescreve os parâmetros dinâmicos do template
            $tpl = str_replace('$NAMESPACE',$namespace, $tpl);
            $tpl = str_replace('$PACK', $packName, $tpl);
            $tpl = str_replace('$name', strtolower($packName), $tpl);

            $fs->dumpFile($packDir.$packName.'ServiceProvider.php', $tpl);

            $tplRegister = file_get_contents(__DIR__."/templates/packregister.tpl");
            $tplRegister = str_replace('$PACK', $namespace."\\".$packName, $tplRegister);

            $fs->dumpFile($app['base_dir']."/app/packs/".strtolower($packName).".php", $tplRegister);

            $output->writeln("<info>O pacote ".$input->getArgument("name")." foi criado e ativado com sucesso!</info>");
        } else {
            $output->writeln("<error>O pacote {$input->getArgument('name')} já existe!</error>");
        }
    });
