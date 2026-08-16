package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NoteCreateDto {
    private String content;
    private String title;
}
