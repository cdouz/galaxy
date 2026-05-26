package com.galaxy_md.controller;

import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<NoteResponseDto> getAllNotesFromUser(@RequestParam Long userId) {
        return noteService.getAllNotesFromUser(userId);
    }
}
