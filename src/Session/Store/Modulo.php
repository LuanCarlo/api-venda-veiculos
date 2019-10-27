<?php
namespace Session\Store;

use Singular\SingularStore;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Modulo
 *
 * @Service
 *
 * @package Session\Store;
 */
class Modulo extends SingularStore
{
    protected $table = 'menu_modulo';

    /**
     * Recupera os módulos que um usuário possui privilégio de acesso.
     *
     * @param int $usuarioId
     * @param int $aplicacaoId
     *
     * @return array
     */
    public function getModulosByAplicacao($usuarioId, $aplicacaoId)
    {
        $app = $this->app;

        $qb = $this->db->createQueryBuilder();

        $colaborador = $app['cadastro.store.colaborador']->findOneBy([
            "usuarioid" => $usuarioId
        ]);

        $modulos = array();

        $ocupacao = $app['administracao.store.ocupacao']->getOcupacaoAtiva($colaborador['codcolaborador']);

        if ($ocupacao) {

            $qb->select('t.*')
                ->from($this->table,'t')
                ->where('t.aplicacao_id = '.$aplicacaoId)
                ->andWhere('t.ativo = "1"')
                ->orderBy('t.modulo','ASC');

            $rs = $this->db->fetchAll($qb->getSQL());

//            $registroCargo = $app['cadastro.store.funcao']->find($ocupacao['cargo_id']);


            // Se as permissões do usuário estão vinculadas ao cargo.
//            if ($registroCargo['cargo_permissao'] == '1') {

                /* O id de função a ser passado para a verificação de permissões será o id do cargo, e não o id da
                função "mãe". */
                $idCargoPermissao = $ocupacao['cargo_id'];

//            } else {

                // O id de função a ser passado para a verificação de permissões será o id da função "mãe".
                $idFuncaoPermissao = $ocupacao['funcao_id'];

//            }

            $j = 0;
            foreach ($rs as $modulo) {

                $acesso = $app['administracao.store.permissao']->hasAcessoModulo($idFuncaoPermissao,$idCargoPermissao, $ocupacao['setor_id'], $modulo['id'], $ocupacao['setor_id']);

                if ($acesso){
                    $modulo['modulos'] = $this->getSubModulos($modulo['id']);

                    $modulos[] = $modulo;
                }


            }
        }

        return $modulos;
    }

    /**
     * Recupera a relação de submódulos de um determinado módulo.
     *
     * @param $moduloId
     *
     * @return array
     */
    private function getSubModulos($moduloId)
    {
        $qb = $this->db->createQueryBuilder();

        $qb->select('m.*')
            ->from($this->table,'m')
            ->where('m.modulo_id = '.$moduloId)
            ->andWhere('m.ativo = "1"')
            ->orderBy('m.modulo','ASC');

        $rs = $this->db->fetchAll($qb->getSQL());

        $modulos = array();

        foreach ($rs as $modulo) {
            $modulo['modulos'] = $this->getSubModulos($modulo['id']);
            $modulos[] = $modulo;
        }

        return $modulos;
    }
}