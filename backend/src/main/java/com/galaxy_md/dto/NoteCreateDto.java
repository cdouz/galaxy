package com.galaxy_md.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteCreateDto {

    // Mirrors the column types: notes.content is TEXT, notes.title is VARCHAR(255).
    @Size(max = NoteLimits.CONTENT_MAX_LENGTH)
    private String content;

    @NotBlank
    @Size(max = NoteLimits.TITLE_MAX_LENGTH)
    private String title;
}
