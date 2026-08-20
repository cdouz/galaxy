package com.galaxy_md.repository;

import com.galaxy_md.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findNotesByUserId(Long userId);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
    Optional<Note> findByUserIdAndTitle(Long userId, String title);
    boolean existsByUserIdAndTitle(Long userId, String title);
    boolean existsByUserIdAndTitleAndIdNot(Long userId, String title, Long id);
    long countByUserId(Long userId);
    List<Note> findTop5ByUserIdOrderByUpdatedAtDesc(Long userId);
    List<Note> findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCaseOrderByUpdatedAtDesc(
            Long userId1, String title, Long userId2, String content);
}
