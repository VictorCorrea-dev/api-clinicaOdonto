package com.dt2.clinica_odonto.repositories;

import com.dt2.clinica_odonto.entities.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DentistaRepository extends JpaRepository<Dentista, Integer> {
    boolean existsByCpf(String cpf);
    boolean existsByCro(String cro);
}