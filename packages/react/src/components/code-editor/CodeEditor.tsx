import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { CodeEditor as CodeEditorSurface, useMonaco } from "../../lib/code-editor";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CODE_EDITOR_THEME } from "./codeEditorAppearance";
import { useCodeEditorAppearance } from "./useCodeEditorAppearance";
import type { CodeEditorOptions } from "../../lib/code-editor";
import type { CodeEditorProps } from "./CodeEditor.types";

const classes = {
    root: "code-editor",
    surface: "code-editor-surface",
};

// What a screen reader hears the editor called where the caller has not named it. An editor
// holding one file is better named for that file, but a name is worth having either way: it is
// what the field is found by
const DEFAULT_LABEL = "Code editor";

// How many columns a tab stands for. Four, which is what the library's own listings are set at
export const DEFAULT_CODE_EDITOR_TAB_SIZE = 4;

// What every editor is told beyond what the props settle, and what a caller's options are laid
// over
export const DEFAULT_CODE_EDITOR_OPTIONS: CodeEditorOptions = {
    // Nothing is drawn past the last line, so a short text does not leave a page of blank room
    // to scroll through
    scrollBeyondLastLine: false,
    // The frame clips what it holds to its rounded corners, so anything Monaco opens over the
    // text, a list of suggestions or a hover, is drawn against the page instead, where the frame
    // cannot cut it off
    fixedOverflowWidgets: true,
    // The strip down the right edge that marks where the problems and the selections are keeps
    // a line of Monaco's own grey between it and the text, which is not the frame's, so it is
    // not drawn
    overviewRulerBorder: false,
    // A little room above the first line and below the last, as the code block gives its listing
    padding: { top: 8, bottom: 8 },
};

// A code editor: the Monaco editor, which is the editor VS Code is built on, drawn in the design
// system's frame and painted from its tokens.
//
//     <CodeEditor language="typescript" defaultValue={source} onChange={setSource} />
//
// What an editor is usually wanted for is one text in one language, so that is what the props
// settle, along with what is drawn beside the lines. Everything else Monaco can be told goes in
// `options`, laid over what the component settles for itself.
//
// The colours and the font are read from the stylesheet rather than passed in, since Monaco is
// handed a theme and a theme is written in tokens. The stylesheet maps the design tokens onto
// custom properties on the frame, the component reads them off it and defines the theme from
// them, and reads them again when the scheme changes; so an editor follows the theme around it
// without being told which one is standing, and can be repainted the way the rest of the
// library is.
//
// Monaco runs its language services on web workers that only the page's bundler can place, which
// the page supplies through `configureCodeEditorWorkers`; without them the editor still edits and
// colours every language, with Monaco doing the rest on the main thread
function CodeEditor(
    props: CodeEditorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        value,
        defaultValue,
        language,
        path,
        readOnly = false,
        placeholder,
        showLineNumbers = true,
        showMinimap = false,
        wrap = "nowrap",
        tabSize = DEFAULT_CODE_EDITOR_TAB_SIZE,
        width,
        height,
        options,
        loading,
        keepModels,
        onChange,
        onMount,
        onValidate,
        className,
        style,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);

    const monaco = useMonaco();
    const appearance = useCodeEditorAppearance(monaco, rootRef);

    // Monaco names the field itself, through the text area it listens on, so a name is handed on
    // to it rather than written on the frame alone. A name given as an element of the page cannot
    // be handed on, so the frame carries that one and Monaco is left with the field's own
    const label = ariaLabelledBy ? undefined : (ariaLabel ?? DEFAULT_LABEL);

    // The minimap is told as an object, which is only built again when the answer changes, so an
    // editor that has not changed is not told again on every render
    const minimap = React.useMemo(() => ({ enabled: showMinimap }), [showMinimap]);

    return (
        <div
            ref={mergedRef}
            role="group"
            aria-label={label}
            aria-labelledby={ariaLabelledBy}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    // How much of the page the editor takes is the one thing the class cannot
                    // settle on its own, since it is the caller who says
                    "--code-editor-width": typeof width === "number" ? `${width}px` : width,
                    "--code-editor-height": typeof height === "number" ? `${height}px` : height,
                } as React.CSSProperties
            }
            data-component="CodeEditor"
            data-language={language}
            data-read-only={readOnly || undefined}
            {...rest}
        >
            <CodeEditorSurface
                className={classes.surface}
                // The surface fills the box the class above sized, rather than being given a size
                // of its own to disagree with it
                width="100%"
                height="100%"
                value={value}
                defaultValue={defaultValue}
                language={language}
                path={path}
                readOnly={readOnly}
                theme={CODE_EDITOR_THEME}
                keepModels={keepModels}
                loading={loading}
                onChange={onChange}
                onMount={onMount}
                onValidate={onValidate}
                {...DEFAULT_CODE_EDITOR_OPTIONS}
                ariaLabel={label ?? DEFAULT_LABEL}
                lineNumbers={showLineNumbers ? "on" : "off"}
                minimap={minimap}
                wordWrap={wrap === "wrap" ? "on" : "off"}
                tabSize={tabSize}
                placeholder={placeholder}
                fontFamily={appearance?.fontFamily}
                fontSize={appearance?.fontSize}
                lineHeight={appearance?.lineHeight}
                {...options}
            >
                {children}
            </CodeEditorSurface>
        </div>
    );
}

CodeEditor.displayName = "CodeEditor";

export default fixedForwardRef(CodeEditor);
