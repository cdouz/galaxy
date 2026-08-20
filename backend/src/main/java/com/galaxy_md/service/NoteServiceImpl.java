package com.galaxy_md.service;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.dto.NoteUpdateDto;
import com.galaxy_md.entity.Note;
import com.galaxy_md.entity.User;
import com.galaxy_md.exception.NoteNotFoundException;
import com.galaxy_md.exception.NoteTitleAlreadyExistsException;
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
    public List<NoteResponseDto> getRecentNotes(Long userId) {
        return noteRepository.findTop5ByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(NoteMapper::NoteToNoteResponseDto)
                .toList();
    }

    @Override
    public NoteResponseDto getById(Long id, Long userId) {
        Note note = findOwnedNote(id, userId);
        return NoteMapper.NoteToNoteResponseDto(note);
    }

    @Override
    public NoteResponseDto create(NoteCreateDto dto, User user) {
        if (noteRepository.existsByUserIdAndTitle(user.getId(), dto.getTitle())) {
            throw new NoteTitleAlreadyExistsException(dto.getTitle());
        }

        Note note = Note.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .user(user)
                .build();

        return NoteMapper.NoteToNoteResponseDto(noteRepository.save(note));
    }

    @Override
    public NoteResponseDto update(Long id, NoteUpdateDto dto, Long userId) {
        Note note = findOwnedNote(id, userId);

        if (noteRepository.existsByUserIdAndTitleAndIdNot(userId, dto.getTitle(), id)) {
            throw new NoteTitleAlreadyExistsException(dto.getTitle());
        }

        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());

        return NoteMapper.NoteToNoteResponseDto(noteRepository.save(note));
    }

    @Override
    public void delete(Long id, Long userId) {
        Note note = findOwnedNote(id, userId);
        noteRepository.delete(note);
    }

    private Note findOwnedNote(Long id, Long userId) {
        return noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NoteNotFoundException(id));
    }
}
