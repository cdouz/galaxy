package com.galaxy_md.service;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;

import java.util.List;

public interface NoteService {
    List<NoteResponseDto> getAllNotesFromUser(Long userId);

    NoteCreateDto create(NoteCreateDto dto, String username);
}
