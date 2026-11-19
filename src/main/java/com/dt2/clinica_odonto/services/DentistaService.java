package com.dt2.clinica_odonto.services;

import com.dt2.clinica_odonto.entities.Dentista;
import com.dt2.clinica_odonto.repositories.DentistaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DentistaService {

    private final DentistaRepository repository;

    public DentistaService(DentistaRepository repository) {
        this.repository = repository;
    }

    public Dentista cadastrar(Dentista dentista) {
        if (repository.existsByCpf(dentista.getCpf())) {
            throw new DataIntegrityViolationException("CPF já cadastrado.");
        }
        if (repository.existsByCro(dentista.getCro())) {
            throw new DataIntegrityViolationException("CRO já cadastrado.");
        }
        return repository.save(dentista);
    }

    public List<Dentista> listarTodos() {
        return repository.findAll();
    }

    public Optional<Dentista> buscarPorId(int id) {
        return repository.findById(id);
    }

    public Optional<Dentista> atualizar(int id, Dentista dadosAtualizados) {
        return repository.findById(id).map(dentista -> {
            dentista.setNome(dadosAtualizados.getNome());
            dentista.setCpf(dadosAtualizados.getCpf());
            dentista.setCro(dadosAtualizados.getCro());
            dentista.setEspecialidade(dadosAtualizados.getEspecialidade());
            dentista.setEmail(dadosAtualizados.getEmail());
            dentista.setTelefone(dadosAtualizados.getTelefone());
            return repository.save(dentista);
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