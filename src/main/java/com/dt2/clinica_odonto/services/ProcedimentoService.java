package com.dt2.clinica_odonto.services;

import com.dt2.clinica_odonto.entities.Procedimento;
import com.dt2.clinica_odonto.repositories.ProcedimentoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcedimentoService {

    private final ProcedimentoRepository repository;

    public ProcedimentoService(ProcedimentoRepository repository) {
        this.repository = repository;
    }

    public Procedimento cadastrar(Procedimento procedimento) {
        if (repository.existsByNome(procedimento.getNome())) {
            throw new DataIntegrityViolationException("Já existe um procedimento cadastrado com esse nome.");
        }
        return repository.save(procedimento);
    }

    public List<Procedimento> listarTodos() {
        return repository.findAll();
    }

    public Optional<Procedimento> buscarPorId(int id) {
        return repository.findById(id);
    }

    public Optional<Procedimento> atualizar(int id, Procedimento dadosAtualizados) {
        return repository.findById(id).map(procedimento -> {
            procedimento.setNome(dadosAtualizados.getNome());
            procedimento.setDescricao(dadosAtualizados.getDescricao());
            procedimento.setValor(dadosAtualizados.getValor());
            procedimento.setDuracaoMinutos(dadosAtualizados.getDuracaoMinutos());
            return repository.save(procedimento);
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