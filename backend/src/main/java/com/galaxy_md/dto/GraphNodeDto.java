package com.galaxy_md.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GraphNodeDto {
    private Long id;
    private String title;
}
