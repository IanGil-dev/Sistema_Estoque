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

const formTecnico = document.getElementById('form-tecnico');

formTecnico.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nomeFuncionario').value.trim();

  const novoFuncionario = {
    id: Date.now(),
    nome: nome
  };

  funcionarios.push(novoFuncionario);
  salvarFuncionarios();

  formTecnico.reset();
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
renderizarTabelaMateriaisTecnico();
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

// Saída de material para técnico
  if (e.target.classList.contains('btn-saida')) {
    if (tecnicos.length === 0) {
      alert('Cadastre um técnico antes de registrar uma saída.');
      return;
    }

    const nomesTecnicos = tecnicos.map(t => t.nome).join(', ');
    const nomeTecnico = prompt(`Para qual técnico? (${nomesTecnicos})`);
    const tecnico = tecnicos.find(t => t.nome.toLowerCase() === (nomeTecnico || '').toLowerCase());

    if (!tecnico) {
      alert('Técnico não encontrado. Confira o nome digitado.');
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

    materiaisComTecnico.push({
      id: Date.now(),
      produtoId: produto.id,
      produtoNome: produto.nome,
      tecnicoId: tecnico.id,
      tecnicoNome: tecnico.nome,
      quantidade: quantidade,
      serial: serial,
      dataEntrega: new Date().toLocaleString('pt-BR')
    });

    salvarMateriaisComTecnico();
    renderizarTabelaMateriaisTecnico();
  }


  if (e.target.classList.contains('btn-excluir')) {
    const confirmar = confirm(`Tem certeza que deseja excluir "${produto.nome}"?`);
    if (!confirmar) return;
    produtos = produtos.filter(p => p.id !== id);
  }

  salvarProdutos();
  renderizarTabela();
});

 //Renderizar tabela de materiais que estão com técnicos
function renderizarTabelaMateriaisTecnico() {
  const corpo = document.getElementById('corpo-tabela-materiais-tecnico');
  corpo.innerHTML = '';

  materiaisComTecnico.forEach(function (item) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td data-label="Produto">${item.produtoNome}</td>
      <td data-label="Técnico">${item.tecnicoNome}</td>
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
// Renderizar tabela do histórico de uso dos materiais pelos técnicos
function renderizarTabelaHistoricoUso() {
  const corpo = document.getElementById('corpo-tabela-historico-uso');
  corpo.innerHTML = '';

  historicoUso.forEach(function (item) {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td data-label="Técnico">${item.tecnicoNome}</td>
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

document.getElementById('corpo-tabela-materiais-tecnico').addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const item = materiaisComTecnico.find(m => m.id === id);
  if (!item) return;

  // Botão "Registrar Uso" (código que já existia)
  if (e.target.classList.contains('btn-entrada')) {
    const quantidadeUsada = parseInt(prompt(`Quantas unidades de "${item.produtoNome}" foram usadas? (disponível: ${item.quantidade})`));

    if (!(quantidadeUsada > 0)) return;

    if (quantidadeUsada > item.quantidade) {
      alert('Quantidade usada maior que a disponível com o técnico!');
      return;
    }
    const cliente = prompt('Nome do cliente:');
    if (!cliente) {
      alert('É necessário informar o cliente.');
      return;
    }

    historicoUso.push({
      id: Date.now(),
      tecnicoNome: item.tecnicoNome,
      produtoNome: item.produtoNome,
      quantidade: quantidadeUsada,
      serial: item.serial,
      cliente: cliente,
      dataUso: new Date().toLocaleString('pt-BR')
    });

    item.quantidade -= quantidadeUsada;

    if (item.quantidade <= 0) {
      materiaisComTecnico = materiaisComTecnico.filter(m => m.id !== id);
    }

    salvarMateriaisComTecnico();
    salvarHistoricoUso();
    renderizarTabelaMateriaisTecnico();
    renderizarTabelaHistoricoUso();
  }
  // Botão "Excluir" (novo)
  if (e.target.classList.contains('btn-excluir')) {
    const confirmar = confirm('Excluir este registro de material com técnico?');
    if (!confirmar) return;

    materiaisComTecnico = materiaisComTecnico.filter(m => m.id !== id);
    salvarMateriaisComTecnico();
    renderizarTabelaMateriaisTecnico();
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
