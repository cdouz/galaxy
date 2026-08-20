package com.galaxy_md.service;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.dto.NoteUpdateDto;
import com.galaxy_md.entity.User;

import java.util.List;

public interface NoteService {
    List<NoteResponseDto> getAllNotesFromUser(Long userId);

    List<NoteResponseDto> getRecentNotes(Long userId);

    List<NoteResponseDto> search(String query, Long userId);

    NoteResponseDto getById(Long id, Long userId);

    NoteResponseDto create(NoteCreateDto dto, User user);

    NoteResponseDto update(Long id, NoteUpdateDto dto, Long userId);

    void delete(Long id, Long userId);
}
