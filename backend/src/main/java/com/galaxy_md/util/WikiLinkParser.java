package com.galaxy_md.util;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class WikiLinkParser {

    private static final Pattern WIKILINK_PATTERN = Pattern.compile("\\[\\[([^\\[\\]]+)\\]\\]");

    private WikiLinkParser() {
    }

    public static Set<String> extractTitles(String content) {
        Set<String> titles = new LinkedHashSet<>();
        if (content == null || content.isBlank()) {
            return titles;
        }

        Matcher matcher = WIKILINK_PATTERN.matcher(content);
        while (matcher.find()) {
            String title = matcher.group(1).trim();
            if (!title.isEmpty()) {
                titles.add(title);
            }
        }

        return titles;
    }
}
