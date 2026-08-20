package com.galaxy_md.service;

import com.galaxy_md.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getStats(Long userId);
}
