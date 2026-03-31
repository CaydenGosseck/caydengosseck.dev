"use client";

import "@mdxeditor/editor/style.css";
import "./editor-styles.css";
import type { ForwardedRef } from "react";
import {
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    ListsToggle,
    CodeToggle,
    InsertCodeBlock,
    codeBlockPlugin,
    codeMirrorPlugin,
    Separator,
} from "@mdxeditor/editor";

type Props = MDXEditorProps & {
    editorRef: ForwardedRef<MDXEditorMethods> | null;
};

export default function InitializedMDXEditor({ editorRef, ...props }: Props) {
    return (
        <MDXEditor
            {...props}
            ref={editorRef}
            className="dark-theme dark-editor"
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                        js: "JavaScript",
                        ts: "TypeScript",
                        tsx: "TypeScript (React)",
                        jsx: "JavaScript (React)",
                        py: "Python",
                        go: "Go",
                        rs: "Rust",
                        css: "CSS",
                        html: "HTML",
                        sh: "Shell",
                        bash: "Bash",
                        json: "JSON",
                        sql: "SQL",
                        "": "Plain text",
                    },
                }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <BlockTypeSelect />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <Separator />
                            <ListsToggle />
                            <Separator />
                            <CodeToggle />
                            <InsertCodeBlock />
                        </>
                    ),
                }),
            ]}
        />
    );
}
