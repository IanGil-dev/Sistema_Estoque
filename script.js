// Array que vai guardar os produtos em memória
let produtos = [];

// Carrega os produtos salvos no localStorage (se existirem)
function carregarProdutos() {
  const dados = localStorage.getItem('produtos');
  produtos = dados ? JSON.parse(dados) : [];
}
//Função para limpar
document.getElementById('btn-limpar-tudo').addEventListener('click', function () {
  const confirmar = confirm('Isso vai apagar TODOS os dados (produtos, funcionários, materiais e histórico). Tem certeza?');
  if (!confirmar) return;

  localStorage.clear();
  location.reload();
});
// Salva o array de produtos no localStorage
function salvarProdutos() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

//Array que vai guardar os produtos com serial em memória
let seriesTemp = []; // séries digitadas antes de salvar o produto

const checkboxSerial = document.getElementById('temSerial');
const areaSerial = document.getElementById('area-serial');
const inputQuantidade = document.getElementById('quantidade');
const listaSeries = document.getElementById('lista-series');

checkboxSerial.addEventListener('change', () => {
  areaSerial.style.display = checkboxSerial.checked ? 'block' : 'none';
  inputQuantidade.readOnly = checkboxSerial.checked;
  inputQuantidade.value = checkboxSerial.checked ? seriesTemp.length : '';
});

document.getElementById('btn-add-serial').addEventListener('click', () => {
  const campo = document.getElementById('novaSerial');
  const valor = campo.value.trim();
  if (!valor) return;
  if (seriesTemp.includes(valor)) {
    alert('Essa série já foi adicionada.');
    return;
  }
  seriesTemp.push(valor);
  campo.value = '';
  renderizarSeriesTemp();
});

function renderizarSeriesTemp() {
  listaSeries.innerHTML = '';
  seriesTemp.forEach((serial, index) => {
    const li = document.createElement('li');
    li.textContent = serial + ' ';
    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.textContent = 'x';
    btnRemover.onclick = () => {
      seriesTemp.splice(index, 1);
      renderizarSeriesTemp();
    };
    li.appendChild(btnRemover);
    listaSeries.appendChild(li);
  });
  inputQuantidade.value = seriesTemp.length;
}

// Array que vai guardar os funcionários em memória
let funcionarios = [];

function carregarFuncionarios() {
  const dados = localStorage.getItem('funcionarios');
  funcionarios = dados ? JSON.parse(dados) : [];
}

function salvarFuncionarios() {
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}
// Array de histórico de uso dos materiais pelos funcionários
let historicoUso = [];

function carregarHistoricoUso() {
    const dados = localStorage.getItem('historicoUso');
    historicoUso = dados ? JSON.parse(dados) : [];
}

function salvarHistoricoUso() {
    localStorage.setItem('historicoUso', JSON.stringify(historicoUso));
}

const formFuncionario = document.getElementById('form-funcionario');

formFuncionario.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nomeFuncionario').value.trim();

  const novoFuncionario = {
    id: Date.now(),
    nome: nome
  };

  funcionarios.push(novoFuncionario);
  salvarFuncionarios();

  formFuncionario.reset();
  console.log(funcionarios);
});

// Array que guarda os materiais entregues aos funcionários (ainda não usados em clientes)
let materiaisComFuncionario = [];

function carregarMateriaisComFuncionario() {
  const dados = localStorage.getItem('materiaisComFuncionario');
  materiaisComFuncionario = dados ? JSON.parse(dados) : [];
}

function salvarMateriaisComFuncionario() {
  localStorage.setItem('materiaisComFuncionario', JSON.stringify(materiaisComFuncionario));
}


carregarFuncionarios();
carregarMateriaisComFuncionario();
carregarHistoricoUso();
renderizarTabelaMateriaisFuncionario();
renderizarTabelaHistoricoUso();

