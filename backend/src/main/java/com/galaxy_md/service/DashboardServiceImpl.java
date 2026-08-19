package com.galaxy_md.service;

import com.galaxy_md.dto.DashboardStatsDto;
import com.galaxy_md.mapper.NoteMapper;
import com.galaxy_md.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final NoteRepository noteRepository;

    @Override
    public DashboardStatsDto getStats(Long userId) {
        long noteCount = noteRepository.countByUserId(userId);
        var recentNotes = noteRepository.findTop5ByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(NoteMapper::NoteToNoteResponseDto)
                .toList();

        return DashboardStatsDto.builder()
                .noteCount(noteCount)
                .recentNotes(recentNotes)
                .build();
    }
}
