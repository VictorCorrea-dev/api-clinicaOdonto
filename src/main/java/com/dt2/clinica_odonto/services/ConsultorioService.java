package com.dt2.clinica_odonto.services;

import com.dt2.clinica_odonto.entities.Consultorio;
import com.dt2.clinica_odonto.repositories.ConsultorioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultorioService {

    private final ConsultorioRepository repository;

    public ConsultorioService(ConsultorioRepository repository) {
        this.repository = repository;
    }

    public Consultorio cadastrar(Consultorio consultorio) {
        if (repository.existsByNumero(consultorio.getNumero())) {
            throw new DataIntegrityViolationException("Já existe um consultório cadastrado com esse número.");
        }
        return repository.save(consultorio);
    }

    public List<Consultorio> listarTodos() {
        return repository.findAll();
    }

    public Optional<Consultorio> buscarPorId(int id) {
        return repository.findById(id);
    }

    public Optional<Consultorio> atualizar(int id, Consultorio dadosAtualizados) {
        return repository.findById(id).map(consultorioExistente -> {
            consultorioExistente.setNumero(dadosAtualizados.getNumero()); 
            consultorioExistente.setDescricao(dadosAtualizados.getDescricao()); 
            return repository.save(consultorioExistente); 
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
