package com.dt2.clinica_odonto.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "O paciente é obrigatório")
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @NotNull(message = "O dentista é obrigatório")
    @ManyToOne
    @JoinColumn(name = "dentista_id", nullable = false)
    private Dentista dentista;

    @NotNull(message = "O procedimento é obrigatório")
    @ManyToOne
    @JoinColumn(name = "procedimento_id", nullable = false)
    private Procedimento procedimento;

    @NotNull(message = "O consultório é obrigatório")
    @ManyToOne
    @JoinColumn(name = "consultorio_id", nullable = false)
    private Consultorio consultorio;

    @NotNull(message = "A data e hora são obrigatórias")
    @Future(message = "A data e hora do agendamento devem estar no futuro")
    private LocalDateTime dataHora;

    private String status = "AGENDADO";

    private String observacoes;

    public Agendamento(int id, Paciente paciente, Dentista dentista, Procedimento procedimento,
                       Consultorio consultorio, LocalDateTime dataHora, String status, String observacoes) {
        this.id = id;
        this.paciente = paciente;
        this.dentista = dentista;
        this.procedimento = procedimento;
        this.consultorio = consultorio;
        this.dataHora = dataHora;
        this.status = status;
        this.observacoes = observacoes;
    }

    public Agendamento() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Dentista getDentista() {
        return dentista;
    }

    public void setDentista(Dentista dentista) {
        this.dentista = dentista;
    }

    public Procedimento getProcedimento() {
        return procedimento;
    }

    public void setProcedimento(Procedimento procedimento) {
        this.procedimento = procedimento;
    }

    public Consultorio getConsultorio() {
        return consultorio;
    }

    public void setConsultorio(Consultorio consultorio) {
        this.consultorio = consultorio;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}