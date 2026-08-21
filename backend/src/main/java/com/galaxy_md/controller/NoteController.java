package com.galaxy_md.controller;

import com.galaxy_md.dto.BacklinkResponseDto;
import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.dto.NoteUpdateDto;
import com.galaxy_md.security.UserPrincipal;
import com.galaxy_md.service.LinkService;
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
    private final LinkService linkService;

    @GetMapping
    public List<NoteResponseDto> getAllNotesFromUser(@AuthenticationPrincipal UserPrincipal principal) {
        return noteService.getAllNotesFromUser(principal.getId());
    }

    @GetMapping("/recent")
    public List<NoteResponseDto> getRecentNotes(@AuthenticationPrincipal UserPrincipal principal) {
        return noteService.getRecentNotes(principal.getId());
    }

    @GetMapping("/search")
    public List<NoteResponseDto> search(@RequestParam(name = "q", required = false) String q, @AuthenticationPrincipal UserPrincipal principal) {
        return noteService.search(q, principal.getId());
    }

    @GetMapping("/{id}")
    public NoteResponseDto getById(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return noteService.getById(id, principal.getId());
    }

    @GetMapping("/{id}/backlinks")
    public List<BacklinkResponseDto> getBacklinks(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        // Resolved first so an unknown or foreign note answers 404 rather than an empty list.
        noteService.getById(id, principal.getId());
        return linkService.getBacklinks(id, principal.getId());
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
