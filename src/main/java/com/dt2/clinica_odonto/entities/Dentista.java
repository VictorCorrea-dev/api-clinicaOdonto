package com.dt2.clinica_odonto.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Dentista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "O CRO é obrigatório")
    private String cro;

    @NotBlank(message = "A especialidade é obrigatória")
    private String especialidade;

    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    public Dentista() {
    }

    public Dentista(int id, String nome, String cpf, String cro, String especialidade, String email, String telefone) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.cro = cro;
        this.especialidade = especialidade;
        this.email = email;
        this.telefone = telefone;
    }

    public Dentista(String nome, String cpf, String cro, String especialidade, String email, String telefone) {
        this.nome = nome;
        this.cpf = cpf;
        this.cro = cro;
        this.especialidade = especialidade;
        this.email = email;
        this.telefone = telefone;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCro() {
        return cro;
    }

    public void setCro(String cro) {
        this.cro = cro;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}