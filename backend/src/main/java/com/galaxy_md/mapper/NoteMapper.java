package com.galaxy_md.mapper;

import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.entity.Note;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {
    public static NoteResponseDto NoteToNoteResponseDto(Note note) {
        return NoteResponseDto
                .builder()
                .contenu(note.getContenu())
                .titre(note.getTitre())
                .build();
    }
}
