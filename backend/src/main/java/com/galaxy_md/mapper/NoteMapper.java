package com.galaxy_md.mapper;

import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.entity.Note;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {
    public static NoteResponseDto NoteToNoteResponseDto(Note note) {
        return NoteResponseDto
                .builder()
                .id(note.getId())
                .content(note.getContent())
                .title(note.getTitle())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }

    public static NoteResponseDto NoteToSearchResultDto(Note note, String query) {
        String lowerQuery = query.toLowerCase();
        boolean matchedTitle = note.getTitle() != null && note.getTitle().toLowerCase().contains(lowerQuery);
        boolean matchedContent = note.getContent() != null && note.getContent().toLowerCase().contains(lowerQuery);

        return NoteResponseDto
                .builder()
                .id(note.getId())
                .content(note.getContent())
                .title(note.getTitle())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .matchedTitle(matchedTitle)
                .matchedContent(matchedContent)
                .build();
    }
}
