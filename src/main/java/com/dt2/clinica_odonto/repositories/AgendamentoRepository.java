package com.dt2.clinica_odonto.repositories;

import com.dt2.clinica_odonto.entities.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

    boolean existsByDentistaIdAndDataHoraAndStatusNot(int dentistaId, LocalDateTime dataHora, String status);

    boolean existsByConsultorioIdAndDataHoraAndStatusNot(int consultorioId, LocalDateTime dataHora, String status);
}