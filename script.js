let cuidadoras = JSON.parse(localStorage.getItem("cuidadoras")) || [];
let atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];

let formCuidadora = document.getElementById("form-cuidadora");
let formAtendimento = document.getElementById("form-atendimento");

let listaCuidadoras = document.getElementById("lista-cuidadoras");
let listaAtendimentos = document.getElementById("lista-atendimentos");

let selectCuidadora = document.getElementById("cuidadora-atendimento");
let botaoFiltrar = document.getElementById("botao-filtrar");
let botaoLimpar = document.getElementById("botao-limpar");

let botaoImprimirRelatorio = document.getElementById("botao-imprimir-relatorio");
formCuidadora.addEventListener("submit", function (evento) {
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

    salvarDados();

    formCuidadora.reset();
    mostrarCuidadoras();
    atualizarSelectCuidadoras();
    atualizarResumo();
});

botaoImprimirRelatorio.addEventListener("click", function () {
    imprimirRelatorio();
});

formAtendimento.addEventListener("submit", function (evento) {
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

    salvarDados();

    formAtendimento.reset();
    mostrarAtendimentos(atendimentos);
    atualizarResumo();
});

botaoFiltrar.addEventListener("click", function () {
    let dataInicial = document.getElementById("filtro-data-inicial").value;
    let dataFinal = document.getElementById("filtro-data-final").value;

    if (dataInicial === "" && dataFinal === "") {
        mostrarAtendimentos(atendimentos);
        return;
    }

    if (dataInicial !== "" && dataFinal !== "" && dataInicial > dataFinal) {
        alert("A data inicial não pode ser maior que a data final.");
        return;
    }

    let listaFiltrada = [];

    for (let i = 0; i < atendimentos.length; i++) {
        let dataAtendimento = atendimentos[i].data;

        if (
            (dataInicial === "" || dataAtendimento >= dataInicial) &&
            (dataFinal === "" || dataAtendimento <= dataFinal)
        ) {
            listaFiltrada.push(atendimentos[i]);
        }
    }

    mostrarAtendimentos(listaFiltrada);
});

botaoLimpar.addEventListener("click", function () {
    document.getElementById("filtro-data-inicial").value = "";
    document.getElementById("filtro-data-final").value = "";
    mostrarAtendimentos(atendimentos);
});

function salvarDados() {
    localStorage.setItem("cuidadoras", JSON.stringify(cuidadoras));
    localStorage.setItem("atendimentos", JSON.stringify(atendimentos));
}
function imprimirRelatorio() {
    if (atendimentos.length === 0) {
        alert("Não existem atendimentos cadastrados para gerar o relatório.");
        return;
    }

    let atendimentosOrdenados = atendimentos.slice();

    atendimentosOrdenados.sort(function (a, b) {
        if (a.data < b.data) {
            return -1;
        }

        if (a.data > b.data) {
            return 1;
        }

        return 0;
    });

    let total = 0;

    for (let i = 0; i < atendimentosOrdenados.length; i++) {
        total = total + atendimentosOrdenados[i].valor;
    }

    let textoAtendimentos = "";

    for (let i = 0; i < atendimentosOrdenados.length; i++) {
        textoAtendimentos = textoAtendimentos +
            "<tr>" +
                "<td>" + atendimentosOrdenados[i].cuidadora + "</td>" +
                "<td>" + arrumarData(atendimentosOrdenados[i].data) + "</td>" +
                "<td>" + atendimentosOrdenados[i].descricao + "</td>" +
                "<td>R$ " + atendimentosOrdenados[i].valor.toFixed(2).replace(".", ",") + "</td>" +
            "</tr>";
    }

    let janela = window.open("", "_blank");

    janela.document.write(
        "<html>" +
        "<head>" +
            "<title>Relatório de Atendimentos</title>" +
            "<style>" +
                "body { font-family: Arial, sans-serif; padding: 20px; }" +
                "h1 { text-align: center; }" +
                "table { width: 100%; border-collapse: collapse; margin-top: 20px; }" +
                "th, td { border: 1px solid #000; padding: 8px; text-align: left; }" +
                "th { background-color: #eeeeee; }" +
                ".resumo { margin-top: 20px; font-weight: bold; }" +
            "</style>" +
        "</head>" +
        "<body>" +
            "<h1>Relatório de Atendimentos</h1>" +

            "<p>Total de cuidadoras cadastradas: " + cuidadoras.length + "</p>" +
            "<p>Total de atendimentos: " + atendimentos.length + "</p>" +

            "<table>" +
                "<tr>" +
                    "<th>Cuidadora</th>" +
                    "<th>Data</th>" +
                    "<th>Serviço</th>" +
                    "<th>Valor</th>" +
                "</tr>" +
                textoAtendimentos +
            "</table>" +

            "<p class='resumo'>Valor total: R$ " + total.toFixed(2).replace(".", ",") + "</p>" +
        "</body>" +
        "</html>"
    );

    janela.document.close();
    janela.print();
}

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
            "<strong>Observação:</strong> " + (cuidadoras[i].observacao || "Sem observação") + "<br><br>" +
            "<button type='button' onclick='deletarCuidadora(" + i + ")'>Deletar cadastro</button>";

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

        let posicaoOriginal = atendimentos.indexOf(lista[i]);

        item.innerHTML =
            "<strong>Cuidadora:</strong> " + lista[i].cuidadora + "<br>" +
            "<strong>Data:</strong> " + arrumarData(lista[i].data) + "<br>" +
            "<strong>Serviço:</strong> " + lista[i].descricao + "<br>" +
            "<strong>Valor:</strong> R$ " + lista[i].valor.toFixed(2).replace(".", ",") + "<br><br>" +
            "<button type='button' onclick='deletarAtendimento(" + posicaoOriginal + ")'>Deletar atendimento</button>";

        listaAtendimentos.appendChild(item);
    }
}

function deletarCuidadora(posicao) {
    let nomeCuidadora = cuidadoras[posicao].nome;

    for (let i = 0; i < atendimentos.length; i++) {
        if (atendimentos[i].cuidadora === nomeCuidadora) {
            alert("Essa cuidadora possui atendimentos registrados. Delete os atendimentos dela antes.");
            return;
        }
    }

    cuidadoras.splice(posicao, 1);

    salvarDados();
    mostrarCuidadoras();
    atualizarSelectCuidadoras();
    atualizarResumo();
}

function deletarAtendimento(posicao) {
    atendimentos.splice(posicao, 1);

    salvarDados();
    mostrarAtendimentos(atendimentos);
    atualizarResumo();
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
atualizarSelectCuidadoras();
atualizarResumo();