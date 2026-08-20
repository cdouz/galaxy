package com.galaxy_md.repository;

import com.galaxy_md.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findBySourceNoteId(Long sourceNoteId);
    List<Link> findByTargetNoteId(Long targetNoteId);
    long countBySourceNote_User_Id(Long userId);
}
