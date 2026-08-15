package com.auth.api.service;

import com.auth.api.usuario.DadosCadastroUsuario;
import com.auth.api.usuario.Usuario;
import com.auth.api.usuario.UsuarioRepository;
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
    public Usuario cadastrar(DadosCadastroUsuario dados){
        if (!dados.senha().equals(dados.confirmarSenha())){
            throw new IllegalArgumentException("As senhas não coincidem");
        }
        if (repository.existsByEmail(dados.email())){
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(dados, senhaCriptografada);
        return repository.save(usuario);
    }
}
