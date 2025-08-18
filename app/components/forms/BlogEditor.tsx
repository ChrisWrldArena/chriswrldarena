/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";


type EditorInstance = import("@editorjs/editorjs").default | null;

const DEFAULT_INITIAL_DATA = {
    time: new Date().getTime(),
    blocks: [],
};

interface BlogEditorProps {
    onChange: (data: OutputData | null) => void;
    blockvalue: OutputData
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onChange, blockvalue }) => {
    const editorRef = useRef<EditorInstance>(null);
    const [isReady, setIsReady] = useState(false);

    function removeExtraEditors() {
    const editors = document.querySelectorAll(".codex-editor");
    if (editors.length > 1) {
        // Keep the first one, remove the rest
        for (let i = 1; i < editors.length; i++) {
            editors[i].remove();
        }
    }
}


    useEffect(() => {
        // Ensure this runs only once on mount (client-side)
        if (editorRef.current || !document.getElementById("editorjs")) return;

        const initializeEditor = async () => {
            const EditorJSModule = await import("@editorjs/editorjs");
            const Header = (await import("@editorjs/header")).default;
            const List = (await import("@editorjs/list")).default;
            const ImageTool = (await import("@editorjs/image")).default;
            const Quote = (await import("@editorjs/quote")).default;
            const CodeTool = (await import("@editorjs/code")).default;
            const Checklist = (await import("@editorjs/checklist")).default;
            const Table = (await import("@editorjs/table")).default;
            const Embed = (await import("@editorjs/embed")).default;
            const LinkTool = (await import("@editorjs/link")).default;
            const Paragraph = (await import("@editorjs/paragraph")).default;

            const editor = new EditorJSModule.default({
                holder: "editorjs",
                data: blockvalue || DEFAULT_INITIAL_DATA,
                placeholder: "Write your blog post here...",
                inlineToolbar: true,
                hideToolbar: true,

                onChange: async () => {
                    try {
                        if (editorRef.current) {
                            const outputData = await editorRef.current.save()
                            onChange(outputData);
                        }
                    } catch (error: any) {
                        console.log(error.message)
                    }
                },

                tools: {
                    header: Header,
                    list: List,
                    quote: Quote,
                    checklist: Checklist,
                    code: CodeTool,
                    table: Table,
                    embed: Embed,
                    linkTool: {
                        class: LinkTool,
                        config: { endpoint: "/api/fetch-metadata" },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    formData.append("upload_preset", "chriswrldarena");
                                    const res = await fetch("https://api.cloudinary.com/v1_1/derrjt0wf/image/upload", {
                                        method: "POST",
                                        body: formData,
                                    });
                                    const result = await res.json();
                                    return {
                                        success: 1,
                                        file: {
                                            url: result.secure_url,
                                        },
                                    };
                                },
                            },
                        },
                    },
                    paragraph: Paragraph,
                },
                onReady: () => {
                    editorRef.current = editor;
                    setIsReady(true);
                    removeExtraEditors()
                },
            });
        };

        initializeEditor();

        return () => {
            if(editorRef.current){
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return <div id="editorjs" className="border border-neutral-200 rounded-xl py-8" />;

    /*  */
};

export default BlogEditor;