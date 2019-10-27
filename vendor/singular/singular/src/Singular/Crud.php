<?php

namespace Singular;

use Symfony\Component\HttpFoundation\Request;
use Singular\Response\JsonResponse;

/**
 * Traço da classe CRUD.
 *
 * @author Otávio Fernandes <otavio@netonsolucoes.com.br>
 *
 * @package Singular
 */
trait Crud
{
    /**
     * Função responsável por retornar a listagem de todos os registros de uma tabela.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function all(Request $request)
    {
        $app = $this->app;

        $store = $this->getStore();

        return $app->json(array(
            'success' => true,
            'results' => $store->findAll(array(), $request->get('sort', $this->sort))
        ));
    }

    /**
     * Função responsável por retornar a listagem de registros de uma tabela.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function find(Request $request)
    {
        $app = $this->app;

        $store = $this->getStore();

        $filters = $request->get('filter', $this->getBaseFilters());
        $paging = $request->get('paging', $this->paging);
        $sort = $request->get('sort', $this->sort);

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

        return $app->json(array(
            'success' => true,
            'result' => $store->find($request->get('id'))
        ));
    }

    /**
     * Função responsável por salvar o registro de uma tabela do crud.
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
     * Remove um/vários registros da tabela.
     *
     * @Route(method="post")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function remove(Request $request)
    {
        $app = $this->app;

        $store = $this->getStore();

        $ids = $request->get('ids', array());

        if (count($ids) == 0) {
            $ids[] = $request->get('id');
        }

        $success = true;

        foreach ($ids as $idx => $id) {
            if (!$store->remove($id)){
                $success = false;
            }
        }

        return $app->json(array(
            'success' => $success
        ));
    }

}
