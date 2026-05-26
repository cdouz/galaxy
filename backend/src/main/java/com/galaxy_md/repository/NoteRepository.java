package com.galaxy_md.repository;

import com.galaxy_md.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Note findByTitre(String titre);
    List<Note> findNotesByUserId(Long userId);
}
