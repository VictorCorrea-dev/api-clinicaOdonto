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
        // Retorna um Optional
        return repository.findById(id);
    }

    public Optional<Consultorio> atualizar(int id, Consultorio dadosAtualizados) {
        return repository.findById(id).map(consultorioExistente -> {
            consultorioExistente.setNumero(dadosAtualizados.getNumero()); // Troca o número antigo pelo novo
            consultorioExistente.setDescricao(dadosAtualizados.getDescricao()); // Troca a descrição antiga pela nova
            return repository.save(consultorioExistente); // Como já tem ID, o save() executa um UPDATE no banco
        });
    }

    public boolean deletar(int id) {
        if (!repository.existsById(id)) { // Checa antes se o ID existe no banco para evitar erro 500
            return false; // Avisa o Controller que não encontrou nada para apagar
        }
        repository.deleteById(id); // Executa "DELETE FROM consultorio WHERE id = ?"
        return true; // Avisa o Controller que apagou com sucesso
    }
}