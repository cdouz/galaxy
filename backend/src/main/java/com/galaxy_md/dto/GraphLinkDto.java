package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * An edge of the graph. Both ends are note ids, named after what
 * react-force-graph expects on the client rather than after the entity.
 */
@Getter
@Builder
public class GraphLinkDto {
    private Long source;
    private Long target;
}
