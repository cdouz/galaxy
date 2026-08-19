package com.galaxy_md.controller;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.dto.NoteUpdateDto;
import com.galaxy_md.security.UserPrincipal;
import com.galaxy_md.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<NoteResponseDto> getAllNotesFromUser(@AuthenticationPrincipal UserPrincipal principal) {
        return noteService.getAllNotesFromUser(principal.getId());
    }

    @GetMapping("/{id}")
    public NoteResponseDto getById(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return noteService.getById(id, principal.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteResponseDto createNote(
            @Valid @RequestBody NoteCreateDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        return noteService.create(dto, principal.getUser());
    }

    @PutMapping("/{id}")
    public NoteResponseDto updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteUpdateDto dto,
            @AuthenticationPrincipal UserPrincipal principal) {
        return noteService.update(id, dto, principal.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNote(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        noteService.delete(id, principal.getId());
    }
}
