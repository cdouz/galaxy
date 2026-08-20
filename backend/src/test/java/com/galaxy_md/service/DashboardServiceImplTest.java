package com.galaxy_md.service;

import com.galaxy_md.dto.DashboardStatsDto;
import com.galaxy_md.entity.Note;
import com.galaxy_md.entity.User;
import com.galaxy_md.repository.LinkRepository;
import com.galaxy_md.repository.NoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private LinkRepository linkRepository;

    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
        dashboardService = new DashboardServiceImpl(noteRepository, linkRepository);
    }

    private Note aNote(Long id, Long userId, String title) {
        return Note.builder().id(id).title(title).content("content").user(User.builder().id(userId).build()).build();
    }

    @Test
    void returnsNoteCountAndRecentNotesForTheGivenUser() {
        when(noteRepository.countByUserId(1L)).thenReturn(7L);
        when(linkRepository.countBySourceNote_User_Id(1L)).thenReturn(3L);
        when(noteRepository.findTop5ByUserIdOrderByUpdatedAtDesc(1L))
                .thenReturn(List.of(aNote(2L, 1L, "Newest"), aNote(1L, 1L, "Older")));

        DashboardStatsDto result = dashboardService.getStats(1L);

        assertThat(result.getNoteCount()).isEqualTo(7L);
        assertThat(result.getLinkCount()).isEqualTo(3L);
        assertThat(result.getRecentNotes()).extracting(dto -> dto.getTitle())
                .containsExactly("Newest", "Older");
    }

    @Test
    void returnsZeroCountAndEmptyRecentNotesWhenUserHasNoNotes() {
        when(noteRepository.countByUserId(1L)).thenReturn(0L);
        when(linkRepository.countBySourceNote_User_Id(1L)).thenReturn(0L);
        when(noteRepository.findTop5ByUserIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of());

        DashboardStatsDto result = dashboardService.getStats(1L);

        assertThat(result.getNoteCount()).isZero();
        assertThat(result.getLinkCount()).isZero();
        assertThat(result.getRecentNotes()).isEmpty();
    }
}
