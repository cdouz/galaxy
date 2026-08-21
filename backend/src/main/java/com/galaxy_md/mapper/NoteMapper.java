package com.galaxy_md.mapper;

import com.galaxy_md.dto.BacklinkResponseDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.entity.Note;

/** Static mapping helpers; not a bean, nothing here needs the container. */
public final class NoteMapper {

    private NoteMapper() {
    }

    public static NoteResponseDto toNoteResponseDto(Note note) {
        return NoteResponseDto
                .builder()
                .id(note.getId())
                .content(note.getContent())
                .title(note.getTitle())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }

    public static NoteResponseDto toSearchResultDto(Note note, String query) {
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

    public static BacklinkResponseDto toBacklinkResponseDto(Note note) {
        return BacklinkResponseDto
                .builder()
                .id(note.getId())
                .title(note.getTitle())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}
