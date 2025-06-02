package com.teste.Locadora.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.teste.Locadora.model.Filme;

public interface FilmeRepository extends JpaRepository<Filme, Long> {
}
