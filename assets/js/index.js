const tabelaGastos = document.querySelector("#despesas > tbody")
const tabelaPasta = document.querySelector("#pasta > tbody")
var valorEntrada = 0
var valorSaida = 0
var tipoDado


async function abrirGastos(tipo){
    console.log(tipo)
    document.getElementById("btn-voltar").style.display = "flex"
    document.querySelector("title").innerText = `Pasta - ${tipo}`
    document.querySelector("h1").innerText = `Pasta - ${tipo}`
    document.getElementById("pasta-input").style.display = "none"
    document.getElementById("gastos-input").style.display = "flex"
    document.getElementById("pasta").style.display = "none"
    document.getElementById("despesas").style.display = "table"
    document.getElementById("despesas").style.alignSelf = "center"
    tipoDado = await procurarPeloTipoDado(tipo)
    console.log(tipoDado)
    await atualizarTabelaGastos(tipo)
}
async function abrirPasta(){
    document.getElementById("btn-voltar").style.display = "none"
    document.querySelector("title").innerText = `Controle Financeiro`
    document.querySelector("h1").innerText = `Controle Financeiro`
    document.getElementById("pasta-input").style.display = "flex"
    document.getElementById("gastos-input").style.display = "none"
    document.getElementById("pasta").style.display = "table"
    document.getElementById("despesas").style.display = "none"

    await atualizarTabelaPasta()
}

//Atualizar Tabela
async function atualizarTabelaGastos(tipoDado){
    document.getElementById("entrada").innerText = "R$ 0"
    document.getElementById("saida").innerText = "R$ 0"

    
    const data = await procurarPeloTipoDado(tipoDado)
    console.log(data)
    valorEntrada = 0
    valorSaida = 0  
    tabelaGastos.innerHTML = ""
    for (let index = 0; index < data[0]["gastos"].length; index++) {
        criarTr(data[0]["gastos"][index]["tipo"],data[0]["gastos"][index]["descricao"],data[0]["gastos"][index]["valor"],data[0]["gastos"][index]["idGasto"], data[0]["tipoPasta"])
            if(data[0]["gastos"][index]["tipo"] == true){
                valorEntrada += data[0]["gastos"][index]["valor"]
                document.getElementById("entrada").innerText = `R$ ${valorEntrada}` 
            }else{
                valorSaida += data[0]["gastos"][index]["valor"]
                document.getElementById("saida").innerText = `R$ ${valorSaida}` 
            }
    }
    document.getElementById("total").innerText = `R$ ${valorEntrada - valorSaida}` 
    document.getElementById('valor').value = ""
    document.getElementById('descricao').value = ""
}
async function atualizarTabelaPasta(){
    document.getElementById("entrada").innerText = "R$ 0"
    document.getElementById("saida").innerText = "R$ 0"

    const data = await buscarFinancas()
    valorEntrada = 0
    valorSaida = 0 
    tabelaPasta.innerHTML = ""
    for (let index = 0; index < data.length; index++) {
        criarTrPasta(data[index]["tipoPasta"], data[index]["id"])
        // console.log(data[index]["gastos"][0])
        for(let i = 0; i < data[index]["gastos"].length; i++){
            if(data[index]["gastos"][i]["tipo"] == true){
                valorEntrada += data[index]["gastos"][i]["valor"]
                document.getElementById("entrada").innerText = `R$ ${valorEntrada}` 
            }else{
                valorSaida += data[index]["gastos"][i]["valor"]
                document.getElementById("saida").innerText = `R$ ${valorSaida}` 
            }
        }
    }
    document.getElementById("total").innerText = `R$ ${valorEntrada - valorSaida}` 
    document.getElementById('valor').value = ""
    document.getElementById('descricao').value = ""
}


