package com.teste.Locadora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teste.Locadora.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
