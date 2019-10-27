<?php

namespace Singular\Service;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class Installer.
 *
 * Classe responsável pela instalação do Singular na aplicação.
 *
 * @package Singular\Service
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 */
class Installer
{
    /**
     * Diretório base da aplicação.
     *
     * @var $baseDir
     */
    protected $baseDir;

    /**
     * Inicializa o instalador do singular.
     *
     * @param String $baseDir
     */
    public function __construct($baseDir)
    {
        $this->baseDir = $baseDir;
    }

    /**
     * Instala a aplicação Singular.
     *
     * @param Boolean $override
     */
    public function install($override)
    {
        // cria a inicializa os diretórios
        $this->createDirectories();
    }

    private function createDirectories()
    {
        $fs = new Filesystem();

        if (!$fs->exists($this->baseDir."/web")) {
            $fs->mkdir($this->baseDir."/web");
            $fs->mkdir($this->baseDir."/web/src");
            $fs->mkdir($this->baseDir."/web/assets");
            $fs->mkdir($this->baseDir."/web/assets/styles");
            $fs->mkdir($this->baseDir."/web/assets/vendor");
            $fs->mkdir($this->baseDir."/web/assets/fonts");
        }

        if (!$fs->exists($this->baseDir."/src")) {
            $fs->mkdir($this->baseDir."/src");
        }


    }

    /**
     * Copia os ativos da interface de usuário para o diretório público da aplicação.
     *
     * @param Boolean $override
     * @todo Tornar o diretório web configurável
     */
    private function installAssets($override)
    {
        $fs = new Filesystem();

        $fs->mirror(__DIR__."/../Resources/public/", $this->baseDir."/web/singular-ui/");

        $fs->copy(__DIR__."/../Crud/tpl/app.tpl.js", $this->baseDir."/web/src/app.js", $override);
    }

    /**
     * Copia as views do singular para o diretório de views da aplicação.
     *
     * @param Boolean $override
     *
     * @todo Tornar o diretório de views configurável.
     */
    private function installViews($override)
    {
        $fs = new Filesystem();

        $fs->mirror(__DIR__."/../Resources/views/", $this->baseDir."/views/singular", null, array(
                'override' => $override
            ));
    }
}