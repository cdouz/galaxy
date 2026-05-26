package com.galaxy_md.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column
    private String contenu;

    @Column
    private String titre;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
