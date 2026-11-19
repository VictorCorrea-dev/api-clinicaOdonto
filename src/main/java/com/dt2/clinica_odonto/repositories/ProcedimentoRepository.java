package com.dt2.clinica_odonto.repositories;

import com.dt2.clinica_odonto.entities.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedimentoRepository extends JpaRepository<Procedimento, Integer> {
    boolean existsByNome(String nome);
}