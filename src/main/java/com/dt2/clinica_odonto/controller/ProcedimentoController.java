package com.dt2.clinica_odonto.controller;

import com.dt2.clinica_odonto.entities.Procedimento;
import com.dt2.clinica_odonto.services.ProcedimentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/procedimentos")
@CrossOrigin(origins = "*")
public class ProcedimentoController {

    private final ProcedimentoService service;

    public ProcedimentoController(ProcedimentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Procedimento> cadastrar(@Valid @RequestBody Procedimento procedimento) {
        Procedimento salvo = service.cadastrar(procedimento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Procedimento>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Procedimento> buscarPorId(@PathVariable int id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Procedimento> atualizar(@PathVariable int id, @Valid @RequestBody Procedimento dadosAtualizados) {
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