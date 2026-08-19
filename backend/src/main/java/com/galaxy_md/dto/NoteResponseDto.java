package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NoteResponseDto {
    private Long id;
    private String content;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
