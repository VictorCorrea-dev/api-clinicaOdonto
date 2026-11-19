package com.dt2.clinica_odonto.services;

import com.dt2.clinica_odonto.entities.*;
import com.dt2.clinica_odonto.repositories.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final DentistaRepository dentistaRepository;
    private final ProcedimentoRepository procedimentoRepository;
    private final ConsultorioRepository consultorioRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
                              PacienteRepository pacienteRepository,
                              DentistaRepository dentistaRepository,
                              ProcedimentoRepository procedimentoRepository,
                              ConsultorioRepository consultorioRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.dentistaRepository = dentistaRepository;
        this.procedimentoRepository = procedimentoRepository;
        this.consultorioRepository = consultorioRepository;
    }

    public Agendamento cadastrar(Agendamento agendamento) {
        Paciente paciente = pacienteRepository.findById(agendamento.getPaciente().getId())
                .orElseThrow(() -> new DataIntegrityViolationException("Paciente não encontrado."));

        Dentista dentista = dentistaRepository.findById(agendamento.getDentista().getId())
                .orElseThrow(() -> new DataIntegrityViolationException("Dentista não encontrado."));

        Procedimento procedimento = procedimentoRepository.findById(agendamento.getProcedimento().getId())
                .orElseThrow(() -> new DataIntegrityViolationException("Procedimento não encontrado."));

        Consultorio consultorio = consultorioRepository.findById(agendamento.getConsultorio().getId())
                .orElseThrow(() -> new DataIntegrityViolationException("Consultório não encontrado."));

        // não permite dois agendamentos para o mesmo dentista no mesmo horário
        if (agendamentoRepository.existsByDentistaIdAndDataHoraAndStatusNot(dentista.getId(), agendamento.getDataHora(), "CANCELADO")) {
            throw new DataIntegrityViolationException("Este dentista já possui uma consulta marcada neste horário.");
        }

        // não permite usar o mesmo consultório no mesmo horário
        if (agendamentoRepository.existsByConsultorioIdAndDataHoraAndStatusNot(consultorio.getId(), agendamento.getDataHora(), "CANCELADO")) {
            throw new DataIntegrityViolationException("Este consultório já está ocupado neste horário.");
        }

        // Preenche as referências completas e define status padrão se vier vazio
        agendamento.setPaciente(paciente);
        agendamento.setDentista(dentista);
        agendamento.setProcedimento(procedimento);
        agendamento.setConsultorio(consultorio);
        if (agendamento.getStatus() == null || agendamento.getStatus().isBlank()) {
            agendamento.setStatus("AGENDADO");
        }

        return agendamentoRepository.save(agendamento);
    }

    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public Optional<Agendamento> buscarPorId(int id) {
        return agendamentoRepository.findById(id);
    }

    public Optional<Agendamento> atualizar(int id, Agendamento dadosAtualizados) {
        return agendamentoRepository.findById(id).map(existente -> {
            Paciente paciente = pacienteRepository.findById(dadosAtualizados.getPaciente().getId())
                    .orElseThrow(() -> new DataIntegrityViolationException("Paciente não encontrado."));
            Dentista dentista = dentistaRepository.findById(dadosAtualizados.getDentista().getId())
                    .orElseThrow(() -> new DataIntegrityViolationException("Dentista não encontrado."));
            Procedimento procedimento = procedimentoRepository.findById(dadosAtualizados.getProcedimento().getId())
                    .orElseThrow(() -> new DataIntegrityViolationException("Procedimento não encontrado."));
            Consultorio consultorio = consultorioRepository.findById(dadosAtualizados.getConsultorio().getId())
                    .orElseThrow(() -> new DataIntegrityViolationException("Consultório não encontrado."));

            existente.setPaciente(paciente);
            existente.setDentista(dentista);
            existente.setProcedimento(procedimento);
            existente.setConsultorio(consultorio);
            existente.setDataHora(dadosAtualizados.getDataHora());
            if (dadosAtualizados.getStatus() != null && !dadosAtualizados.getStatus().isBlank()) {
                existente.setStatus(dadosAtualizados.getStatus());
            }
            existente.setObservacoes(dadosAtualizados.getObservacoes());

            return agendamentoRepository.save(existente);
        });
    }

    public boolean deletar(int id) {
        if (!agendamentoRepository.existsById(id)) {
            return false;
        }
        agendamentoRepository.deleteById(id);
        return true;
    }
}