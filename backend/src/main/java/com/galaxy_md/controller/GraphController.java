package com.galaxy_md.controller;

import com.galaxy_md.dto.GraphResponseDto;
import com.galaxy_md.security.UserPrincipal;
import com.galaxy_md.service.GraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/graph")
@RequiredArgsConstructor
public class GraphController {

    private final GraphService graphService;

    @GetMapping
    public GraphResponseDto getGraph(@AuthenticationPrincipal UserPrincipal principal) {
        return graphService.getGraph(principal.getId());
    }
}
