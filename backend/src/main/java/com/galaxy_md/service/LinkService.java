package com.galaxy_md.service;

import com.galaxy_md.dto.BacklinkResponseDto;
import com.galaxy_md.entity.Note;

import java.util.List;

public interface LinkService {
    void syncLinks(Note sourceNote);

    List<BacklinkResponseDto> getBacklinks(Long targetNoteId, Long userId);
}
