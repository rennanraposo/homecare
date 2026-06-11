let cuidadoras = [];
let atendimentos = [];

let formCuidadora = document.getElementById("form-cuidadora");
let formAtendimento = document.getElementById("form-atendimento");

let listaCuidadoras = document.getElementById("lista-cuidadoras");
let listaAtendimentos = document.getElementById("lista-atendimentos");

let selectCuidadora = document.getElementById("cuidadora-atendimento");
let botaoFiltrar = document.getElementById("botao-filtrar");
let botaoLimpar = document.getElementById("botao-limpar");

formCuidadora.addEventListener("submit", function(evento) {
    evento.preventDefault();

    let nome = document.getElementById("nome-cuidadora").value.trim();
    let telefone = document.getElementById("telefone-cuidadora").value.trim();
    let observacao = document.getElementById("observacao-cuidadora").value.trim();

    if (nome === "" || telefone === "") {
        alert("Preencha o nome e o telefone da cuidadora.");
        return;
    }

    let cuidadora = {
        nome: nome,
        telefone: telefone,
        observacao: observacao
    };

    cuidadoras.push(cuidadora);

    formCuidadora.reset();
    mostrarCuidadoras();
    atualizarSelectCuidadoras();
    atualizarResumo();
});

formAtendimento.addEventListener("submit", function(evento) {
    evento.preventDefault();

    let nomeCuidadora = selectCuidadora.value;
    let data = document.getElementById("data-atendimento").value;
    let descricao = document.getElementById("descricao-atendimento").value.trim();
    let valor = Number(document.getElementById("valor-atendimento").value);

    if (nomeCuidadora === "" || data === "" || descricao === "" || valor <= 0) {
        alert("Preencha todos os dados do atendimento corretamente.");
        return;
    }

    let atendimento = {
        cuidadora: nomeCuidadora,
        data: data,
        descricao: descricao,
        valor: valor
    };

    atendimentos.push(atendimento);

    formAtendimento.reset();
    mostrarAtendimentos(atendimentos);
    atualizarResumo();
});

botaoFiltrar.addEventListener("click", function() {
    let dataFiltro = document.getElementById("filtro-data").value;

    if (dataFiltro === "") {
        mostrarAtendimentos(atendimentos);
        return;
    }

    let listaFiltrada = [];

    for (let i = 0; i < atendimentos.length; i++) {
        if (atendimentos[i].data === dataFiltro) {
            listaFiltrada.push(atendimentos[i]);
        }
    }

    mostrarAtendimentos(listaFiltrada);
});

botaoLimpar.addEventListener("click", function() {
    document.getElementById("filtro-data").value = "";
    mostrarAtendimentos(atendimentos);
});

function mostrarCuidadoras() {
    listaCuidadoras.innerHTML = "";

    if (cuidadoras.length === 0) {
        listaCuidadoras.innerHTML = "<li>Nenhuma cuidadora cadastrada.</li>";
        return;
    }

    for (let i = 0; i < cuidadoras.length; i++) {
        let item = document.createElement("li");

        item.innerHTML =
            "<strong>Nome:</strong> " + cuidadoras[i].nome + "<br>" +
            "<strong>Telefone:</strong> " + cuidadoras[i].telefone + "<br>" +
            "<strong>Observação:</strong> " + (cuidadoras[i].observacao || "Sem observação");

        listaCuidadoras.appendChild(item);
    }
}

function atualizarSelectCuidadoras() {
    selectCuidadora.innerHTML = '<option value="">Selecione uma cuidadora</option>';

    for (let i = 0; i < cuidadoras.length; i++) {
        let opcao = document.createElement("option");
        opcao.value = cuidadoras[i].nome;
        opcao.textContent = cuidadoras[i].nome;
        selectCuidadora.appendChild(opcao);
    }
}

function mostrarAtendimentos(lista) {
    listaAtendimentos.innerHTML = "";

    if (lista.length === 0) {
        listaAtendimentos.innerHTML = "<li>Nenhum atendimento registrado.</li>";
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        let item = document.createElement("li");

        item.innerHTML =
            "<strong>Cuidadora:</strong> " + lista[i].cuidadora + "<br>" +
            "<strong>Data:</strong> " + arrumarData(lista[i].data) + "<br>" +
            "<strong>Serviço:</strong> " + lista[i].descricao + "<br>" +
            "<strong>Valor:</strong> R$ " + lista[i].valor.toFixed(2).replace(".", ",");

        listaAtendimentos.appendChild(item);
    }
}

function atualizarResumo() {
    let total = 0;

    for (let i = 0; i < atendimentos.length; i++) {
        total = total + atendimentos[i].valor;
    }

    document.getElementById("total-cuidadoras").textContent = cuidadoras.length;
    document.getElementById("total-atendimentos").textContent = atendimentos.length;
    document.getElementById("valor-total").textContent = total.toFixed(2).replace(".", ",");
}

function arrumarData(data) {
    let partes = data.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

mostrarCuidadoras();
mostrarAtendimentos(atendimentos);
atualizarResumo();
