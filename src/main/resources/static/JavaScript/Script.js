const BASE_URL = 'http://localhost:8080';

// Cache em memória para filtros e para preencher os selects do Agendamento
let cachePacientes = [];
let cacheDentistas = [];
let cacheProcedimentos = [];
let cacheConsultorios = [];

const divStatus = document.getElementById('mensagem-status');

function mostrarStatus(texto, tipo) {
    divStatus.textContent = texto;
    divStatus.className = `alerta ${tipo}`;
    if (tipo === 'sucesso') {
        setTimeout(() => divStatus.className = 'alerta oculto', 4000);
    }
}

function esconderStatus() {
    divStatus.className = 'alerta oculto';
}

function obterIniciais(nome) {
    if (!nome) return '?';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// =========================================================================
// NAVEGAÇÃO ENTRE ABAS (SPA)
// =========================================================================
document.querySelectorAll('.nav-tab').forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const abaAlvo = link.dataset.tab;

        // Atualiza botão ativo no menu
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
        link.classList.add('active');

        // Mostra apenas a seção selecionada
        document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('oculto'));
        document.getElementById(`sec-${abaAlvo}`).classList.remove('oculto');
        esconderStatus();

        // Carrega os dados da aba clicada
        if (abaAlvo === 'pacientes') await carregarPacientes();
        if (abaAlvo === 'dentistas') await carregarDentistas();
        if (abaAlvo === 'procedimentos') await carregarProcedimentos();
        if (abaAlvo === 'consultorios') await carregarConsultorios();
        if (abaAlvo === 'agendamentos') {
            await carregarTudoParaAgendamento();
            await carregarAgendamentos();
        }
    });
});

// Máscaras reutilizáveis
function aplicarMascaraCPF(input) {
    input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
    });
}

function aplicarMascaraTelefone(input) {
    input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        else if (v.length > 5) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        e.target.value = v;
    });
}

aplicarMascaraCPF(document.getElementById('pac-cpf'));
aplicarMascaraTelefone(document.getElementById('pac-telefone'));
aplicarMascaraCPF(document.getElementById('den-cpf'));
aplicarMascaraTelefone(document.getElementById('den-telefone'));

// Inicialização ao abrir o site
document.addEventListener('DOMContentLoaded', carregarPacientes);

