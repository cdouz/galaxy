package com.galaxy_md.mapper;

import com.galaxy_md.dto.GraphLinkDto;
import com.galaxy_md.dto.GraphNodeDto;
import com.galaxy_md.entity.Link;
import com.galaxy_md.entity.Note;

/** Static mapping helpers; not a bean, nothing here needs the container. */
public final class GraphMapper {

    private GraphMapper() {
    }

    public static GraphNodeDto toGraphNodeDto(Note note) {
        return GraphNodeDto
                .builder()
                .id(note.getId())
                .title(note.getTitle())
                .build();
    }

    public static GraphLinkDto toGraphLinkDto(Link link) {
        return GraphLinkDto
                .builder()
                .source(link.getSourceNote().getId())
                .target(link.getTargetNote().getId())
                .build();
    }
}
