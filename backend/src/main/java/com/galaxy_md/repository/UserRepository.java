package com.galaxy_md.repository;

import com.galaxy_md.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    /** Incremented in the database so concurrent logouts cannot lose a bump. */
    @Modifying
    @Query("update User u set u.tokenVersion = u.tokenVersion + 1 where u.id = :userId")
    void incrementTokenVersion(@Param("userId") Long userId);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
