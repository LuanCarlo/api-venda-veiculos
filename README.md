### API  "Venda de Veículos"
 
 Desenvolvida para a utilização em sites e aplicativos para a vendas de veículos, como carro, caminhões e motocicletas.
 
 __ __ 
 
  ###<h3> Introdução </h3>
  
  Esta é uma API Restful criada em PHP, utilizando Singular Framework e Banco de dados MySQL.
  
  __ __ 
  
  ###<h3> Funcionamento </h3> 
  
  Rota para listar todos os veiculos:<br>
  Adicionar filtros em formato Json no formato,<br>
  Ex:<br>
  <pre>
  {
     "filter" :
      		{
      			"marca":"Fiat",
      			"dt_inicio":"2016-01-26",
      			"dt_fim":"2019-01-30"
      		}
  }
  </pre>
   Rota:
  
     http://localhost/api-venda-veiculos/web/api/veiculo/load
  
  
  Rota para listar apenas um veículo com mais detalhes:<br>
  Passando o id no formato Json:
  EX:
  <pre>
  {
        "id" : "1"
  }</pre>
  
  Rota:
  
       http://localhost/api-venda-veiculos/web/api/veiculo/get

  Rota para criar um novo veículo:<br>
    Passando o informações no formato Json:
    EX:
    <pre>
  {
          "marca": "Honda",
          "ano": "2018-01-01",
          "modelo": "City",
          "cor": "Prata",
          "potencia": "1.8",
          "quilometragem": "0 KM",
          "cambio": "Automático",
          "portas": "4",
          "placa": "HID-7570",
          "troca": "0",
          "preco": "85000.00",
          "tipo": "C",
          "particular": "1",
          "revenda": "0",
          "seminovo": "1",
          "0km": "0"
  }
    </pre>
    Rota:
    
         http://localhost/api-venda-veiculos/web/api/veiculo/save


 Rota para editar um veículo:<br>
    Passando o informações no formato Json (com adição do login):
    EX:
    <pre>
  {
          "id" : "2"
          "marca": "Honda",
          "ano": "2018-01-01",
          "modelo": "City",
          "cor": "Prata",
          "potencia": "1.8",
          "quilometragem": "0 KM",
          "cambio": "Automático",
          "portas": "4",
          "placa": "HID-7570",
          "troca": "0",
          "preco": "85000.00",
          "tipo": "C",
          "particular": "1",
          "revenda": "0",
          "seminovo": "1",
          "0km": "0"
  }
    </pre>
    Rota:
    
         http://localhost/api-venda-veiculos/web/api/veiculo/save



  Rota para deletar um veículo:<br>
    Passando o id no formato Json:
    EX:
    <pre>
    {
          "id" : "1"
    }</pre>
    
  Rota:
  
         http://localhost/api-venda-veiculos/web/api/veiculo/delete

 Rota para salvar um novo acessorio:<br>
    Passando o informações no formato Json:
    EX:
    <pre>
  {
      "nome": "ABS",
      "descricao": "Freio ABS"
  }</pre>
    Rota:
    
        http://localhost/api-venda-veiculos/web/api/acessorio/save

   Rota para vincular um acessorio a um veículo:<br>
      Passando o informações no formato Json:
      EX:
      <pre>
    {
        "acessorio_id": "1",
        "veiculo_id": "2"
    }</pre>
      Rota:
      
         http://localhost/api-venda-veiculos/web/api/acessorioveiculo/save

 Migrations (informações do banco de dados estão na seguinte pasta: banco/migrations) 