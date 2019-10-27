<?php
namespace Api\Store;

use Singular\SingularStore;
use Symfony\Component\HttpFoundation\Request;
use Singular\Annotation\Service;
use Singular\Annotation\Parameter;


/**
 * Classe Cliente
 *
 * @Service
 *
 * @package Api\Store;
 */
class Cliente extends SingularStore
{
    protected $table = 'cliente';
}