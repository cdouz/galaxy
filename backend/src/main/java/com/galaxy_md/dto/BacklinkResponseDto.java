package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BacklinkResponseDto {
    private Long id;
    private String title;
    private LocalDateTime updatedAt;
}
