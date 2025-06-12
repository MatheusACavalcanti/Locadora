package com.teste.Locadora.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teste.Locadora.model.Filme;
import com.teste.Locadora.repository.FilmeRepository;

@RestController
@RequestMapping("/filme")
@CrossOrigin(origins = "*")
public class FilmeController {

    @Autowired
    private FilmeRepository repository;

    @PostMapping
    public Filme create(@RequestBody Filme obj) {
        return repository.save(obj);
    }

    @GetMapping
    public List<Filme> listAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Filme getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

     @PutMapping 
    public Filme update(@RequestBody Filme obj) {
        return repository.save(obj);
    }
}
