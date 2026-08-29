package com.auth.api.service;

import com.auth.api.usuario.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public DadosDetalhamentoUsuario cadastrar(DadosCadastroUsuario dados){
        if (!dados.senha().equals(dados.confirmarSenha())){
            throw new IllegalArgumentException("As senhas não coincidem");
        }
        if (repository.existsByEmail(dados.email())){
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(dados, senhaCriptografada);
        repository.save(usuario);

        return new DadosDetalhamentoUsuario(usuario);
    }

    @Transactional
    public DadosDetalhamentoUsuario atualizar(Long id, DadosAtualizacaoUsuario dados){
        Usuario usuario = repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + id));
        usuario.atualizarInformacoes(dados);
        return new DadosDetalhamentoUsuario(usuario);
    }

    @Transactional
    public void desativar(Long id) {
        Usuario usuario = repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário nao encontrado com o ID: "+ id));
        usuario.excluirLogico();
    }

    @Transactional(readOnly = true)
    public DadosDetalhamentoUsuario buscarPorId(Long id){
        Usuario usuario = repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário nao encontrado com o ID: "+ id));
        return new DadosDetalhamentoUsuario(usuario);
    }
}