//Criar Tr
function criarTr(tipo, descricao, valor, id, tipoDado){
    const tr = document.createElement('tr')
    tr.setAttribute('id',`${id}`)
    tabelaGastos.appendChild(tr)

    const tdDesc = document.createElement('td')
    tdDesc.innerText = `${descricao}`
    tr.appendChild(tdDesc)

    const tdValor = document.createElement('td')
    tdValor.innerText = `${valor}`
    tdValor.setAttribute('id',`valor-${id}`)
    tr.appendChild(tdValor)

    if(tipo == true){
        const tdTipo = document.createElement('td')
        tdTipo.setAttribute('id',`tipo-${id}`)
        tdTipo.setAttribute('title','0')
        tdTipo.innerHTML = `<i class="fa-sharp fa-solid fa-arrow-up" style="color: #357360;"></i> <i class="fa-solid fa-trash lixeira" id="lixeira-${id}"></i>`
        tr.appendChild(tdTipo)
        document.getElementById(`tipo-${id}`).addEventListener('click', () => deletarGasto(tipoDado,id))
    }else{
        const tdTipo = document.createElement('td')
        tdTipo.setAttribute('id',`tipo-${id}`)
        tdTipo.setAttribute('title','1')
        tdTipo.innerHTML = `<i class="fa-sharp fa-solid fa-arrow-down" style="color: red;"></i> <i class="fa-solid fa-trash lixeira" id="lixeira-${id}"></i>`
        tr.appendChild(tdTipo)
        document.getElementById(`tipo-${id}`).addEventListener('click', () => deletarGasto(tipoDado,id))
    }
}
function criarTrPasta(tipo, id){
    const tr = document.createElement('tr')
    tr.setAttribute('id',`${id}`)
    tabelaPasta.appendChild(tr)

    const tdDesc = document.createElement('td')
    tdDesc.innerText = `${tipo}`
    tr.appendChild(tdDesc)
    tdDesc.addEventListener('click', () => abrirGastos(tipo))
    console.log(tipo)
    const tdTipo = document.createElement('td')
    tdTipo.setAttribute('id',`tipo-${id}`)
    tdTipo.setAttribute('title','0')
    tdTipo.innerHTML = `<i class="fa-solid fa-trash lixeira" id="lixeira-${id}"></i>`
    tr.appendChild(tdTipo)
    document.getElementById(`tipo-${id}`).addEventListener('click', () => deletarFinanca(id))
}

//Buscas
const buscarFinancas = async() => {
    const response = await fetch('https://controlador-de-gastos-two.vercel.app/ler');
    const financas = await response.json();
    return financas
}
const procurarPeloTipoDado = async(tipoDado) => {
    const response = await fetch(`https://controlador-de-gastos-two.vercel.app/tipoDado/${tipoDado}`);
    const tipo = await response.json();
    return tipo
}


//adiciona
async function adicionarPasta(){
    if(document.getElementById("descricao-pasta").value == ""){
        alert("Preencha os campos, por favor.")
    }else{
        const data = JSON.stringify({ tipoPasta: document.getElementById('descricao-pasta').value});
        fetch('https://controlador-de-gastos-two.vercel.app/criarPasta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        atualizarTabelaPasta()
        atualizarTabelaPasta()
    }
}
    
async function adicionarFinancas() {
    console.log(tipoDado[0]["tipoPasta"])
    const number = parseInt(document.getElementById('valor-gastos').value)
    const desc = document.getElementById('descricao-gastos').value
    const type = verificarTipo()
    if(desc == "" || number == "0"){
        alert("Preencha os campos, por favor.")
    }
    else{
        const data = JSON.stringify({ idGasto: Date.now().toString(), tipo: type, descricao: desc, valor: number });
        fetch(`https://controlador-de-gastos-two.vercel.app/criarGasto/${tipoDado[0]["tipoPasta"]}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: data
          })
    }
    atualizarTabelaGastos(tipoDado[0]["tipoPasta"])
    atualizarTabelaGastos(tipoDado[0]["tipoPasta"])
}


//Remove Tr
async function removeTr(id){
    if(document.getElementById(`tipo-${id}`).title == '0'){
        valorEntrada -= parseInt(document.getElementById(`valor-${id}`).innerHTML)
        document.getElementById("entrada").innerText = `R$ ${valorEntrada}` 
    }
    else{
        valorSaida -= parseInt(document.getElementById(`valor-${id}`).innerHTML)
        document.getElementById("saida").innerText = `R$ ${valorSaida}` 
    }
    document.getElementById("total").innerText = `R$ ${valorEntrada - valorSaida}` 
    document.getElementById(`${id}`).remove()
}
async function removeTrPasta(id){
    document.getElementById(`${id}`).remove()
    await atualizarTabelaPasta()
}


//Remove DB
async function deletarFinanca(id) {
    try {
      const response = await fetch(`https://controlador-de-gastos-two.vercel.app/deletar/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          }
      });
      const data = await response.json();
      console.log('Registro deletado:', data);
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
    }
    removeTrPasta(id)
}
async function deletarGasto(tipo, idGasto) {
    try {
      const response = await fetch(`https://controlador-de-gastos-two.vercel.app/gastos/${tipo}/${idGasto}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Registro deletado com sucesso!');
        console.log(data);
      } else if (data.error) {
        console.error('Erro ao deletar registro:', data.error);
      } else {
        console.error('Erro ao deletar registro:', response.status, response.statusText);
      }
      atualizarTabelaGastos(tipo)
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
    }
} 


//Verifica
const verificarTipo = () => {
    if(document.getElementById('tipo').value == "true"){
        return true
    }else{
        return false
    }
}