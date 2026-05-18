package com.galaxy_md.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/note")
public class NoteController {

    @GetMapping
    public void test(){
        System.out.println("coucou");
    }
}
