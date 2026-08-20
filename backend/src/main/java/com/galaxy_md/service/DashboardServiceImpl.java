package com.galaxy_md.service;

import com.galaxy_md.dto.DashboardStatsDto;
import com.galaxy_md.mapper.NoteMapper;
import com.galaxy_md.repository.LinkRepository;
import com.galaxy_md.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final NoteRepository noteRepository;
    private final LinkRepository linkRepository;

    @Override
    public DashboardStatsDto getStats(Long userId) {
        long noteCount = noteRepository.countByUserId(userId);
        long linkCount = linkRepository.countBySourceNote_User_Id(userId);
        var recentNotes = noteRepository.findTop5ByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(NoteMapper::toNoteResponseDto)
                .toList();

        return DashboardStatsDto.builder()
                .noteCount(noteCount)
                .linkCount(linkCount)
                .recentNotes(recentNotes)
                .build();
    }
}
