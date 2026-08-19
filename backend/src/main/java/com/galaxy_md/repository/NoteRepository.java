package com.galaxy_md.repository;

import com.galaxy_md.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findNotesByUserId(Long userId);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndTitle(Long userId, String title);
    boolean existsByUserIdAndTitleAndIdNot(Long userId, String title, Long id);
    long countByUserId(Long userId);
    List<Note> findTop5ByUserIdOrderByUpdatedAtDesc(Long userId);
}
