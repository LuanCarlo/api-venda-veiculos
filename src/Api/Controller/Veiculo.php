<?php
namespace Api\Controller;

use Singular\Response\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Singular\SingularController;
use Singular\Crud;
use Singular\Annotation\Controller;
use Singular\Annotation\Route;
use Singular\Annotation\Direct;
use Singular\Annotation\Value;
use Singular\Annotation\Assert;
use Singular\Annotation\Convert;
use Singular\Annotation\After;
use Singular\Annotation\Before;

/**
 * Classe Veiculo
 *
 * @Controller
 *
 * @package Api\Controller;
 */
class Veiculo extends SingularController
{
    use Crud;

    /**
     * Defina o store padrão do controlador.
     *
     * @var $store
     */
    protected $store = 'veiculo';

    /**
     * Função responsável por retornar a listagem de veiculos.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function load(Request $request)
    {
        $app = $this->app;
        $store = $this->getStore();

        $filters = $request->get('filter', $this->getBaseFilters());
        $paging = $request->get('paging', $this->paging);
        $sort = $request->get('sort', $this->sort);

        //busca o veiculo de acordo com o filtro
        $data = $store->findBy($filters, $paging, $sort);
        $data['success'] = true;

        return $app->json($data);
    }

    /**
     * Função responsável por retornar um único registro.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function get(Request $request)
    {
        $app = $this->app;

        // @var Store
        $store = $this->getStore();

        $veiculo = $store->find($request->get('id'));

        $acessorios = $app['api.store.acessorioveiculo']->findBy(['veiculo_id' => '=:'.$veiculo['id']]);
        $veiculo['acessorios'] = $acessorios['results'];

        return $app->json(array(
            'success' => true,
            'result' => $veiculo
        ));
    }

    /**
     * Salva novo registro de veiculo.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function save(Request $request)
    {
        $app = $this->app;

        $store = $this->getStore();

        return $app->json(array(
            'success' => true,
            'record' => $store->save($request->request->all())
        ));
    }


    /**
     * Editar um registro de veiculo.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function edit(Request $request)
    {
        $app = $this->app;

        $store = $this->getStore();

        return $app->json(array(
            'success' => true,
            'record' => $store->save($request->request->all())
        ));
    }

    /**
     * Remove um veiculo.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function delete(Request $request)
    {
        $app = $this->app;

        $store = $this->getStore();
        $id = $request->get('id');

        $success = true;

        if (!$store->remove($id)){
            $success = false;
        }

        return $app->json(array(
            'success' => $success
        ));
    }

}