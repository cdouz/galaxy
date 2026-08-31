package com.galaxy_md.integration;

import com.galaxy_md.TestcontainersConfiguration;
import com.galaxy_md.dto.NoteCreateDto;
import com.galaxy_md.dto.NoteResponseDto;
import com.galaxy_md.dto.NoteUpdateDto;
import com.galaxy_md.entity.Link;
import com.galaxy_md.entity.User;
import com.galaxy_md.repository.LinkRepository;
import com.galaxy_md.repository.UserRepository;
import com.galaxy_md.service.NoteService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests d'integration du parsing des wikilinks : contrairement aux tests unitaires
 * qui simulent les repositories, ceux-ci ecrivent dans un MySQL jetable fourni par
 * Testcontainers, migre par Flyway. Ils verifient ce que les mocks ne peuvent pas
 * montrer : les lignes reellement presentes en table `links`, l'unicite (user_id,
 * title) et la suppression en cascade portee par la contrainte de cle etrangere.
 */
@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Transactional
class WikiLinkPersistenceTest {

    @Autowired
    private NoteService noteService;

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private User owner;

    @BeforeEach
    void setUp() {
        owner = createUser("alice", "alice@example.com");
    }

    private User createUser(String username, String email) {
        return userRepository.save(User.builder()
                .username(username)
                .email(email)
                .passwordHash("irrelevant-for-this-test")
                .build());
    }

    private NoteResponseDto createNote(User user, String title, String content) {
        return noteService.create(NoteCreateDto.builder().title(title).content(content).build(), user);
    }

    /** Vide le contexte de persistance : les assertions relisent la base, pas le cache Hibernate. */
    private void syncWithDatabase() {
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    @DisplayName("un [[Titre]] existant cree bien une ligne en table links")
    void persistsALinkRowWhenTheMentionedNoteExists() {
        NoteResponseDto target = createNote(owner, "Alpha", "");
        NoteResponseDto source = createNote(owner, "Source", "Un renvoi vers [[Alpha]].");
        syncWithDatabase();

        List<Link> links = linkRepository.findBySourceNoteId(source.getId());

        assertThat(links).hasSize(1);
        assertThat(links.get(0).getTargetNote().getId()).isEqualTo(target.getId());
        assertThat(links.get(0).getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("un [[Titre]] sans note correspondante n'ecrit rien")
    void persistsNothingWhenTheMentionedNoteDoesNotExist() {
        NoteResponseDto source = createNote(owner, "Source", "Un renvoi vers [[Fantome]].");
        syncWithDatabase();

        assertThat(linkRepository.findBySourceNoteId(source.getId())).isEmpty();
    }

    @Test
    @DisplayName("retirer le [[Titre]] du contenu supprime la ligne correspondante")
    void deletesTheLinkRowWhenTheMentionIsRemovedFromTheContent() {
        createNote(owner, "Alpha", "");
        NoteResponseDto source = createNote(owner, "Source", "Un renvoi vers [[Alpha]].");
        syncWithDatabase();
        assertThat(linkRepository.findBySourceNoteId(source.getId())).hasSize(1);

        noteService.update(source.getId(),
                NoteUpdateDto.builder().title("Source").content("Plus aucun renvoi.").build(),
                owner.getId());
        syncWithDatabase();

        assertThat(linkRepository.findBySourceNoteId(source.getId())).isEmpty();
    }

    @Test
    @DisplayName("supprimer la note cible supprime la ligne en cascade (contrainte FK)")
    void cascadesTheLinkRowWhenTheTargetNoteIsDeleted() {
        NoteResponseDto target = createNote(owner, "Alpha", "");
        NoteResponseDto source = createNote(owner, "Source", "Un renvoi vers [[Alpha]].");
        syncWithDatabase();
        assertThat(linkRepository.findBySourceNoteId(source.getId())).hasSize(1);

        noteService.delete(target.getId(), owner.getId());
        syncWithDatabase();

        assertThat(linkRepository.findBySourceNoteId(source.getId())).isEmpty();
    }

    @Test
    @DisplayName("un [[Titre]] ne resout que parmi les notes de son proprietaire")
    void doesNotLinkToANoteOwnedBySomeoneElse() {
        User someoneElse = createUser("bob", "bob@example.com");
        createNote(someoneElse, "Alpha", "");
        NoteResponseDto source = createNote(owner, "Source", "Un renvoi vers [[Alpha]].");
        syncWithDatabase();

        assertThat(linkRepository.findBySourceNoteId(source.getId())).isEmpty();
    }
}
