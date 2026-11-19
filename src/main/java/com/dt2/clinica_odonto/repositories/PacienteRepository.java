package com.dt2.clinica_odonto.repositories;

import com.dt2.clinica_odonto.entities.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    boolean existsByCpf(String cpf);
}