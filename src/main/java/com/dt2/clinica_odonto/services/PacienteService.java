package com.dt2.clinica_odonto.services;

import com.dt2.clinica_odonto.entities.Paciente;
import com.dt2.clinica_odonto.repositories.PacienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    private final PacienteRepository repository;

    public PacienteService(PacienteRepository repository) {
        this.repository = repository;
    }

    public Paciente cadastrar(Paciente paciente) {
        if (repository.existsByCpf(paciente.getCpf())) {
            throw new DataIntegrityViolationException("CPF já cadastrado.");
        }
        return repository.save(paciente);
    }

    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public Optional<Paciente> buscarPorId(int id) {
        return repository.findById(id);
    }

    public Optional<Paciente> atualizar(int id, Paciente dadosAtualizados) {
        return repository.findById(id).map(pacienteExistente -> {
            pacienteExistente.setNome(dadosAtualizados.getNome());
            pacienteExistente.setCpf(dadosAtualizados.getCpf());
            pacienteExistente.setTelefone(dadosAtualizados.getTelefone());
            pacienteExistente.setEmail(dadosAtualizados.getEmail());
            return repository.save(pacienteExistente);
        });
    }

    public boolean deletar(int id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}