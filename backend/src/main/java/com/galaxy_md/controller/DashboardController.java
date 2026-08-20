package com.galaxy_md.controller;

import com.galaxy_md.dto.DashboardStatsDto;
import com.galaxy_md.security.UserPrincipal;
import com.galaxy_md.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsDto getStats(@AuthenticationPrincipal UserPrincipal principal) {
        return dashboardService.getStats(principal.getId());
    }
}
