<?php
namespace Singular;

use Singular\Annotation\Controller;
use Singular\Annotation\Service;
use Singular\Provider\PackServiceProvider;
use \ReflectionClass;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Doctrine\Common\Annotations\AnnotationRegistry;
use Doctrine\Common\Annotations\AnnotationReader;
use Singular\Register\ControllerRegister;
use Singular\Register\ServiceRegister;
//use Doctrine\Common\Annotations\CachedReader;
//use Doctrine\Common\Cache\ApcCache;

/**
 * Classe Register, registra serviços do pacote.
 *
 * @package Neton
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 */
class Register
{
    /**
     * Registra o namespace padrão das anotações.
     *
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        AnnotationRegistry::registerAutoloadNamespace("Singular\Annotation", __DIR__."/../");

        $this->app = $app;
        $this->ctrlRegister = new ControllerRegister($app);
        $this->servRegister = new ServiceRegister($app);
    }

    /**
     * Registra o pacote e seus controladores e serviços.
     *
     * @param PackServiceProvider $pack
     */
    public function register(PackServiceProvider $pack)
    {
        $reflector = new ReflectionClass(get_class($pack));
        $packDir = dirname($reflector->getFileName());
        $ctrlDir = $packDir."/Controller";
        $namespace = $reflector->getNamespaceName();

        $fs = new Filesystem();
        $finder = new Finder();

        if ($fs->exists($ctrlDir)) {
            foreach ($finder->in($ctrlDir)->files() as $file) {

                $className = str_replace(".".$file->getExtension(), '', $file->getRelativePathname());
                $fullClassName = $namespace."\\Controller\\".str_replace("/","\\",$className);

                if (class_exists($fullClassName)) {
                    $this->readAnnotations($fullClassName, $pack);
                }
            }
        }
    }

    /**
     * Registra um serviço.
     *
     * @param string $serviceClassName
     * @param PackServiceProvider $pack
     */
    public function registerService($serviceClassName, $pack)
    {
        $reader = new AnnotationReader();

        $reflectionClass = new \ReflectionClass($serviceClassName);
        $classAnnotations = $reader->getClassAnnotations($reflectionClass);

        foreach ($classAnnotations as $annotation) {
            if ($annotation instanceof Service) {
                $this->servRegister->register($annotation, $reflectionClass, $pack);
            }
        }

    }

    /**
     * Registra um controlador.
     *
     * @param string $controllerClassName
     * @param PackServiceProvider $pack
     */
    public function registerController($controllerClassName, $pack)
    {
        $reader = new AnnotationReader();

        $reflectionClass = new \ReflectionClass($controllerClassName);
        $classAnnotations = $reader->getClassAnnotations($reflectionClass);

        foreach ($classAnnotations as $annotation) {
            if ($annotation instanceof Controller) {
                $this->ctrlRegister->register($annotation, $reflectionClass, $pack);
            }
        }
    }


    /**
     * Extrái as anotações da classe e registra controladores ou serviços.
     *
     * @param string                $class
     * @param PackServiceProvider   $pack
     */
    public function readAnnotations($class, $pack)
    {
        $reader = new AnnotationReader();

        $reflectionClass = new \ReflectionClass($class);
        $classAnnotations = $reader->getClassAnnotations($reflectionClass);

        foreach ($classAnnotations as $annotation) {
            if ($annotation instanceof Controller) {
                $this->ctrlRegister->register($annotation, $reflectionClass, $pack);
            }
        }

    }
} 