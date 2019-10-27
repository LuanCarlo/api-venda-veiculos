<?php
namespace Singular;

use Silex\Provider\TwigServiceProvider;
use Singular\Provider\PackServiceProvider;
use Silex\Application as SilexApplication;
use Silex\ServiceProviderInterface;
use Singular\Register\ServiceRegister;
use Symfony\Component\Finder\Finder;
use Silex\Provider\ServiceControllerServiceProvider;
use Singular\Response\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpKernel\HttpKernel;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Singular\RedirectableUrlMatcher;


/**
 * Classe principal do Framework.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 */
class Application extends SilexApplication
{
    /**
     * @var array
     */
    protected $packs = array();

    /**
     * Instantiate a new Application.
     *
     * Objects and parameters can be passed as argument to the constructor.
     *
     * @param array $values The parameters or objects.
     */
    public function __construct(array $values = array())
    {
        parent::__construct($values);

        $app = $this;

        $app['monitor.start_time'] = microtime(true);

        if (!isset($app['base_dir'])) {
            throw new \Exception('O diretorio raiz da aplicacao "base_dir" nao foi definido!');
        } elseif (!is_dir($app['base_dir'])) {
            throw new \Exception('O diretorio raiz da aplicacao "base_dir" nao foi encontrado!');
        }

        $app['web_dir'] = $app['base_dir']."/web";

        $this['url_matcher'] = $this->share(function () use ($app) {
            return new RedirectableUrlMatcher($app['routes'], $app['request_context'], $app['pack_register'], $this->packs, $app['service.map']);
        });

        $this['packs'] = $this->share(function() use ($app){
            return new \Pimple();
        });

        $this['service.map'] = $this->share(function() use ($app){
            return new \Pimple();
        });

        $this['pack_register'] = $this->share(function() use ($app) {
            return new Register($app);
        });

        if (!isset($app['env'])) {
            $app['env'] = 'dev';
        }

        $app->before(function (Request $request) {
            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $data = json_decode($request->getContent(), true);
                $request->request->replace(is_array($data) ? $data : array());
            }
        });

        $this->configure();
        $this->autoinclude();
    }

    /**
     * Carrega os provedores de serviço que são dependência da aplicação.
     */
    private function registerDependencies()
    {
        $app = $this;

        $app->register(new ServiceControllerServiceProvider());
        $this->serviceRegister = new ServiceRegister($app);
    }

    /**
     * Inicializa a classe de configuração.
     */
    private function configure()
    {
        $loader = new ConfigLoader($this);

        $loader->loadConfigs();
    }

    /**
     * Inclúi arquivos PHP na pasta da aplicação automaticamente.
     */
    private function autoinclude()
    {
        $app = $this;
        $finder = new Finder();

        $app['app_dir'] = $app['base_dir']."/app";

        if (!is_dir($app['app_dir'])) {
            throw Exception::directoryNotFound('O diretório '.$app['app_dir'].' nao foi encontrado');
        }

        foreach ($finder->in($app['base_dir']."/app")->files()->name('*.php') as $file){
            include_once $file->getRealpath();
        }

    }

    /**
     * Gets a parameter or an object.
     *
     * @param string $id The unique identifier for the parameter or object
     *
     * @return mixed The value of the parameter or an object
     *
     * @throws InvalidArgumentException if the identifier is not defined
     */
    public function offsetGet($id)
    {
        if (!array_key_exists($id, $this->values)) {
            $this->locateService($id);
        }

        return parent::offsetGet($id);
    }

    /**
     * Convert some data into a JSON response.
     *
     * @param mixed   $data    The response data
     * @param integer $status  The response status code
     * @param array   $headers An array of response headers
     *
     * @return JsonResponse
     */
    public function json($data = array(), $status = 200, $headers = array())
    {
        return new JsonResponse($data, $status, $headers);
    }

    /**
     * Registers a service provider.
     *
     * @param ServiceProviderInterface $provider A ServiceProviderInterface instance
     * @param array                    $values   An array of values that customizes the provider
     *
     * @return Application
     */
    public function register(ServiceProviderInterface $provider, array $values = array())
    {
        if ($provider instanceof PackServiceProvider) {
            $this->packs[$provider->getPackName()] = $provider;
        }

        parent::register($provider, $values);

        return $this;
    }

    /**
     * Processo de boot da Aplicação
     */
    public function boot()
    {
        if (!$this->booted) {

            $this->registerDependencies();

            foreach ($this->packs as $pack) {
                $pack->boot($this);
                $pack->connect($this);
            }

            parent::boot();
        }
    }

    /**
     * Tenta localizar um serviço pelo seu id.
     *
     * @param string $id
     */
    private function locateService($id)
    {
        @list($pack, $location, $service) = explode('.', $id);

        if (!isset($this->packs[$pack])) {
            return false;
        }

        if (isset($this['service.map'][$service])) {
            $service = $this['service.map'][$service];
        }

        $serviceClassName = $this->packs[$pack]->getNameSpace()."\\".ucfirst($location)."\\".ucfirst($service);

        $this['pack_register']->registerService($serviceClassName, $this->packs[$pack]);
    }

} 