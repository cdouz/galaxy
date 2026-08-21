package com.galaxy_md.service;

import com.galaxy_md.dto.GraphLinkDto;
import com.galaxy_md.dto.GraphNodeDto;
import com.galaxy_md.dto.GraphResponseDto;
import com.galaxy_md.mapper.GraphMapper;
import com.galaxy_md.repository.LinkRepository;
import com.galaxy_md.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GraphServiceImpl implements GraphService {

    private final NoteRepository noteRepository;
    private final LinkRepository linkRepository;

    @Override
    @Transactional(readOnly = true)
    public GraphResponseDto getGraph(Long userId) {
        // One query for the notes, one for the links: the whole graph, whatever its size.
        List<GraphNodeDto> nodes = noteRepository.findNotesByUserId(userId)
                .stream()
                .map(GraphMapper::toGraphNodeDto)
                .toList();

        List<GraphLinkDto> links = linkRepository.findGraphLinksByUserId(userId)
                .stream()
                .map(GraphMapper::toGraphLinkDto)
                .toList();

        return GraphResponseDto.builder()
                .nodes(nodes)
                .links(links)
                .build();
    }
}
