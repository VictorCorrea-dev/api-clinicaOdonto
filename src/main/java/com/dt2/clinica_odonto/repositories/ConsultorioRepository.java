package com.dt2.clinica_odonto.repositories;

import com.dt2.clinica_odonto.entities.Consultorio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultorioRepository extends JpaRepository<Consultorio, Integer> {
    boolean existsByNumero(String numero);
}