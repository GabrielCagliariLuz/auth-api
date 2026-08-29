package com.auth.api.controller;

import com.auth.api.service.UsuarioService;
import com.auth.api.usuario.DadosAtualizacaoUsuario;
import com.auth.api.usuario.DadosCadastroUsuario;
import com.auth.api.usuario.DadosDetalhamentoUsuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoUsuario> cadastrar(
            @RequestBody @Valid DadosCadastroUsuario dados,
            UriComponentsBuilder uriBuilder
    ) {
        DadosDetalhamentoUsuario usuario = usuarioService.cadastrar(dados);
        URI uri = uriBuilder.path("/usuarios/{id}").buildAndExpand(usuario.id()).toUri();
        return ResponseEntity.created(uri).body(usuario);
    }

    /*@GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoUsuario> detalhar(@PathVariable Long id){
        DadosDetalhamentoUsuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }*/

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoUsuario> buscarPorId(@PathVariable Long id) {
        DadosDetalhamentoUsuario dto = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoUsuario> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid DadosAtualizacaoUsuario dados
    ) {
        DadosDetalhamentoUsuario usuarioAtualizado = usuarioService.atualizar(id, dados);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        usuarioService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
