import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import {
    CodeDiffEditor as CodeDiffEditorSurface,
    useCodeDiffEditor,
    useMonaco,
} from "../../lib/code-editor";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DEFAULT_CODE_EDITOR_OPTIONS, DEFAULT_CODE_EDITOR_TAB_SIZE } from "./CodeEditor";
import { CODE_EDITOR_THEME } from "./codeEditorAppearance";
import { useCodeEditorAppearance } from "./useCodeEditorAppearance";
import type { CodeDiffEditorProps } from "./CodeEditor.types";

const classes = {
    root: "code-editor",
    diff: "code-editor-diff",
    surface: "code-editor-surface",
};

// What a screen reader hears the editor called where the caller has not named it
const DEFAULT_LABEL = "Code diff editor";

// How many columns a tab stands for is the text's to say rather than the editor's, and a diff
// editor is built without a text of its own, so its two texts are told once they stand, and told
// again whenever the answer changes
function CodeDiffEditorTabSize({ tabSize }: { tabSize: number }) {
    const editor = useCodeDiffEditor();

    React.useEffect(() => {
        const models = editor?.getModel();
        if (!models) return;

        models.original.updateOptions({ tabSize });
        models.modified.updateOptions({ tabSize });
    }, [editor, tabSize]);

    return null;
}

CodeDiffEditorTabSize.displayName = "CodeDiffEditorTabSize";

// Two texts with what changed between them marked: the original on the left, and the modified on
// the right, which is where the edits land. It stands in the same frame as the editor and is
// painted from the same tokens, with the lines added and taken away marked in the colours the
// rest of the library marks a diff in.
//
//     <CodeDiffEditor language="json" original={before} modified={after} />
//
// The two texts are read once, when the editor is built, and a text passed afterwards is written
// in where it differs, the way an editor's value is. A diff is of two texts rather than of
// whichever two files are open, so one comparing others is built afresh
function CodeDiffEditor(
    props: CodeDiffEditorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        original,
        modified,
        language,
        originalLanguage,
        modifiedLanguage,
        originalPath,
        modifiedPath,
        readOnly = false,
        originalEditable = false,
        sideBySide = true,
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

    const label = ariaLabelledBy ? undefined : (ariaLabel ?? DEFAULT_LABEL);

    const minimap = React.useMemo(() => ({ enabled: showMinimap }), [showMinimap]);

    return (
        <div
            ref={mergedRef}
            role="group"
            aria-label={label}
            aria-labelledby={ariaLabelledBy}
            className={classNames(classes.root, classes.diff, className)}
            style={
                {
                    ...style,
                    "--code-editor-width": typeof width === "number" ? `${width}px` : width,
                    "--code-editor-height": typeof height === "number" ? `${height}px` : height,
                } as React.CSSProperties
            }
            data-component="CodeDiffEditor"
            data-language={language}
            data-read-only={readOnly || undefined}
            {...rest}
        >
            <CodeDiffEditorSurface
                className={classes.surface}
                width="100%"
                height="100%"
                original={original}
                modified={modified}
                language={language}
                originalLanguage={originalLanguage}
                modifiedLanguage={modifiedLanguage}
                originalPath={originalPath}
                modifiedPath={modifiedPath}
                readOnly={readOnly}
                originalEditable={originalEditable}
                theme={CODE_EDITOR_THEME}
                keepModels={keepModels}
                loading={loading}
                onChange={onChange}
                onMount={onMount}
                {...DEFAULT_CODE_EDITOR_OPTIONS}
                renderSideBySide={sideBySide}
                lineNumbers={showLineNumbers ? "on" : "off"}
                minimap={minimap}
                wordWrap={wrap === "wrap" ? "on" : "off"}
                fontFamily={appearance?.fontFamily}
                fontSize={appearance?.fontSize}
                lineHeight={appearance?.lineHeight}
                {...options}
            >
                <CodeDiffEditorTabSize tabSize={tabSize} />
                {children}
            </CodeDiffEditorSurface>
        </div>
    );
}

CodeDiffEditor.displayName = "CodeDiffEditor";

export default fixedForwardRef(CodeDiffEditor);
