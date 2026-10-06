import type * as React from "react";
import type {
    CodeDiffEditorInstance,
    CodeDiffEditorOptions,
    CodeEditorChangeEvent,
    CodeEditorInstance,
    CodeEditorMarker,
    CodeEditorOptions,
    Monaco,
} from "../../lib/code-editor";

// What becomes of a line too long for the editor: it runs on to the next one, or it keeps the
// length it was written at and is left to be scrolled to
export type CodeEditorWrap = "wrap" | "nowrap";

// Which of Monaco's own themes the colours read from the stylesheet are laid over. The two it
// ships for most pages, and the two high contrast ones
export type CodeEditorBaseTheme = "vs" | "vs-dark" | "hc-light" | "hc-black";

// What the stylesheet says an editor is drawn like, read off the element and handed to Monaco.
// The colours are named the way Monaco names them, and the rules colour each kind of token the
// grammars find; the font is what Monaco measures the text in, since it lays the lines out itself
// rather than leaving them to the page
export type CodeEditorAppearance = {
    base: CodeEditorBaseTheme;
    colors: Record<string, string>;
    rules: { token: string; foreground: string }[];
    fontFamily?: string;
    fontSize?: number;
    lineHeight?: number;
};

// What both editors take around the text: how the frame stands and what is drawn beside the lines
type CodeEditorFrameProps = {
    // How wide the editor stands. A number is read as pixels, and anything else is passed to CSS
    // as it was written, so an editor can be given a size in whatever units the page is laid out
    // in. Left out, it is as wide as whatever it was put in, the way anything else on the page is
    width?: number | string;
    // How tall the editor stands, on the same terms. It is the one measurement an editor cannot
    // work out for itself: it is drawn to the room it is given, and given none it would be drawn
    // to nothing at all, so left out it falls back to a height of the stylesheet's own
    height?: number | string;
    // Numbers the lines in a gutter beside the text
    showLineNumbers?: boolean;
    // Draws the whole text small down the right edge, as a map of where the reader is in it
    showMinimap?: boolean;
    // Whether a line too long for the editor runs on to the next one or is left to be scrolled to
    wrap?: CodeEditorWrap;
    // How many columns a tab stands for
    tabSize?: number;
    // What stands in the frame until Monaco has been fetched and the editor built
    loading?: React.ReactNode;
    // Whether the models the editor made are left standing when it goes, so that an editor
    // opened again on the same paths finds what was written
    keepModels?: boolean;
    // Anything attached to the editor, which reaches it through `useCodeEditor` once it stands
    children?: React.ReactNode;
    className?: string;
};

export type CodeEditorProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue"
> &
    CodeEditorFrameProps & {
        // The text the editor shows, written in whenever it differs from what is there; or the
        // text it starts with, read once and left to the editor from then on
        value?: string;
        defaultValue?: string;
        // The language the text is read under, by the name Monaco knows it: "typescript", "json",
        // "css" and so on. Left out, the text is plain
        language?: string;
        // What the text is named, as a path. A path names the text rather than the editor, so an
        // editor moved between paths keeps each text, with its undo stack and where the reader
        // was left in it
        path?: string;
        // Leaves the text to be read and copied but not changed
        readOnly?: boolean;
        // What is shown in the editor's place while nothing has been written in it
        placeholder?: string;
        // Anything further Monaco takes, laid over what the component settles for itself
        options?: CodeEditorOptions;
        // Called as the text is written in, with the whole of it
        onChange?: (value: string, event: CodeEditorChangeEvent) => void;
        // Called once the editor stands, with the editor and with Monaco itself
        onMount?: (editor: CodeEditorInstance, monaco: Monaco) => void;
        // Called with every problem a language service found in the text whenever they change
        onValidate?: (markers: CodeEditorMarker[]) => void;
    };

export type CodeDiffEditorProps = Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> &
    CodeEditorFrameProps & {
        // The text on the left, which the modified one is read against
        original?: string;
        // The text on the right, which is where the edits land and what `onChange` reports
        modified?: string;
        // The language both texts are read under
        language?: string;
        // The language of the original alone, where it differs from the other's
        originalLanguage?: string;
        // The language of the modified alone, where it differs from the other's
        modifiedLanguage?: string;
        // What the original is named, read once when the editor is built
        originalPath?: string;
        // What the modified is named, read once when the editor is built
        modifiedPath?: string;
        // Leaves the modified text to be read and copied but not changed
        readOnly?: boolean;
        // Opens the original text to being written in as well, which it is not by default
        originalEditable?: boolean;
        // Whether the two texts stand side by side, or one above the other with the changes
        // marked in place
        sideBySide?: boolean;
        // Anything further Monaco takes, laid over what the component settles for itself
        options?: CodeDiffEditorOptions;
        // Called as the modified text is written in, with the whole of it
        onChange?: (value: string, event: CodeEditorChangeEvent) => void;
        // Called once the editor stands, with the editor and with Monaco itself
        onMount?: (editor: CodeDiffEditorInstance, monaco: Monaco) => void;
    };
