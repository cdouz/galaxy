package com.galaxy_md.service;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.mapper.NoteMapper;
import com.galaxy_md.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;

    @Override
    public List<NoteResponseDto> getAllNotesFromUser(Long userId) {
        return noteRepository.findNotesByUserId(userId)
                .stream()
                .map(NoteMapper::NoteToNoteResponseDto)
                .toList();
    }

    @Override
    public NoteCreateDto create(NoteCreateDto dto, String username) {
        throw new UnsupportedOperationException("not implemented yet");
    }
}
