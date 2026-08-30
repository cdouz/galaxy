package com.galaxy_md.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Jeu d'essai du parsing des wikilinks. Chaque ligne de {@link #extractsExpectedTitles}
 * correspond a un cas du plan de tests : contenu en entree, titres attendus en sortie.
 * Le mot-cle NONE signifie « aucun titre extrait ».
 */
class WikiLinkParserTest {

    private static final String NONE = "NONE";

    @DisplayName("extraction des titres selon le contenu")
    @ParameterizedTest(name = "[{index}] {0}")
    @CsvSource(delimiter = '|', quoteCharacter = '"', value = {
            "lien simple                        | Voir [[Alpha]] pour la suite      | Alpha",
            "deux liens sur la meme ligne       | [[Alpha]] et [[Beta]]             | Alpha;Beta",
            "lien colle au texte                | voir[[Alpha]]maintenant           | Alpha",
            "espaces internes conserves         | [[Ma note a moi]]                 | Ma note a moi",
            "espaces autour du titre supprimes  | \"[[  Alpha  ]]\"                 | Alpha",
            "titre vide ignore                  | Voir [[]] ici                     | NONE",
            "titre uniquement blanc ignore      | \"Voir [[   ]] ici\"               | NONE",
            "doublon deduplique                 | [[Alpha]] puis encore [[Alpha]]   | Alpha",
            "casse preservee (titres distincts) | [[Alpha]] et [[alpha]]            | Alpha;alpha",
            "crochet simple non reconnu         | Voir [Alpha] ici                  | NONE",
            "crochets non fermes                | Voir [[Alpha] ici                 | NONE",
            "crochets imbriques : lien interne  | [[Alpha [[Beta]]]]                | Beta",
            "contenu sans aucun lien            | juste du texte sans lien          | NONE",
            "limite connue : lien en code inline| `[[Alpha]]`                       | Alpha",
    })
    void extractsExpectedTitles(String caseName, String content, String expected) {
        Set<String> titles = WikiLinkParser.extractTitles(content);

        if (NONE.equals(expected)) {
            assertThat(titles).as(caseName).isEmpty();
        } else {
            assertThat(titles).as(caseName).containsExactlyElementsOf(Arrays.asList(expected.split(";")));
        }
    }

    @DisplayName("contenu absent ou vide")
    @ParameterizedTest(name = "[{index}] contenu = \"{0}\"")
    @NullSource
    @ValueSource(strings = {"", "   ", "\n\n"})
    void returnsNoTitleWhenThereIsNoContent(String content) {
        assertThat(WikiLinkParser.extractTitles(content)).isEmpty();
    }

    @Test
    void extractsLinksSpreadOverSeveralLines() {
        String content = """
                # Ma note

                Un renvoi vers [[Alpha]].

                Et plus bas un autre vers [[Beta]].
                """;

        assertThat(WikiLinkParser.extractTitles(content)).containsExactly("Alpha", "Beta");
    }

    @Test
    void keepsTitlesInTheirOrderOfAppearance() {
        String content = "[[Gamma]] puis [[Alpha]] puis [[Beta]]";

        assertThat(List.copyOf(WikiLinkParser.extractTitles(content)))
                .containsExactly("Gamma", "Alpha", "Beta");
    }

    @Test
    void keepsTheFirstPositionOfADuplicatedTitle() {
        String content = "[[Gamma]] puis [[Alpha]] puis a nouveau [[Gamma]]";

        assertThat(List.copyOf(WikiLinkParser.extractTitles(content)))
                .containsExactly("Gamma", "Alpha");
    }
}
