# 📦 Sistema de Estoque

Sistema de controle de estoque para equipes de campo, com cadastro de produtos, números de série individuais, entrega de materiais a funcionários e registro de uso em clientes.

🔗 *Acesse online:* [iangil-dev.github.io/Sistema_Estoque](https://iangil-dev.github.io/Sistema_Estoque/)

## Funcionalidades

- *Cadastro de produtos* — nome, categoria, quantidade e estoque mínimo
- *Produtos com número de série* — opção de marcar um produto como equipamento serializado, registrando a série de cada unidade individualmente
- *Cadastro de funcionários*
- *Saída de material para funcionário* — desconta do estoque e, se o produto tiver série, permite escolher exatamente qual unidade está sendo entregue
- *Registro de uso* — quando o funcionário usa o material em um cliente, o sistema registra quantidade, série (se houver), cliente e data/hora
- *Alerta de estoque baixo* — destaque visual quando a quantidade fica abaixo do mínimo definido
- *Exclusão de registros* — remoção individual de itens em "Material com Funcionário" e "Histórico de Uso", além de um botão para limpar todos os dados
- *Layout responsivo* — adaptado para uso em celular

## Tecnologias

- HTML5
- CSS3 (sem frameworks)
- JavaScript puro (Vanilla JS)
- localStorage do navegador para persistência dos dados (sem backend/banco de dados)

## Como rodar localmente

1. Clone o repositório:
   bash
   git clone https://github.com/IanGil-dev/Sistema_Estoque.git
   
2. Abra a pasta no VSCode.
3. Use a extensão *Live Server* para rodar o index.html (necessário para o localStorage funcionar corretamente).

## Estrutura do projeto


Sistema_Estoque/
├── index.html
├── style.css
├── script.js
├── devico.ico
└── imagem/
    └── imagem_pagina.jpeg


## Observações

- Os dados ficam salvos no localStorage do navegador — cada dispositivo/navegador tem seus próprios dados, sem sincronização entre usuários.
- Projeto em desenvolvimento contínuo, com melhorias sendo adicionadas conforme o uso real no dia a dia.

---

Desenvolvido por [Ian Gil](https://github.com/IanGil-dev)