// Renderiza (desenha) a tabela de produtos na tela
function renderizarTabela() {
  const corpoTabela = document.getElementById('corpo-tabela');
  corpoTabela.innerHTML = '';

  produtos.forEach(function (produto) {
    const linha = document.createElement('tr');

    const estoqueBaixo = produto.quantidade < produto.quantidadeMinima;
    const statusTexto = estoqueBaixo ? '⚠️ Estoque baixo' : '✅ OK';

    linha.innerHTML = `
      <td data-label="Nome">${produto.nome}</td>
      <td data-label="Categoria">${produto.categoria}</td>
      <td data-label="Quantidade" class="${estoqueBaixo ? 'estoque-baixo' : ''}">${produto.quantidade}</td>
      <td data-label="Estoque Mínimo">${produto.quantidadeMinima}</td>
      <td data-label="Status" class="${estoqueBaixo ? 'estoque-baixo' : ''}">${statusTexto}</td>
      <td data-label="Ações">
        <button class="btn-acao btn-entrada" data-id="${produto.id}">+ Entrada</button>
        <button class="btn-acao btn-saida" data-id="${produto.id}">- Saída</button>
        <button class="btn-acao btn-excluir" data-id="${produto.id}">Excluir</button>
      </td>
    `;

    corpoTabela.appendChild(linha);
  });
}

// Pega o formulário
const form = document.getElementById('form-produto');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const quantidadeMinima = parseInt(document.getElementById('quantidadeMinima').value);
  const temSerial = checkboxSerial.checked;

  let quantidade;
  let series = [];

  if (temSerial) {
    if (seriesTemp.length === 0) {
      alert('Adicione pelo menos uma série antes de salvar o produto.');
      return;
    }
    series = [...seriesTemp];
    quantidade = series.length;
  } else {
    quantidade = parseInt(document.getElementById('quantidade').value);
  }

  const novoProduto = {
    id: Date.now(),
    nome: nome,
    categoria: categoria,
    quantidade: quantidade,
    quantidadeMinima: quantidadeMinima,
    temSerial: temSerial,
    series: series
  };

  produtos.push(novoProduto);
  salvarProdutos();
  renderizarTabela();

  seriesTemp = [];
  renderizarSeriesTemp();
  areaSerial.style.display = 'none';
  inputQuantidade.readOnly = false;

  form.reset();
});

// Ao carregar a página, já busca os produtos salvos e desenha a tabela
carregarProdutos();
renderizarTabela();

// Escuta cliques na tabela inteira (delegação de eventos)
document.getElementById('corpo-tabela').addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return; // clicou em algo que não é um botão com data-id

  const produto = produtos.find(p => p.id === id);

  if (e.target.classList.contains('btn-entrada')) {
    const quantidade = parseInt(prompt('Quantas unidades entraram no estoque?'));
    if (quantidade > 0) {
      produto.quantidade += quantidade;
    }
  }

// Saída de material para funcionário
  if (e.target.classList.contains('btn-saida')) {
    if (funcionarios.length === 0) {
      alert('Cadastre um funcionário antes de registrar uma saída.');
      return;
    }

    const nomesFuncionarios = funcionarios.map(f => f.nome).join(', ');
    const nomeFuncionario = prompt(`Para qual funcionário? (${nomesFuncionarios})`);
    const funcionario = funcionarios.find(f => f.nome.toLowerCase() === (nomeFuncionario || '').toLowerCase());

    if (!funcionario) {
      alert('Funcionário não encontrado. Confira o nome digitado.');
      return;
    }

    const quantidade = parseInt(prompt('Quantas unidades foram entregues?'));
    if (!(quantidade > 0)) return;

    if (quantidade > produto.quantidade) {
      alert('Quantidade maior que o estoque disponível!');
      return;
    }

    const serial = prompt('Número de série (deixe em branco se não houver):') || '';

    produto.quantidade -= quantidade;

    materiaisComFuncionario.push({
      id: Date.now(),
      produtoId: produto.id,
      produtoNome: produto.nome,
      funcionarioId: funcionario.id,
      funcionarioNome: funcionario.nome,
      quantidade: quantidade,
      serial: serial,
      dataEntrega: new Date().toLocaleString('pt-BR')
    });

    salvarMateriaisComFuncionario();
    renderizarTabelaMateriaisFuncionario();
  }


  if (e.target.classList.contains('btn-excluir')) {
    const confirmar = confirm(`Tem certeza que deseja excluir "${produto.nome}"?`);
    if (!confirmar) return;
    produtos = produtos.filter(p => p.id !== id);
  }

  salvarProdutos();
  renderizarTabela();
});

 //Renderizar tabela de materiais que estão com funcionários
