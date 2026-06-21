package com.galaxy_md.controller;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
@RestController
@RequestMapping(path = "/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<NoteResponseDto> getAllNotesFromUser(@RequestParam Long userId) {
        return noteService.getAllNotesFromUser(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteCreateDto createNote(
            @RequestBody NoteCreateDto dto,
            @AuthenticationPrincipal UserDetails currentUser) {
        return noteService.create(dto, currentUser.getUsername());
    }
}
