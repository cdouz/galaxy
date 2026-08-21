package com.galaxy_md.service;

import com.galaxy_md.dto.BacklinkResponseDto;
import com.galaxy_md.entity.Link;
import com.galaxy_md.entity.Note;
import com.galaxy_md.entity.User;
import com.galaxy_md.repository.LinkRepository;
import com.galaxy_md.repository.NoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LinkServiceImplTest {

    @Mock
    private LinkRepository linkRepository;

    @Mock
    private NoteRepository noteRepository;

    private LinkServiceImpl linkService;

    @BeforeEach
    void setUp() {
        linkService = new LinkServiceImpl(linkRepository, noteRepository);
    }

    private User aUser(Long id) {
        return User.builder().id(id).username("alice").email("alice@example.com").passwordHash("hashed").build();
    }

    private Note aNote(Long id, User user, String title, String content) {
        return Note.builder().id(id).title(title).content(content).user(user).build();
    }

    @Test
    void resolvesExistingTitlesAndCreatesLinks() {
        User user = aUser(1L);
        Note target = aNote(2L, user, "Target", "");
        Note source = aNote(1L, user, "Source", "See [[Target]]");

        when(noteRepository.findByUserIdAndTitleIn(1L, Set.of("Target"))).thenReturn(List.of(target));
        when(linkRepository.findBySourceNoteId(1L)).thenReturn(List.of());

        linkService.syncLinks(source);

        ArgumentCaptor<List<Link>> captor = ArgumentCaptor.forClass(List.class);
        verify(linkRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(1);
        assertThat(captor.getValue().get(0).getSourceNote()).isEqualTo(source);
        assertThat(captor.getValue().get(0).getTargetNote()).isEqualTo(target);
        verify(linkRepository, never()).deleteAll(any());
    }

    @Test
    void skipsUnresolvedTitles() {
        User user = aUser(1L);
        Note source = aNote(1L, user, "Source", "See [[Missing]]");

        when(noteRepository.findByUserIdAndTitleIn(1L, Set.of("Missing"))).thenReturn(List.of());
        when(linkRepository.findBySourceNoteId(1L)).thenReturn(List.of());

        linkService.syncLinks(source);

        verify(linkRepository, never()).saveAll(any());
        verify(linkRepository, never()).deleteAll(any());
    }

    @Test
    void excludesSelfLinks() {
        User user = aUser(1L);
        Note source = aNote(1L, user, "Source", "See [[Source]]");

        when(noteRepository.findByUserIdAndTitleIn(1L, Set.of("Source"))).thenReturn(List.of(source));
        when(linkRepository.findBySourceNoteId(1L)).thenReturn(List.of());

        linkService.syncLinks(source);

        verify(linkRepository, never()).saveAll(any());
        verify(linkRepository, never()).deleteAll(any());
    }

    @Test
    void removesStaleLinksNoLongerPresentInContent() {
        User user = aUser(1L);
        Note staleTarget = aNote(3L, user, "Stale", "");
        Note source = aNote(1L, user, "Source", "no links here anymore");
        Link staleLink = Link.builder().id(99L).sourceNote(source).targetNote(staleTarget).build();

        when(linkRepository.findBySourceNoteId(1L)).thenReturn(List.of(staleLink));

        linkService.syncLinks(source);

        ArgumentCaptor<List<Link>> captor = ArgumentCaptor.forClass(List.class);
        verify(linkRepository).deleteAll(captor.capture());
        assertThat(captor.getValue()).containsExactly(staleLink);
        verify(linkRepository, never()).saveAll(any());
    }

    @Test
    void keepsLinksStillPresentAndOnlyAddsNewOnes() {
        User user = aUser(1L);
        Note keptTarget = aNote(2L, user, "Kept", "");
        Note newTarget = aNote(3L, user, "New", "");
        Note source = aNote(1L, user, "Source", "See [[Kept]] and [[New]]");
        Link existingLink = Link.builder().id(1L).sourceNote(source).targetNote(keptTarget).build();

        when(noteRepository.findByUserIdAndTitleIn(1L, Set.of("Kept", "New"))).thenReturn(List.of(keptTarget, newTarget));
        when(linkRepository.findBySourceNoteId(1L)).thenReturn(List.of(existingLink));

        linkService.syncLinks(source);

        verify(linkRepository, never()).deleteAll(any());
        ArgumentCaptor<List<Link>> captor = ArgumentCaptor.forClass(List.class);
        verify(linkRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).hasSize(1);
        assertThat(captor.getValue().get(0).getTargetNote()).isEqualTo(newTarget);
    }

    @Test
    void returnsSourceNotesThatLinkToTheGivenTarget() {
        User user = aUser(1L);
        Note target = aNote(2L, user, "Target", "");
        Note source = aNote(1L, user, "Source", "See [[Target]]");
        Link link = Link.builder().id(1L).sourceNote(source).targetNote(target).build();

        when(linkRepository.findByTargetNoteIdAndTargetNote_User_Id(2L, 1L)).thenReturn(List.of(link));

        List<BacklinkResponseDto> result = linkService.getBacklinks(2L, 1L);

        assertThat(result).extracting(BacklinkResponseDto::getTitle).containsExactly("Source");
    }

    @Test
    void returnsNoBacklinksForANoteBelongingToSomeoneElse() {
        when(linkRepository.findByTargetNoteIdAndTargetNote_User_Id(2L, 99L)).thenReturn(List.of());

        assertThat(linkService.getBacklinks(2L, 99L)).isEmpty();
    }
}
