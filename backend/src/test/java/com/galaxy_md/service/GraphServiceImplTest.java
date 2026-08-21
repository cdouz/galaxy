package com.galaxy_md.service;

import com.galaxy_md.dto.GraphLinkDto;
import com.galaxy_md.dto.GraphResponseDto;
import com.galaxy_md.entity.Link;
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
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GraphServiceImplTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private LinkRepository linkRepository;

    private GraphServiceImpl graphService;

    @BeforeEach
    void setUp() {
        graphService = new GraphServiceImpl(noteRepository, linkRepository);
    }

    private Note aNote(Long id, Long userId, String title) {
        return Note.builder().id(id).title(title).content("content").user(User.builder().id(userId).build()).build();
    }

    private Link aLink(Note source, Note target) {
        return Link.builder().sourceNote(source).targetNote(target).build();
    }

    @Test
    void returnsOneNodePerNoteAndOneLinkPerEdge() {
        Note first = aNote(1L, 1L, "First");
        Note second = aNote(2L, 1L, "Second");
        when(noteRepository.findNotesByUserId(1L)).thenReturn(List.of(first, second));
        when(linkRepository.findGraphLinksByUserId(1L)).thenReturn(List.of(aLink(first, second)));

        GraphResponseDto result = graphService.getGraph(1L);

        assertThat(result.getNodes())
                .extracting(node -> node.getId(), node -> node.getTitle())
                .containsExactly(tuple(1L, "First"), tuple(2L, "Second"));
        assertThat(result.getLinks())
                .extracting(GraphLinkDto::getSource, GraphLinkDto::getTarget)
                .containsExactly(tuple(1L, 2L));
    }

    @Test
    void returnsEmptyNodesAndLinksWhenUserHasNoNotes() {
        when(noteRepository.findNotesByUserId(1L)).thenReturn(List.of());
        when(linkRepository.findGraphLinksByUserId(1L)).thenReturn(List.of());

        GraphResponseDto result = graphService.getGraph(1L);

        assertThat(result.getNodes()).isEmpty();
        assertThat(result.getLinks()).isEmpty();
    }

    @Test
    void returnsIsolatedNodesWhenNotesHaveNoLinks() {
        when(noteRepository.findNotesByUserId(1L)).thenReturn(List.of(aNote(1L, 1L, "Lonely")));
        when(linkRepository.findGraphLinksByUserId(1L)).thenReturn(List.of());

        GraphResponseDto result = graphService.getGraph(1L);

        assertThat(result.getNodes()).hasSize(1);
        assertThat(result.getLinks()).isEmpty();
    }

    @Test
    void queriesBothRepositoriesWithTheCallersUserId() {
        when(noteRepository.findNotesByUserId(42L)).thenReturn(List.of(aNote(9L, 42L, "Mine")));
        when(linkRepository.findGraphLinksByUserId(42L)).thenReturn(List.of());

        GraphResponseDto result = graphService.getGraph(42L);

        // Both stubs are keyed on 42L: any other id would return null and blow up here.
        assertThat(result.getNodes()).extracting(node -> node.getTitle()).containsExactly("Mine");
    }
}
