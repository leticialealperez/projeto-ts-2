// CAPTURAR AS VARIAVEIS QUE VOU PRECISAR

// TRAZER O USUARIO LOGADO NA APLICAÇÃO - usuarioLogado
let usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || 'null');

document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado) {
        //manda pro login
        return
    }

    carregarRecados();
});


// aqui os modais da aplicação
let modalCadastro = new bootstrap.Modal('#modal-cadastro');
let modalEditar = new bootstrap.Modal('#modal-editar');
let modalApagar = new bootstrap.Modal('#modal-apagar');

// aqui os inputs da aplicação
let inputTitulo = document.getElementById('input-titulo') as HTMLInputElement;
let inputDescricao = document.getElementById('input-descricao') as HTMLTextAreaElement;
let inputTituloEditar = document.getElementById('input-titulo-editar') as HTMLInputElement;
let inputDescricaoEditar = document.getElementById('input-descricao-editar') as HTMLTextAreaElement;
let tabela = document.getElementById('tabela') as HTMLTableElement;


// aqui os botões necessários
let btnSalvar = document.getElementById('btn-salvar') as HTMLButtonElement;
let btnAtualizar = document.getElementById('btn-editar') as HTMLButtonElement;
let btnConfirm = document.getElementById('btn-apagar') as HTMLButtonElement;

// aqui os eventos
btnSalvar.addEventListener('click', salvarRecado);
document.addEventListener('DOMContentLoaded', carregarRecados);

interface Recado {
    codigo: string,
    titulo: string,
    descricao: string
}

function salvarRecado() {

    let listaRecados: Array<Recado> = buscarRecadosNoStorage();

    if (inputTitulo.value === '') {
        inputTitulo.style.borderColor = 'red';
        inputTitulo.style.boxShadow = 'none';
        inputTitulo.focus();
        return
    }

    if (inputDescricao.value === '') {
        inputTitulo.removeAttribute('style');
        inputDescricao.style.borderColor = 'red';
        inputDescricao.style.boxShadow = 'none';
        inputTitulo.focus();
        return
    }

    inputDescricao.removeAttribute('style');

    let maiorIndice = 1;

    if (listaRecados.length > 0) {
        let maior = listaRecados.reduce((valorAtual: Recado, proximo: Recado) => {
            if (valorAtual.codigo > proximo.codigo) {
                return valorAtual
            }

            return proximo
        });

        maiorIndice = Number(maior.codigo) + 1;
    }

    let novoRecado: Recado = {
        codigo: `${maiorIndice}`,
        titulo: inputTitulo.value,
        descricao: inputDescricao.value
    }

    listaRecados.push(novoRecado);
    salvarNoStorage(listaRecados);
    inputDescricao.value = '';
    inputTitulo.value = '';
    modalCadastro.hide();
    mostrarNoHTML(novoRecado);
}

/* AQUI REALIZAR A LÓGICA PARA SALVAR RECADOS DO USUARIO LOGADO*/
function salvarNoStorage(recados: Array<Recado>) {
    // trazer lista de usuarios

    //  buscar na lista comparando o usuario que possuir o login igual ao login do usuarioLogado
    //  e armazenar o indice desse usuario
    //usuarios[indiceUsuarioLogado].recados = recados;
    // mandaria salvar a lista de usuarios


    // setItem - criar
    localStorage.setItem('recados', JSON.stringify(recados));
}

/* AQUI REALIZAR A LÓGICA PARA BUSCAR RECADOS DO USUARIO LOGADO*/
function buscarRecadosNoStorage(): Array<Recado> {
    // trazer lista de usuarios
    // let usuarios: Array<any> = JSON.parse(localStorage.getItem('usuarios') || '[]');

    //  buscar na lista comparando o usuario que possuir o login igual ao login do usuarioLogado
    //  e armazenar os dados desse usuario (find)
    // let dadosUsuario = usuarios.find((usuario) => usuario.login === usuarioLogado.login);

    // return dadosUsuario.recados

    // getItem - buscar
    let listaRecados: Array<Recado> = JSON.parse(localStorage.getItem('recados') || '[]');

    return listaRecados
}

function mostrarNoHTML(recado: Recado) {

    let novaLinha = document.createElement('tr');
    novaLinha.setAttribute('id', recado.codigo);

    let colunaCodigo = document.createElement('td');
    colunaCodigo.innerText = recado.codigo;

    let colunaTitulo = document.createElement('td');
    colunaTitulo.innerText = recado.titulo;

    let colunaDescricao = document.createElement('td');
    colunaDescricao.innerText = recado.descricao;

    let colunaAcoes = document.createElement('td');

    let botaoEditar = document.createElement('button');
    botaoEditar.setAttribute('class', 'btn btn-success me-1');
    botaoEditar.setAttribute('data-bs-toggle', 'modal');
    botaoEditar.setAttribute('data-bs-target', '#modal-editar');
    botaoEditar.addEventListener('click', () => {
        prepararEdicao(recado);
    });
    botaoEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';

    let botaoApagar = document.createElement('button');
    botaoApagar.setAttribute('class', 'btn btn-danger');
    botaoApagar.setAttribute('data-bs-toggle', 'modal');
    botaoApagar.setAttribute('data-bs-target', '#modal-apagar');
    botaoApagar.addEventListener('click', () => {
        apagarRecado(recado.codigo);
    })
    botaoApagar.innerHTML = '<i class="bi bi-trash3"></i>';

    colunaAcoes.appendChild(botaoEditar);
    colunaAcoes.appendChild(botaoApagar);
    novaLinha.appendChild(colunaCodigo);
    novaLinha.appendChild(colunaTitulo);
    novaLinha.appendChild(colunaDescricao);
    novaLinha.appendChild(colunaAcoes);
    tabela.appendChild(novaLinha);
}

function carregarRecados() {
    let listaRecados = buscarRecadosNoStorage();

    for (let recado of listaRecados) {
        mostrarNoHTML(recado);
    }
}

function prepararEdicao(recado: Recado) {
    inputTituloEditar.value = recado.titulo;
    inputDescricaoEditar.value = recado.descricao;

    btnAtualizar.addEventListener('click', () => {

        let recadoAtualizado: Recado = {
            codigo: recado.codigo,
            titulo: inputTituloEditar.value,
            descricao: inputDescricaoEditar.value
        }

        atualizarRecado(recadoAtualizado);
    });
}

function atualizarRecado(recado: Recado) {
    let recados = buscarRecadosNoStorage();

    let indiceRecado = recados.findIndex((registro: Recado) => registro.codigo === recado.codigo);

    recados[indiceRecado] = recado;
    salvarNoStorage(recados);
    modalEditar.hide();
    window.location.reload();
}

function apagarRecado(codigo: string) {
    btnConfirm.addEventListener('click', () => {

        let listaRecados = buscarRecadosNoStorage();
        let indiceRecado = listaRecados.findIndex((registro) => registro.codigo == codigo);
        console.log(indiceRecado);

        listaRecados.splice(indiceRecado, 1);
        salvarNoStorage(listaRecados);
        modalApagar.hide();

        window.location.reload();
    })
}

// let usuarioEncontrado = usuarios.find((usuario) => {
//  usuario.login === inputLogin && usuario.senha === inputSenha
// })

//sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

/* usuario = {
    login: 'teste',
    senha: '',
    recados: []
} */







