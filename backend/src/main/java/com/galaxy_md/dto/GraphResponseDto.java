package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GraphResponseDto {
    private List<GraphNodeDto> nodes;
    private List<GraphLinkDto> links;
}
