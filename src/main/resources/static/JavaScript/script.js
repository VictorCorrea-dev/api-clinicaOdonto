const API_URL = 'http://localhost:8080/pacientes';

const form = document.getElementById('form-paciente');
const inputId = document.getElementById('paciente-id');
const inputNome = document.getElementById('nome');
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');
const inputEmail = document.getElementById('email');
const inputBusca = document.getElementById('busca-paciente');

const tituloForm = document.getElementById('titulo-form');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const tabelaBody = document.getElementById('tabela-pacientes');
const divStatus = document.getElementById('mensagem-status');
const contadorPacientes = document.getElementById('contador-pacientes');

let listaPacientesCache = [];

document.addEventListener('DOMContentLoaded', listarPacientes);

// Máscaras de CPF e Telefone
inputCpf.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
});

inputTelefone.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (v.length > 5) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    e.target.value = v;
});

// Filtro rápido na tabela sem precisar bater na API toda hora
inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.toLowerCase().trim();
    const filtrados = listaPacientesCache.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.cpf.toLowerCase().includes(termo)
    );
    renderizarTabela(filtrados, termo !== '');
});

function obterIniciais(nome) {
    if (!nome) return '?';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function mostrarStatus(texto, tipo) {
    divStatus.textContent = texto;
    divStatus.className = `alerta ${tipo}`;
}

function esconderStatus() {
    divStatus.className = 'alerta oculto';
}

function atualizarContador(total) {
    contadorPacientes.textContent = total === 1 ? '1 paciente' : `${total} pacientes`;
}

// 1. GET - Buscar pacientes na API
async function listarPacientes() {
    mostrarStatus('Carregando prontuários...', 'carregando');
    tabelaBody.innerHTML = '';

    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar dados (Status ${resposta.status})`);
        }

        listaPacientesCache = await resposta.json();
        atualizarContador(listaPacientesCache.length);
        renderizarTabela(listaPacientesCache, false);
    } catch (erro) {
        atualizarContador(0);
        mostrarStatus('Falha de conexão com a API. Verifique se o servidor Spring está ativo.', 'erro');
        console.error(erro);
    }
}

function renderizarTabela(pacientes, isFiltro) {
    tabelaBody.innerHTML = '';

    if (pacientes.length === 0) {
        const msg = isFiltro
            ? 'Nenhum paciente encontrado para essa busca.'
            : 'Nenhum paciente cadastrado ainda. Preencha o formulário ao lado para começar.';
        mostrarStatus(msg, 'vazio');
        return;
    }

    esconderStatus();
    pacientes.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="patient-cell">
                    <div class="avatar">${obterIniciais(paciente.nome)}</div>
                    <div>
                        <span class="patient-name">${paciente.nome}</span>
                        <span class="patient-id">Prontuário #${paciente.id}</span>
                    </div>
                </div>
            </td>
            <td><span class="cpf-badge">${paciente.cpf}</span></td>
            <td>
                <span class="contact-phone">${paciente.telefone || '-'}</span>
                <span class="contact-email">${paciente.email || 'Sem e-mail'}</span>
            </td>
            <td class="text-right">
                <button class="btn-action btn-edit" onclick='prepararEdicao(${JSON.stringify(paciente)})'>Editar</button>
                <button class="btn-action btn-delete" onclick="excluirPaciente(${paciente.id}, '${paciente.nome.replace(/'/g, "\\'")}')">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}

// 2. POST ou PUT - Cadastrar ou Atualizar
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = inputId.value;
    const dadosPaciente = {
        nome: inputNome.value.trim(),
        cpf: inputCpf.value.trim(),
        telefone: inputTelefone.value.trim(),
        email: inputEmail.value.trim()
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Salvando...';

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPaciente)
        });

        if (!resposta.ok) {
            const erroApi = await resposta.json().catch(() => null);
            const mensagemErro = erroApi?.erro || erroApi?.message || `Erro ao salvar (Código ${resposta.status})`;
            throw new Error(mensagemErro);
        }

        resetarFormulario();
        inputBusca.value = '';
        await listarPacientes();
        mostrarStatus(
            id ? 'Prontuário atualizado com sucesso!' : 'Paciente cadastrado com sucesso!',
            'sucesso'
        );
    } catch (erro) {
        mostrarStatus(erro.message, 'erro');
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = inputId.value ? 'Atualizar Paciente' : 'Salvar Paciente';
    }
});

function prepararEdicao(paciente) {
    inputId.value = paciente.id;
    inputNome.value = paciente.nome;
    inputCpf.value = paciente.cpf;
    inputTelefone.value = paciente.telefone || '';
    inputEmail.value = paciente.email || '';

    tituloForm.textContent = `Editar Prontuário #${paciente.id}`;
    btnSalvar.textContent = 'Atualizar Paciente';
    btnCancelar.classList.remove('oculto');
    inputNome.focus();
}

function resetarFormulario() {
    form.reset();
    inputId.value = '';
    tituloForm.textContent = 'Novo Paciente';
    btnSalvar.textContent = 'Salvar Paciente';
    btnCancelar.classList.add('oculto');
}

btnCancelar.addEventListener('click', resetarFormulario);

// 3. DELETE - Excluir
async function excluirPaciente(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o prontuário de ${nome}?`)) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!resposta.ok) {
            throw new Error(`Não foi possível excluir (Código ${resposta.status})`);
        }

        await listarPacientes();
        mostrarStatus(`Prontuário de ${nome} excluído.`, 'sucesso');
    } catch (erro) {
        mostrarStatus(erro.message, 'erro');
    }
}