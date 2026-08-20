package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DashboardStatsDto {
    private long noteCount;
    private long linkCount;
    private List<NoteResponseDto> recentNotes;
}
