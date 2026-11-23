package com.dt2.clinica_odonto.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Consultorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "O número ou identificação da sala é obrigatório")
    @Column(unique = true, nullable = false)
    private String numero;

    private String descricao;

    public Consultorio(int id, String numero, String descricao) {
        this.id = id;
        this.numero = numero;
        this.descricao = descricao;
    }

    public Consultorio(String numero, String descricao) {
        this.numero = numero;
        this.descricao = descricao;
    }

    public Consultorio() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}