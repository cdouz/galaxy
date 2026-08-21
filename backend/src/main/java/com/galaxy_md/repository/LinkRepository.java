package com.galaxy_md.repository;

import com.galaxy_md.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findBySourceNoteId(Long sourceNoteId);
    List<Link> findByTargetNoteIdAndTargetNote_User_Id(Long targetNoteId, Long userId);
    long countBySourceNote_User_Id(Long userId);

    /**
     * Both ends are scoped to the owner: strict isolation, and a guarantee that every
     * edge the client receives has both of its nodes in the node list.
     * <p>
     * The join fetch is not decoration. Both associations are EAGER @ManyToOne, so a
     * derived query would load the notes through one secondary select per link.
     */
    @Query("select l from Link l join fetch l.sourceNote join fetch l.targetNote "
            + "where l.sourceNote.user.id = :userId and l.targetNote.user.id = :userId")
    List<Link> findGraphLinksByUserId(@Param("userId") Long userId);
}
