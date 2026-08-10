package com.auth.api.service;

import com.auth.api.usuario.DadosCadastroUsuario;
import com.auth.api.usuario.Usuario;
import com.auth.api.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario cadastrar(DadosCadastroUsuario dados){
        if (!dados.senha().equals(dados.confirmarSenha())){
            throw new IllegalArgumentException("As senhas não coincidem");
        }
        if (repository.existsByEmail(dados.email())){
            throw new IllegalArgumentException("Este e-mail já está cadastrado.");
        }
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(null, dados.nome(), dados.email(), senhaCriptografada);
        return repository.save(usuario);
    }
}
