package com.teste.Locadora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teste.Locadora.model.Locacao;

public interface LocacaoRepository extends JpaRepository<Locacao, Long> {
}