function renderizarTabelaMateriaisFuncionario() {
  const corpo = document.getElementById('corpo-tabela-materiais-funcionario');
  corpo.innerHTML = '';

  materiaisComFuncionario.forEach(function (item) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td data-label="Produto">${item.produtoNome}</td>
      <td data-label="Funcionário">${item.funcionarioNome}</td>
      <td data-label="Quantidade">${item.quantidade}</td>
      <td data-label="Número de Série">${item.serial || '-'}</td>
      <td data-label="Data de Entrega">${item.dataEntrega}</td>
      <td data-label="Ações">
        <button class="btn-acao btn-entrada" data-id="${item.id}">Registrar Uso</button>
        <button class="btn-acao btn-excluir" data-id="${item.id}" data-tipo="material">Excluir</button>
      </td>
    `;
    corpo.appendChild(linha);
  });
}
// Renderizar tabela do histórico de uso dos materiais pelos funcionários
function renderizarTabelaHistoricoUso() {
  const corpo = document.getElementById('corpo-tabela-historico-uso');
  corpo.innerHTML = '';

  historicoUso.forEach(function (item) {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td data-label="Funcionário">${item.funcionarioNome}</td>
      <td data-label="Produto">${item.produtoNome}</td>
      <td data-label="Quantidade">${item.quantidade}</td>
      <td data-label="Serial">${item.serial || '-'}</td>
      <td data-label="Cliente">${item.cliente}</td>
      <td data-label="Data/Hora">${item.dataUso}</td>
      <td data-label="Ações">
  <button class="btn-acao btn-excluir" data-id="${item.id}" data-tipo="historico">Excluir</button>
</td>
    `;
    corpo.appendChild(linha);
  });
}

document.getElementById('corpo-tabela-materiais-funcionario').addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const item = materiaisComFuncionario.find(m => m.id === id);
  if (!item) return;

  // Botão "Registrar Uso" (código que já existia)
  if (e.target.classList.contains('btn-entrada')) {
    const quantidadeUsada = parseInt(prompt(`Quantas unidades de "${item.produtoNome}" foram usadas? (disponível: ${item.quantidade})`));

    if (!(quantidadeUsada > 0)) return;

    if (quantidadeUsada > item.quantidade) {
      alert('Quantidade usada maior que a disponível com o funcionário!');
      return;
    }
    const cliente = prompt('Nome do cliente:');
    if (!cliente) {
      alert('É necessário informar o cliente.');
      return;
    }

    historicoUso.push({
      id: Date.now(),
      funcionarioNome: item.funcionarioNome,
      produtoNome: item.produtoNome,
      quantidade: quantidadeUsada,
      serial: item.serial,
      cliente: cliente,
      dataUso: new Date().toLocaleString('pt-BR')
    });

    item.quantidade -= quantidadeUsada;

    if (item.quantidade <= 0) {
      materiaisComFuncionario = materiaisComFuncionario.filter(m => m.id !== id);
    }

    salvarMateriaisComFuncionario();
    salvarHistoricoUso();
    renderizarTabelaMateriaisFuncionario();
    renderizarTabelaHistoricoUso();
  }
  // Botão "Excluir" (novo)
  if (e.target.classList.contains('btn-excluir')) {
    const confirmar = confirm('Excluir este registro de material com funcionário?');
    if (!confirmar) return;

    materiaisComFuncionario = materiaisComFuncionario.filter(m => m.id !== id);
    salvarMateriaisComFuncionario();
    renderizarTabelaMateriaisFuncionario();
  }
});
// Escuta cliques na tabela de histórico de uso
document.getElementById('corpo-tabela-historico-uso').addEventListener('click', function (e) {
  if (!e.target.classList.contains('btn-excluir')) return;

  const id = Number(e.target.dataset.id);
  if (!id) return;

  const confirmar = confirm('Excluir este registro do histórico?');
  if (!confirmar) return;

  historicoUso = historicoUso.filter(h => h.id !== id);
  salvarHistoricoUso();
  renderizarTabelaHistoricoUso();
});
