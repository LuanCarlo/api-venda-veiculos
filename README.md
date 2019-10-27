### API  "Venda de Veículos"
 
 Desenvolvida para a utilização em sites e aplicativos para a vendas de veículos como carro, caminhões e motocicletas.
 
 __ __ 
 
  <h3> Introdução </h3>
  
  Esta é uma API Restful criada em PHP, utilizando Singular Framework e Banco de dados MySQL.
  
  __ __ 
  
  <h3> Funcionamento </h3> 
  
  **1.** Rota para listar todos os veículos:<br>
  Adicionar filtros em formato Json,<br>
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
  
  
  **2.** Rota para listar apenas um veículo com mais detalhes:<br>
  Passando o id no formato Json:
  Ex:<br>
  <pre>
  {
        "id" : "1"
  }</pre>
  
  Rota:
  
       http://localhost/api-venda-veiculos/web/api/veiculo/get

  **3.** Rota para criar um novo veículo:<br>
    Passando as informações no formato Json,
    Ex:<br>
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


 **4.** Rota para editar um veículo:<br>
    Passando as informações no formato Json (com adição do login):
    Ex:<br>
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



  **5.** Rota para deletar um veículo:<br>
    Passando o id no formato Json,
    Ex: <br>
    <pre>
    {
          "id" : "1"
    }</pre>
    
  Rota:
  
         http://localhost/api-venda-veiculos/web/api/veiculo/delete

 **6.** Rota para salvar um novo acessório:<br>
    Passando as informações no formato Json,
    Ex:<br>
    <pre>
  {
      "nome": "ABS",
      "descricao": "Freio ABS"
  }</pre>
    Rota:
    
        http://localhost/api-venda-veiculos/web/api/acessorio/save

   **7.** Rota para vincular um acessório a um veículo:<br>
     Passando as informações no formato Json,
      Ex: <br>
      <pre>
    {
        "acessorio_id": "1",
        "veiculo_id": "2"
    }</pre>
      Rota:
      
         http://localhost/api-venda-veiculos/web/api/acessorioveiculo/save

__ __
  
   <h3> Observações </h3>
  
  * Migrations → informações do banco de dados estão na seguinte pasta: banco/migrations
  
 __ __ 
 
 
