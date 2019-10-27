<?php
namespace Api\Store;

use Singular\SingularStore;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Acessorio
 *
 * @Service
 *
 * @package Api\Store;
 */
class Acessorio extends SingularStore
{
    protected $table = 'acessorio';
}