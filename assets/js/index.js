const tabela = document.querySelector("#despesas > tbody")
var valorEntrada = 0
var valorSaida = 0

async function atualizarTabela(){
    document.querySelector('tbody').innerHTML = ""
    document.getElementById("entrada").innerText = "R$ 0"
    document.getElementById("saida").innerText = "R$ 0"

    valorEntrada = 0
    valorSaida = 0  


    const data = await buscarFinancas()
    for (let index = 0; index < data.length; index++) {
        criarTr(data[index]["tipo"],data[index]["descricao"],data[index]["valor"],data[index]["id"])
        if(data[index]["tipo"] == true){
            valorEntrada += data[index]["valor"]
            document.getElementById("entrada").innerText = `R$ ${valorEntrada}` 
        }else{
            valorSaida += data[index]["valor"]
            document.getElementById("saida").innerText = `R$ ${valorSaida}` 
        }
    }
    document.getElementById("total").innerText = `R$ ${valorEntrada - valorSaida}` 
    document.getElementById('valor').value = 0
    document.getElementById('descricao').value = ""
}

function criarTr (tipo, descricao, valor, id){
    const tr = document.createElement('tr')
    tr.setAttribute('id',`${id}`)
    tabela.appendChild(tr)

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
        document.getElementById(`tipo-${id}`).addEventListener('click', () => deletarFinanca(id))
    }else{
        const tdTipo = document.createElement('td')
        tdTipo.setAttribute('id',`tipo-${id}`)
        tdTipo.setAttribute('title','1')
        tdTipo.innerHTML = `<i class="fa-sharp fa-solid fa-arrow-down" style="color: red;"></i> <i class="fa-solid fa-trash lixeira" id="lixeira-${id}"></i>`
        tr.appendChild(tdTipo)
        document.getElementById(`tipo-${id}`).addEventListener('click', () => deletarFinanca(id))
    }
}

function removeTr(id){
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

const buscarFinancas = async() => {
    const response = await fetch('https://controlador-de-gastos-git-master-g4rutti.vercel.app/ler');
    const financas = await response.json();
    return financas
}

const verificarTipo = () => {
    if(document.getElementById('tipo').value == "true"){
        return true
    }else{
        return false
    }
}

async function adicionarFinancas() {
    const number = parseInt(document.getElementById('valor').value)
    const desc = document.getElementById('descricao').value
    const type = verificarTipo()
    if(desc == "" || number == "0"){
        alert("Preencha os campos, por favor.")
    }
    else{
        const data = JSON.stringify({ id: Date.now(), tipo: type, descricao: desc, valor: number });
        fetch('https://controlador-de-gastos-git-master-g4rutti.vercel.app/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
    }
    await atualizarTabela()
    await atualizarTabela()
}

async function deletarFinanca(id) {
    try {
      const response = await fetch(`https://controlador-de-gastos-git-master-g4rutti.vercel.app/deletar/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log('Registro deletado:', data);
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
    }
    removeTr(id)
}