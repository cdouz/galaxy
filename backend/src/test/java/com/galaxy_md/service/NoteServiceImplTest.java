package com.galaxy_md.service;

import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.dto.NoteUpdateDto;
import com.galaxy_md.entity.Note;
import com.galaxy_md.entity.User;
import com.galaxy_md.exception.NoteNotFoundException;
import com.galaxy_md.exception.NoteTitleAlreadyExistsException;
import com.galaxy_md.repository.NoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NoteServiceImplTest {

    @Mock
    private NoteRepository noteRepository;

    private NoteServiceImpl noteService;

    @BeforeEach
    void setUp() {
        noteService = new NoteServiceImpl(noteRepository);
    }

    private User aUser() {
        return User.builder().id(1L).username("alice").email("alice@example.com").passwordHash("hashed").build();
    }

    private Note aNote(Long id, Long userId, String title) {
        return Note.builder().id(id).title(title).content("content").user(User.builder().id(userId).build()).build();
    }

    @Test
    void createsANoteForTheOwningUser() {
        User user = aUser();
        NoteCreateDto dto = NoteCreateDto.builder().title("My note").content("hello").build();
        when(noteRepository.existsByUserIdAndTitle(1L, "My note")).thenReturn(false);
        when(noteRepository.save(any(Note.class))).thenAnswer(invocation -> {
            Note note = invocation.getArgument(0);
            note.setId(10L);
            return note;
        });

        NoteResponseDto result = noteService.create(dto, user);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getTitle()).isEqualTo("My note");

        ArgumentCaptor<Note> captor = ArgumentCaptor.forClass(Note.class);
        verify(noteRepository).save(captor.capture());
        assertThat(captor.getValue().getUser()).isEqualTo(user);
    }

    @Test
    void rejectsCreateWhenTitleAlreadyExistsForUser() {
        User user = aUser();
        NoteCreateDto dto = NoteCreateDto.builder().title("My note").content("hello").build();
        when(noteRepository.existsByUserIdAndTitle(1L, "My note")).thenReturn(true);

        assertThatThrownBy(() -> noteService.create(dto, user))
                .isInstanceOf(NoteTitleAlreadyExistsException.class);

        verify(noteRepository, never()).save(any());
    }

    @Test
    void returnsAllNotesForTheGivenUser() {
        when(noteRepository.findNotesByUserId(1L)).thenReturn(List.of(aNote(1L, 1L, "First"), aNote(2L, 1L, "Second")));

        List<NoteResponseDto> result = noteService.getAllNotesFromUser(1L);

        assertThat(result).extracting(NoteResponseDto::getTitle).containsExactly("First", "Second");
    }

    @Test
    void returnsANoteOwnedByTheUser() {
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(aNote(1L, 1L, "First")));

        NoteResponseDto result = noteService.getById(1L, 1L);

        assertThat(result.getTitle()).isEqualTo("First");
    }

    @Test
    void rejectsGetWhenNoteIsNotFoundOrNotOwned() {
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> noteService.getById(1L, 1L))
                .isInstanceOf(NoteNotFoundException.class);
    }

    @Test
    void updatesAnOwnedNote() {
        Note existing = aNote(1L, 1L, "Old title");
        NoteUpdateDto dto = NoteUpdateDto.builder().title("New title").content("new content").build();
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existing));
        when(noteRepository.existsByUserIdAndTitleAndIdNot(1L, "New title", 1L)).thenReturn(false);
        when(noteRepository.save(any(Note.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NoteResponseDto result = noteService.update(1L, dto, 1L);

        assertThat(result.getTitle()).isEqualTo("New title");
        assertThat(result.getContent()).isEqualTo("new content");
    }

    @Test
    void rejectsUpdateWhenTitleAlreadyExistsForUser() {
        Note existing = aNote(1L, 1L, "Old title");
        NoteUpdateDto dto = NoteUpdateDto.builder().title("Taken title").content("new content").build();
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existing));
        when(noteRepository.existsByUserIdAndTitleAndIdNot(1L, "Taken title", 1L)).thenReturn(true);

        assertThatThrownBy(() -> noteService.update(1L, dto, 1L))
                .isInstanceOf(NoteTitleAlreadyExistsException.class);

        verify(noteRepository, never()).save(any());
    }

    @Test
    void rejectsUpdateWhenNoteIsNotFoundOrNotOwned() {
        NoteUpdateDto dto = NoteUpdateDto.builder().title("New title").content("new content").build();
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> noteService.update(1L, dto, 1L))
                .isInstanceOf(NoteNotFoundException.class);
    }

    @Test
    void deletesAnOwnedNote() {
        Note existing = aNote(1L, 1L, "Title");
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(existing));

        noteService.delete(1L, 1L);

        verify(noteRepository).delete(existing);
    }

    @Test
    void rejectsDeleteWhenNoteIsNotFoundOrNotOwned() {
        when(noteRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> noteService.delete(1L, 1L))
                .isInstanceOf(NoteNotFoundException.class);
    }
}
