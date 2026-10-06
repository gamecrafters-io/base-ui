import type { CodeEditorAppearance, CodeEditorBaseTheme } from "./CodeEditor.types";

// The name the theme is defined under. Monaco paints every editor on the page alike, so there is
// one theme to a page rather than one to an editor: it is defined once under this name and
// defined again as the scheme changes, rather than defined afresh by each editor
export const CODE_EDITOR_THEME = "base-ui";

const BASE_THEMES: readonly CodeEditorBaseTheme[] = ["vs", "vs-dark", "hc-light", "hc-black"];

const DEFAULT_BASE_THEME: CodeEditorBaseTheme = "vs";

// Which custom property each of Monaco's colours is read from. The names on the left are
// Monaco's own, and the properties on the right are declared in the stylesheet from the design
// tokens, so a caller repainting one editor sets a property rather than defining a theme
const COLOR_PROPERTIES = {
    "editor.background": "--code-editor-background-color",
    "editor.foreground": "--code-editor-foreground-color",
    "editorCursor.foreground": "--code-editor-cursor-color",
    "editor.selectionBackground": "--code-editor-selection-background-color",
    "editor.inactiveSelectionBackground": "--code-editor-selection-background-color",
    "editor.lineHighlightBackground": "--code-editor-active-line-background-color",
    "editor.lineHighlightBorder": "--code-editor-active-line-background-color",
    "editorGutter.background": "--code-editor-gutter-background-color",
    "editorLineNumber.foreground": "--code-editor-line-number-color",
    "editorLineNumber.activeForeground": "--code-editor-active-line-number-color",
    "editorBracketMatch.border": "--code-editor-matching-bracket-color",
    "editorIndentGuide.background1": "--code-editor-guide-color",
    "editorIndentGuide.activeBackground1": "--code-editor-active-guide-color",
    "editorWhitespace.foreground": "--code-editor-guide-color",
    "editorWidget.background": "--code-editor-widget-background-color",
    "editorWidget.foreground": "--code-editor-foreground-color",
    "editorWidget.border": "--code-editor-widget-border-color",
    "editorSuggestWidget.selectedBackground": "--code-editor-widget-selected-background-color",
    "editorHoverWidget.background": "--code-editor-widget-background-color",
    "editorHoverWidget.border": "--code-editor-widget-border-color",
    focusBorder: "--code-editor-focus-color",
    "editorError.foreground": "--code-editor-error-color",
    "editorWarning.foreground": "--code-editor-warning-color",
    "editorInfo.foreground": "--code-editor-info-color",
    "diffEditor.insertedLineBackground": "--code-editor-inserted-line-background-color",
    "diffEditor.removedLineBackground": "--code-editor-removed-line-background-color",
    "diffEditor.insertedTextBackground": "--code-editor-inserted-text-background-color",
    "diffEditor.removedTextBackground": "--code-editor-removed-text-background-color",
} as const;

// Which custom property each kind of token is coloured from. The kinds are the ones Monaco's
// grammars name, and a rule for a kind covers everything written under it, so `string` colours
// `string.escape` as well. They are laid over the eight colours the design system colours code
// with: a tag and a JSON key are coloured as GitHub colours them, which is apart from the rest
const TOKEN_PROPERTIES = {
    comment: "--code-editor-syntax-comment-color",
    keyword: "--code-editor-syntax-keyword-color",
    string: "--code-editor-syntax-string-color",
    "string.key.json": "--code-editor-syntax-tag-color",
    number: "--code-editor-syntax-constant-color",
    regexp: "--code-editor-syntax-constant-color",
    constant: "--code-editor-syntax-constant-color",
    type: "--code-editor-syntax-entity-color",
    namespace: "--code-editor-syntax-entity-color",
    annotation: "--code-editor-syntax-entity-color",
    tag: "--code-editor-syntax-tag-color",
    metatag: "--code-editor-syntax-keyword-color",
    key: "--code-editor-syntax-tag-color",
    "attribute.name": "--code-editor-syntax-entity-color",
    "attribute.value": "--code-editor-syntax-string-color",
    variable: "--code-editor-syntax-variable-color",
    predefined: "--code-editor-syntax-support-color",
    invalid: "--code-editor-syntax-invalid-color",
} as const;

// A colour as Monaco reads one: six hexadecimal digits, or eight where the last two say how far
// through it can be seen. Three or four digits are written out to six or eight, since a token's
// colour is held to the long form. Anything else is left alone rather than guessed at, so a
// property that was never given a value keeps Monaco's own colour instead of drawing it black
const readColor = (value: string): string | undefined => {
    const color = value.trim().toLowerCase();

    if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(color)) return color;

    if (/^#[0-9a-f]{3,4}$/.test(color)) {
        return `#${[...color.slice(1)].map((digit) => digit + digit).join("")}`;
    }

    return undefined;
};

const readBaseTheme = (value: string): CodeEditorBaseTheme => {
    const base = value.trim() as CodeEditorBaseTheme;

    return BASE_THEMES.includes(base) ? base : DEFAULT_BASE_THEME;
};

// A length in pixels, which is how a computed size comes back. Anything that is not one, such as
// a line height left at `normal`, is left to Monaco
const readLength = (value: string): number | undefined => {
    const length = Number.parseFloat(value);

    return Number.isFinite(length) && length > 0 ? length : undefined;
};

// What the stylesheet says the editor standing in this element is drawn like. Only the colours
// that were actually given a value are named in what comes back, so everything else falls to the
// theme the colours are laid over. The font is read off the element itself, which the stylesheet
// sets in the face and the size the library's listings are set in
export const readCodeEditorAppearance = (element: HTMLElement): CodeEditorAppearance => {
    const styles = getComputedStyle(element);
    const colors: Record<string, string> = {};
    const rules: CodeEditorAppearance["rules"] = [];

    for (const [name, property] of Object.entries(COLOR_PROPERTIES)) {
        const color = readColor(styles.getPropertyValue(property));

        if (color) {
            colors[name] = color;
        }
    }

    for (const [token, property] of Object.entries(TOKEN_PROPERTIES)) {
        const color = readColor(styles.getPropertyValue(property));

        if (color) {
            // A token's colour is written without the hash and without how far through it can be
            // seen, which is the one form Monaco takes a token colour in
            rules.push({ token, foreground: color.slice(1, 7) });
        }
    }

    return {
        base: readBaseTheme(styles.getPropertyValue("--code-editor-base-theme")),
        colors,
        rules,
        fontFamily: styles.fontFamily || undefined,
        fontSize: readLength(styles.fontSize),
        lineHeight: readLength(styles.lineHeight),
    };
};
