# system

## Sobre o repositório

<p align="justify"> Encarregado de armazenar o codigo fonte da aplicação. Gerenciamento de versões e controle/gerencia do projeto.</p>

[Link para o repositorio](https://github.com/thallysbraz/system)

## 1 - Sobre o projeto

<p align="justify">Mini sistema de faculdade, que alunos podem consultar suas notas e professores podem fazer o lançamento das notas. Desenvolvido com NodeJS, MongoDB e Handlebars, usando a arquitetura MVC.</p>

## 2 - Requisitos do projeto

<p align="justify">Para executar a aplicação, deve ter os seguintes softwares instalados:</p>

<ul>

<li>YARN instalados</li>

```bash
Yarn na versão 1.17.3 ou mais recente
```

<li>MongoDB instalado</li>

</ul>

## 3 - Problemas de desenvolvimento

Lista de funcionalidades a serem desenvolvidas e status de progresso

|              Problema              |                                 Descrição                                 |     Status      |
| :--------------------------------: | :-----------------------------------------------------------------------: | :-------------: |
|       Arrumar banco de dados       |       Fazer relacionamentos e descobrir como arrumar banco de dados       |    Concluido    |
|        Crud de disciplinas         |         Fazer as rotas de get, post, put e delete das disciplinas         |    Concluido    |
|               Alunos               |         Fazer rotas e view para cadastrar alunos nas disciplinas          |    Concluido    |
|         Relacionamentos BD         |             Fazer relacionamento entre ALUNO/DISCIPLINA/NOTA              |    Concluido    |
| Pesquisar disciplina por professor |    Mostrar ao professor todas as disciplinas que ele da aula (BACKEND)    |    Concluido    |
| Pesquisar disciplina por professor |   Mostrar ao professor todas as disciplinas que ele da aula (Frontend)    |    Concluido    |
|            Lançar notas            |                    Termina view de lançamento de notas                    |    Concluido    |
|     Inserir alunos/disciplina      | Cadastrar aluno em disciplina e disciplina em aluno com menção e semestre |    Concluido    |
|             Validações             |               Fazer validações nas rotas de adicionar aluno               |    Concluido    |
|             Validações             |          Fazer validações nas rotas de adicionar a nota do aluno          |    Concluido    |
|          Redirecionamento          |               Refatorar o redirecionamento em rotas e views               | Desenvolvimento |

## 4 - proximos objetivos

- ~~desenvolver a tela de editar nota~~
- ~~mostrar ao usuario suas notas~~
- ~~Cadastrar aluno em disciplina e disciplina em aluno com menção e semestre~~
- ~~fazer validações nas rotas de adicionar aluno~~
- ~~Fazer validações nas rotas de adicionar a nota do aluno~~
- ~~continuar arrumando views e validações nas adição de nota~~
- Refatorar o redirecionamento em rotas e views
- fazer deploy da aplicação no heroku

## 5 - Para executar o projeto

1. Clone o repositório:

```bash
Verifique se a porta localhost 3000  não estão sendo usada.
```

2. Clone o repositório:

```bash
git clone: https://github.com/thallysbraz/system
```

3. Pelo terminal entre na pasta raiz do projeto

4. Execute o seguinte comando:

```bash
yarn install
```

5. Em seguida, execute o seguinte comando:

```bash
yarn dev
```

6. Pronto, a aplicação irá executar na página web.

![](./image/System.png)

<p align="center"> <img src="https://github.com/thallysbraz/system/blob/master/image/System.PNG" width="auto" height="400" />
