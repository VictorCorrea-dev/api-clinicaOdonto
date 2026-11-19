package com.dt2.clinica_odonto.controller;

import com.dt2.clinica_odonto.entities.Consultorio;
import com.dt2.clinica_odonto.services.ConsultorioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultorios")
@CrossOrigin(origins = "*")
public class ConsultorioController {

    private final ConsultorioService service;

    public ConsultorioController(ConsultorioService service) {
        this.service = service;
    }

    @PostMapping
    // @Valid ativa as validações (@NotBlank, etc.) da entidade antes de executar o método
    // @RequestBody pega o JSON enviado na requisição e transforma em um objeto Java Consultorio
    public ResponseEntity<Consultorio> cadastrar(@Valid @RequestBody Consultorio consultorio) {
        Consultorio salvo = service.cadastrar(consultorio);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Consultorio>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultorio> buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultorio> atualizar(@PathVariable int id, @Valid @RequestBody Consultorio dadosAtualizados) {
        return service.atualizar(id, dadosAtualizados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        if (!service.deletar(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}