package com.galaxy_md.service;

import com.galaxy_md.entity.Link;
import com.galaxy_md.entity.Note;
import com.galaxy_md.repository.LinkRepository;
import com.galaxy_md.repository.NoteRepository;
import com.galaxy_md.util.WikiLinkParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LinkServiceImpl implements LinkService {

    private final LinkRepository linkRepository;
    private final NoteRepository noteRepository;

    @Override
    public void syncLinks(Note sourceNote) {
        Set<String> titles = WikiLinkParser.extractTitles(sourceNote.getContent());

        Set<Long> resolvedTargetIds = titles.stream()
                .map(title -> noteRepository.findByUserIdAndTitle(sourceNote.getUser().getId(), title))
                .flatMap(Optional::stream)
                .map(Note::getId)
                .filter(targetId -> !targetId.equals(sourceNote.getId()))
                .collect(Collectors.toSet());

        List<Link> existingLinks = linkRepository.findBySourceNoteId(sourceNote.getId());
        Set<Long> existingTargetIds = existingLinks.stream()
                .map(link -> link.getTargetNote().getId())
                .collect(Collectors.toSet());

        List<Link> linksToRemove = existingLinks.stream()
                .filter(link -> !resolvedTargetIds.contains(link.getTargetNote().getId()))
                .toList();

        List<Link> linksToAdd = resolvedTargetIds.stream()
                .filter(targetId -> !existingTargetIds.contains(targetId))
                .map(targetId -> Link.builder()
                        .sourceNote(sourceNote)
                        .targetNote(noteRepository.getReferenceById(targetId))
                        .build())
                .toList();

        if (!linksToRemove.isEmpty()) {
            linkRepository.deleteAll(linksToRemove);
        }
        if (!linksToAdd.isEmpty()) {
            linkRepository.saveAll(linksToAdd);
        }
    }
}
