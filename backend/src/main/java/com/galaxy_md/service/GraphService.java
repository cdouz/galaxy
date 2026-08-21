package com.galaxy_md.service;

import com.galaxy_md.dto.GraphResponseDto;

public interface GraphService {
    GraphResponseDto getGraph(Long userId);
}