// =========================================================================
// 1. PACIENTES
// =========================================================================
async function carregarPacientes() {
    try {
        const res = await fetch(`${BASE_URL}/pacientes`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        cachePacientes = await res.json();
        document.getElementById('contador-pacientes').textContent = `${cachePacientes.length} paciente(s)`;
        renderizarPacientes(cachePacientes);
    } catch (e) {
        mostrarStatus('Erro ao carregar pacientes. Verifique se a API está ativa.', 'erro');
    }
}

function renderizarPacientes(lista) {
    const tbody = document.getElementById('tabela-pacientes');
    tbody.innerHTML = lista.length === 0
        ? '<tr><td colspan="4" style="text-align:center;color:#64748b;">Nenhum paciente cadastrado.</td></tr>'
        : '';

    lista.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="patient-cell">
                    <div class="avatar">${obterIniciais(p.nome)}</div>
                    <div><span class="patient-name">${p.nome}</span><span class="patient-id">#${p.id}</span></div>
                </div>
            </td>
            <td><span class="cpf-badge">${p.cpf}</span></td>
            <td><span class="contact-phone">${p.telefone || '-'}</span><span class="contact-email">${p.email || ''}</span></td>
            <td class="text-right">
                <button class="btn-action btn-edit" onclick='editarPaciente(${JSON.stringify(p)})'>Editar</button>
                <button class="btn-action btn-delete" onclick="deletarItem('/pacientes', ${p.id}, carregarPacientes)">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('busca-paciente').addEventListener('input', (e) => {
    const t = e.target.value.toLowerCase();
    renderizarPacientes(cachePacientes.filter(p => p.nome.toLowerCase().includes(t) || p.cpf.includes(t)));
});

document.getElementById('form-paciente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('paciente-id').value;
    const payload = {
        nome: document.getElementById('pac-nome').value.trim(),
        cpf: document.getElementById('pac-cpf').value.trim(),
        telefone: document.getElementById('pac-telefone').value.trim(),
        email: document.getElementById('pac-email').value.trim()
    };
    await salvarItem('/pacientes', id, payload, resetPaciente, carregarPacientes, 'Paciente salvo com sucesso!');
});

function editarPaciente(p) {
    document.getElementById('paciente-id').value = p.id;
    document.getElementById('pac-nome').value = p.nome;
    document.getElementById('pac-cpf').value = p.cpf;
    document.getElementById('pac-telefone').value = p.telefone || '';
    document.getElementById('pac-email').value = p.email || '';
    document.getElementById('titulo-form-paciente').textContent = `Editando Paciente #${p.id}`;
    document.getElementById('btn-salvar-paciente').textContent = 'Atualizar Paciente';
    document.getElementById('btn-cancelar-paciente').classList.remove('oculto');
}

function resetPaciente() {
    document.getElementById('form-paciente').reset();
    document.getElementById('paciente-id').value = '';
    document.getElementById('titulo-form-paciente').textContent = 'Novo Paciente';
    document.getElementById('btn-salvar-paciente').textContent = 'Salvar Paciente';
    document.getElementById('btn-cancelar-paciente').classList.add('oculto');
}
document.getElementById('btn-cancelar-paciente').addEventListener('click', resetPaciente);

// =========================================================================
// 2. DENTISTAS
// =========================================================================
async function carregarDentistas() {
    try {
        const res = await fetch(`${BASE_URL}/dentistas`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        cacheDentistas = await res.json();
        document.getElementById('contador-dentistas').textContent = `${cacheDentistas.length} dentista(s)`;
        renderizarDentistas(cacheDentistas);
    } catch (e) {
        mostrarStatus('Erro ao carregar dentistas.', 'erro');
    }
}

function renderizarDentistas(lista) {
    const tbody = document.getElementById('tabela-dentistas');
    tbody.innerHTML = lista.length === 0
        ? '<tr><td colspan="4" style="text-align:center;color:#64748b;">Nenhum dentista cadastrado.</td></tr>'
        : '';

    lista.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="patient-cell">
                    <div class="avatar">${obterIniciais(d.nome)}</div>
                    <div><span class="patient-name">${d.nome}</span><span class="patient-id">CPF: ${d.cpf}</span></div>
                </div>
            </td>
            <td><span class="cpf-badge">${d.cro}</span><span class="contact-email">${d.especialidade}</span></td>
            <td><span class="contact-phone">${d.telefone || '-'}</span><span class="contact-email">${d.email || ''}</span></td>
            <td class="text-right">
                <button class="btn-action btn-edit" onclick='editarDentista(${JSON.stringify(d)})'>Editar</button>
                <button class="btn-action btn-delete" onclick="deletarItem('/dentistas', ${d.id}, carregarDentistas)">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('busca-dentista').addEventListener('input', (e) => {
    const t = e.target.value.toLowerCase();
    renderizarDentistas(cacheDentistas.filter(d =>
        d.nome.toLowerCase().includes(t) || d.cro.toLowerCase().includes(t) || d.especialidade.toLowerCase().includes(t)
    ));
});

document.getElementById('form-dentista').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('dentista-id').value;
    const payload = {
        nome: document.getElementById('den-nome').value.trim(),
        cpf: document.getElementById('den-cpf').value.trim(),
        cro: document.getElementById('den-cro').value.trim(),
        especialidade: document.getElementById('den-especialidade').value.trim(),
        telefone: document.getElementById('den-telefone').value.trim(),
        email: document.getElementById('den-email').value.trim()
    };
    await salvarItem('/dentistas', id, payload, resetDentista, carregarDentistas, 'Dentista salvo com sucesso!');
});

function editarDentista(d) {
    document.getElementById('dentista-id').value = d.id;
    document.getElementById('den-nome').value = d.nome;
    document.getElementById('den-cpf').value = d.cpf;
    document.getElementById('den-cro').value = d.cro;
    document.getElementById('den-especialidade').value = d.especialidade;
    document.getElementById('den-telefone').value = d.telefone || '';
    document.getElementById('den-email').value = d.email || '';
    document.getElementById('titulo-form-dentista').textContent = `Editando Dentista #${d.id}`;
    document.getElementById('btn-salvar-dentista').textContent = 'Atualizar Dentista';
    document.getElementById('btn-cancelar-dentista').classList.remove('oculto');
}

function resetDentista() {
    document.getElementById('form-dentista').reset();
    document.getElementById('dentista-id').value = '';
    document.getElementById('titulo-form-dentista').textContent = 'Novo Dentista';
    document.getElementById('btn-salvar-dentista').textContent = 'Salvar Dentista';
    document.getElementById('btn-cancelar-dentista').classList.add('oculto');
}
document.getElementById('btn-cancelar-dentista').addEventListener('click', resetDentista);

// =========================================================================
// 3. PROCEDIMENTOS
// =========================================================================
async function carregarProcedimentos() {
    try {
        const res = await fetch(`${BASE_URL}/procedimentos`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        cacheProcedimentos = await res.json();
        document.getElementById('contador-procedimentos').textContent = `${cacheProcedimentos.length} procedimento(s)`;

        const tbody = document.getElementById('tabela-procedimentos');
        tbody.innerHTML = cacheProcedimentos.length === 0
            ? '<tr><td colspan="4" style="text-align:center;color:#64748b;">Nenhum procedimento cadastrado.</td></tr>'
            : '';

        cacheProcedimentos.forEach(pr => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="patient-name">${pr.nome}</span><span class="contact-email">${pr.descricao || ''}</span></td>
                <td>${pr.duracaoMinutos ? pr.duracaoMinutos + ' min' : '-'}</td>
                <td><span class="cpf-badge">R$ ${Number(pr.valor).toFixed(2)}</span></td>
                <td class="text-right">
                    <button class="btn-action btn-edit" onclick='editarProcedimento(${JSON.stringify(pr)})'>Editar</button>
                    <button class="btn-action btn-delete" onclick="deletarItem('/procedimentos', ${pr.id}, carregarProcedimentos)">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        mostrarStatus('Erro ao carregar procedimentos.', 'erro');
    }
}

document.getElementById('form-procedimento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('procedimento-id').value;
    const duracaoVal = document.getElementById('proc-duracao').value;
    const payload = {
        nome: document.getElementById('proc-nome').value.trim(),
        descricao: document.getElementById('proc-descricao').value.trim(),
        valor: parseFloat(document.getElementById('proc-valor').value),
        duracaoMinutos: duracaoVal ? parseInt(duracaoVal) : null
    };
    await salvarItem('/procedimentos', id, payload, resetProcedimento, carregarProcedimentos, 'Procedimento salvo!');
});

function editarProcedimento(pr) {
    document.getElementById('procedimento-id').value = pr.id;
    document.getElementById('proc-nome').value = pr.nome;
    document.getElementById('proc-descricao').value = pr.descricao || '';
    document.getElementById('proc-valor').value = pr.valor;
    document.getElementById('proc-duracao').value = pr.duracaoMinutos || '';
    document.getElementById('titulo-form-procedimento').textContent = `Editando Procedimento #${pr.id}`;
    document.getElementById('btn-salvar-procedimento').textContent = 'Atualizar';
    document.getElementById('btn-cancelar-procedimento').classList.remove('oculto');
}

function resetProcedimento() {
    document.getElementById('form-procedimento').reset();
    document.getElementById('procedimento-id').value = '';
    document.getElementById('titulo-form-procedimento').textContent = 'Novo Procedimento';
    document.getElementById('btn-salvar-procedimento').textContent = 'Salvar Procedimento';
    document.getElementById('btn-cancelar-procedimento').classList.add('oculto');
}
document.getElementById('btn-cancelar-procedimento').addEventListener('click', resetProcedimento);

// =========================================================================
// 4. CONSULTÓRIOS
// =========================================================================
async function carregarConsultorios() {
    try {
        const res = await fetch(`${BASE_URL}/consultorios`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        cacheConsultorios = await res.json();
        document.getElementById('contador-consultorios').textContent = `${cacheConsultorios.length} sala(s)`;

        const tbody = document.getElementById('tabela-consultorios');
        tbody.innerHTML = cacheConsultorios.length === 0
            ? '<tr><td colspan="4" style="text-align:center;color:#64748b;">Nenhum consultório cadastrado.</td></tr>'
            : '';

        cacheConsultorios.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${c.id}</td>
                <td><span class="patient-name">${c.numero}</span></td>
                <td>${c.descricao || '-'}</td>
                <td class="text-right">
                    <button class="btn-action btn-edit" onclick='editarConsultorio(${JSON.stringify(c)})'>Editar</button>
                    <button class="btn-action btn-delete" onclick="deletarItem('/consultorios', ${c.id}, carregarConsultorios)">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        mostrarStatus('Erro ao carregar consultórios.', 'erro');
    }
}

document.getElementById('form-consultorio').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('consultorio-id').value;
    const payload = {
        numero: document.getElementById('cons-numero').value.trim(),
        descricao: document.getElementById('cons-descricao').value.trim()
    };
    await salvarItem('/consultorios', id, payload, resetConsultorio, carregarConsultorios, 'Consultório salvo!');
});

function editarConsultorio(c) {
    document.getElementById('consultorio-id').value = c.id;
    document.getElementById('cons-numero').value = c.numero;
    document.getElementById('cons-descricao').value = c.descricao || '';
    document.getElementById('titulo-form-consultorio').textContent = `Editando Sala #${c.id}`;
    document.getElementById('btn-salvar-consultorio').textContent = 'Atualizar';
    document.getElementById('btn-cancelar-consultorio').classList.remove('oculto');
}

function resetConsultorio() {
    document.getElementById('form-consultorio').reset();
    document.getElementById('consultorio-id').value = '';
    document.getElementById('titulo-form-consultorio').textContent = 'Novo Consultório';
    document.getElementById('btn-salvar-consultorio').textContent = 'Salvar Consultório';
    document.getElementById('btn-cancelar-consultorio').classList.add('oculto');
}
document.getElementById('btn-cancelar-consultorio').addEventListener('click', resetConsultorio);

// =========================================================================
// 5. AGENDAMENTOS
// =========================================================================
async function carregarTudoParaAgendamento() {
    const [rPac, rDen, rProc, rCons] = await Promise.all([
        fetch(`${BASE_URL}/pacientes`),
        fetch(`${BASE_URL}/dentistas`),
        fetch(`${BASE_URL}/procedimentos`),
        fetch(`${BASE_URL}/consultorios`)
    ]);
    cachePacientes = rPac.ok ? await rPac.json() : [];
    cacheDentistas = rDen.ok ? await rDen.json() : [];
    cacheProcedimentos = rProc.ok ? await rProc.json() : [];
    cacheConsultorios = rCons.ok ? await rCons.json() : [];

    preencherSelect('ag-paciente', cachePacientes, 'Selecione o paciente...', p => `${p.nome} (${p.cpf})`);
    preencherSelect('ag-dentista', cacheDentistas, 'Selecione o dentista...', d => `${d.nome} • ${d.especialidade}`);
    preencherSelect('ag-procedimento', cacheProcedimentos, 'Selecione o procedimento...', pr => `${pr.nome} - R$ ${Number(pr.valor).toFixed(2)}`);
    preencherSelect('ag-consultorio', cacheConsultorios, 'Selecione a sala...', c => c.numero);
}

function preencherSelect(idSelect, lista, placeholder, formatar) {
    const sel = document.getElementById(idSelect);
    sel.innerHTML = `<option value="">${placeholder}</option>`;
    lista.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = formatar(item);
        sel.appendChild(opt);
    });
}

