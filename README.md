# API Clínica Odontológica

Aplicação full-stack desenvolvida para o gerenciamento de uma clínica odontológica, permitindo o controle de pacientes, dentistas, procedimentos, consultórios e agendamentos de consultas com validação de conflitos de horário.

## Tecnologias Utilizadas

* **Back-end:** Java, Spring Boot, Spring Web, Spring Data JPA, Bean Validation
* **Banco de Dados:** MySQL
* **Front-end:** HTML5, CSS3 e JavaScript (SPA)

## Funcionalidades e Entidades

O sistema é dividido em 5 entidades principais:

1. **Pacientes (`/pacientes`):** Cadastro, listagem, edição e exclusão de pacientes (nome, CPF, telefone, e-mail e data de nascimento).
2. **Dentistas (`/dentistas`):** Gerenciamento dos dentistas com validação de CRO e especialidade.
3. **Procedimentos (`/procedimentos`):** Catálogo de procedimentos odontológicos com valor e duração em minutos.
4. **Consultórios (`/consultorios`):** Controle das salas de atendimento da clínica (número/nome e disponibilidade).
5. **Agendamentos (`/agendamentos`):** Marcação de consultas vinculando paciente, dentista, procedimento e consultório.
   * **Regra de Negócio:** Impede o agendamento de consultas no passado e bloqueia conflitos de horário para o mesmo dentista ou para o mesmo consultório com base na duração do procedimento.

## Endpoints da API

Todas as entidades seguem o padrão REST:

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/{entidade}` | Lista todos os registros cadastrados |
| `GET` | `/{entidade}/{id}` | Busca um registro específico pelo ID |
| `POST` | `/{entidade}` | Cadastra um novo registro |
| `PUT` | `/{entidade}/{id}` | Atualiza os dados de um registro existente |
| `DELETE` | `/{entidade}/{id}` | Remove um registro pelo ID |

*(Substitua `{entidade}` por `pacientes`, `dentistas`, `procedimentos`, `consultorios` ou `agendamentos`)*


