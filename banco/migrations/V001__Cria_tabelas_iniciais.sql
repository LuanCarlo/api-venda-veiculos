-- MySQL Workbench Synchronization
-- Generated: 2019-26-10
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Luan Carlo

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `veiculo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `marca` varchar(100) NOT NULL COMMENT 'Marca do veiculo',
  `ano` date NOT NULL COMMENT 'Ano do veiculo',
  `modelo` varchar(100) NOT NULL COMMENT 'Modelo do veiculo',
  `cor` varchar(50) NOT NULL COMMENT 'Cor do veiculo',
  `potencia` varchar(3) NOT NULL COMMENT 'Potencia Ex:(1.6)',
  `quilometragem` varchar(100) NOT NULL COMMENT 'Quilometragem do veiculo',
  `cambio` varchar(100) NOT NULL COMMENT 'Cambio do veiculo ex:(manual)',
  `portas` int(4) NOT NULL COMMENT 'Número de portas',
  `placa` varchar(8) NOT NULL,
  `troca` tinyint(1) NOT NULL COMMENT 'Se é passível de troca',
  `preco` decimal(10,2) NOT NULL,
  `tipo` varchar(2) NOT NULL COMMENT 'Tipo de veiculo (C:carro, M: motocicleta, T:caminhao )',
  `particular` tinyint(1) NOT NULL COMMENT 'Se é particular',
  `revenda` tinyint(1) NOT NULL COMMENT 'Se é revenda',
  `seminovo` tinyint(1) NOT NULL COMMENT 'Se é seminovo',
  `0km` tinyint(1) NOT NULL COMMENT 'se é 0 KM',
  `foto_perfil` blob NULL COMMENT 'Foto do perfil do carro',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `cliente`;
CREATE TABLE IF NOT EXISTS `cliente` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro na tabela.',
  `nome` varchar(255) NOT NULL COMMENT 'Nome do cliente',
  `email` varchar(255) NOT NULL COMMENT 'Email do cliente',
  `senha` varchar(255) NOT NULL COMMENT 'Senha do cliente',
  `telefone` varchar(16) NOT NULL COMMENT 'Telefone do cliente',
  `cpf` varchar(14) NOT NULL COMMENT 'CPF do cliente',
  `numero` int(11) NOT NULL COMMENT 'Número do endereço do cliente',
  `rua` varchar(250) NOT NULL COMMENT 'Rua do cliente',
  `bairro` varchar(250) NOT NULL COMMENT 'Bairro do cliente',
  `cidade` varchar(250) NOT NULL COMMENT 'Cidade do cliente',
  `estado` varchar(2) NOT NULL COMMENT 'UF do  cliente',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `acessorio` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro na tabela.',
  `nome` varchar(100) NOT NULL,
  `descricao` text NOT NULL,
  `preco` decimal(10,2) NULL,
   PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `acessorio_veiculo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro na tabela',
  `veiculo_id` INT(11) NOT NULL COMMENT 'Relacionamento com o registro associado na tabela <veiculo> através do campo <id>.',
  `acessorio_id` INT(11) NOT NULL COMMENT 'Relacionamento com o registro associado na tabela <acessorio> através do campo <id>.',
  PRIMARY KEY (`id`),
  INDEX `fk_acessorio_veiculo_veiculo_idx` (`veiculo_id` ASC),
  INDEX `fk_acessorio_veiculo_acessorio_idx` (`acessorio_id` ASC),
  CONSTRAINT `fk_acessorio_veiculo_veiculo`
    FOREIGN KEY (`veiculo_id`)
    REFERENCES `veiculo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_acessorio_veiculo_acessorio`
    FOREIGN KEY (`acessorio_id`)
    REFERENCES `acessorio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `foto_veiculo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro na tabela',
  `veiculo_id` INT(11) NOT NULL COMMENT 'Relacionamento com o registro associado na tabela <veiculo> através do campo <id>.',
  `imagem` blob NULL COMMENT 'Foto do carro',
  PRIMARY KEY (`id`),
  INDEX `fk_foto_veiculo_idx` (`veiculo_id` ASC),
  CONSTRAINT `fk_foto_veiculo`
    FOREIGN KEY (`veiculo_id`)
    REFERENCES `veiculo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=MyISAM DEFAULT CHARSET=latin1;

COMMIT;

INSERT INTO `veiculo` (`id`, `marca`, `ano`, `modelo`, `cor`, `potencia`, `quilometragem`, `cambio`, `portas`, `placa`, `troca`, `preco`, `tipo`, `particular`, `revenda`, `seminovo`, `0km`) VALUES (NULL, 'Fiat', '2017-02-02', 'Palio', 'vermelho', '1.0', '70.000 KM', 'Manual', '4', 'BTN-120', '1', '15000.00', 'C', '1', '0', '1', '0');
INSERT INTO `acessorio` (`id`, `nome`, `decricao`, `preco`) VALUES (NULL, 'ABS', 'Freio ABS', NULL);

SET FOREIGN_KEY_CHECKS=1;