async function carregarAgendamentos() {
    try {
        const res = await fetch(`${BASE_URL}/agendamentos`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const lista = await res.json();
        document.getElementById('contador-agendamentos').textContent = `${lista.length} consulta(s)`;

        const tbody = document.getElementById('tabela-agendamentos');
        tbody.innerHTML = lista.length === 0
            ? '<tr><td colspan="6" style="text-align:center;color:#64748b;">Nenhuma consulta agendada.</td></tr>'
            : '';

        lista.forEach(ag => {
            const dataBR = new Date(ag.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${dataBR}</strong><span class="patient-id">#${ag.id}</span></td>
                <td><span class="patient-name">${ag.paciente?.nome || '-'}</span></td>
                <td><span class="patient-name">${ag.dentista?.nome || '-'}</span><span class="contact-email">Sala: ${ag.consultorio?.numero || '-'}</span></td>
                <td>${ag.procedimento?.nome || '-'}</td>
                <td><span class="cpf-badge">${ag.status}</span></td>
                <td class="text-right">
                    <button class="btn-action btn-edit" onclick='editarAgendamento(${JSON.stringify(ag)})'>Editar</button>
                    <button class="btn-action btn-delete" onclick="deletarItem('/agendamentos', ${ag.id}, carregarAgendamentos)">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        mostrarStatus('Erro ao carregar agendamentos.', 'erro');
    }
}

document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('agendamento-id').value;
    const rawData = document.getElementById('ag-dataHora').value;
    const payload = {
        paciente: { id: Number(document.getElementById('ag-paciente').value) },
        dentista: { id: Number(document.getElementById('ag-dentista').value) },
        procedimento: { id: Number(document.getElementById('ag-procedimento').value) },
        consultorio: { id: Number(document.getElementById('ag-consultorio').value) },
        dataHora: rawData.length === 16 ? `${rawData}:00` : rawData,
        status: document.getElementById('ag-status').value,
        observacoes: document.getElementById('ag-observacoes').value.trim()
    };
    await salvarItem('/agendamentos', id, payload, resetAgendamento, carregarAgendamentos, 'Consulta agendada!');
});

function editarAgendamento(ag) {
    document.getElementById('agendamento-id').value = ag.id;
    document.getElementById('ag-paciente').value = ag.paciente?.id || '';
    document.getElementById('ag-dentista').value = ag.dentista?.id || '';
    document.getElementById('ag-procedimento').value = ag.procedimento?.id || '';
    document.getElementById('ag-consultorio').value = ag.consultorio?.id || '';
    document.getElementById('ag-dataHora').value = ag.dataHora ? ag.dataHora.substring(0, 16) : '';
    document.getElementById('ag-status').value = ag.status || 'AGENDADO';
    document.getElementById('ag-observacoes').value = ag.observacoes || '';
    document.getElementById('titulo-form-agendamento').textContent = `Editando Consulta #${ag.id}`;
    document.getElementById('btn-salvar-agendamento').textContent = 'Atualizar Consulta';
    document.getElementById('btn-cancelar-agendamento').classList.remove('oculto');
}

function resetAgendamento() {
    document.getElementById('form-agendamento').reset();
    document.getElementById('agendamento-id').value = '';
    document.getElementById('titulo-form-agendamento').textContent = 'Novo Agendamento';
    document.getElementById('btn-salvar-agendamento').textContent = 'Agendar Consulta';
    document.getElementById('btn-cancelar-agendamento').classList.add('oculto');
}
document.getElementById('btn-cancelar-agendamento').addEventListener('click', resetAgendamento);

// =========================================================================
// FUNÇÕES GENÉRICAS DE SALVAR (POST/PUT) E EXCLUIR (DELETE)
// =========================================================================
async function salvarItem(rota, id, payload, fnReset, fnRecarregar, msgSucesso) {
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${BASE_URL}${rota}/${id}` : `${BASE_URL}${rota}`;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.erro || err?.message || `Erro ao salvar (Status ${res.status})`);
        }

        fnReset();
        await fnRecarregar();
        mostrarStatus(id ? 'Registro atualizado com sucesso!' : msgSucesso, 'sucesso');
    } catch (erro) {
        mostrarStatus(erro.message, 'erro');
    }
}

async function deletarItem(rota, id, fnRecarregar) {
    if (!confirm(`Deseja realmente excluir o registro #${id}?`)) return;
    try {
        const res = await fetch(`${BASE_URL}${rota}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Erro ao excluir (Status ${res.status})`);
        await fnRecarregar();
        mostrarStatus('Registro excluído com sucesso.', 'sucesso');
    } catch (erro) {
        mostrarStatus(erro.message, 'erro');
    }
}