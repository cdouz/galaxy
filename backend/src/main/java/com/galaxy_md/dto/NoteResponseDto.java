package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NoteResponseDto {
    private String content;
    private String title;
}
