"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxWords?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter here",
  maxWords = 800,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });
  const [activeHeading, setActiveHeading] = useState<"p" | "h1" | "h2" | "h3">(
    "p"
  );
  const isTransformingRef = useRef(false);

  // sync editor from external value (unless focused)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (!isFocused && value !== el.innerHTML && !isTransformingRef.current) {
      el.innerHTML = value || "";
      const text = el.innerText || "";
      setWordCount(countWords(text));
    }
  }, [value, isFocused]);

  // update toolbar state
  const updateActiveFormats = useCallback(() => {
    const blockTag = (document.queryCommandValue("formatBlock") || "p")
      .toString()
      .toLowerCase();
    setActiveHeading(
      blockTag.includes("h1")
        ? "h1"
        : blockTag.includes("h2")
          ? "h2"
          : blockTag.includes("h3")
            ? "h3"
            : "p"
    );

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
    });
  }, []);

  useEffect(() => {
    const handler = () => {
      const el = editorRef.current;
      if (!el) return;

      const selection = document.getSelection();
      if (!selection || !el.contains(selection.anchorNode)) return;

      updateActiveFormats();
    };

    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [updateActiveFormats]);

  // normalize HTML while preserving lists and inline formats,
  // trim empty blocks and remove whitespace-only blocks.
  const normalizeHTML = (html: string) => {
    if (!html) return "";

    const container = document.createElement("div");
    container.innerHTML = html;

    // replace NBSP with normal spaces in text nodes
    const replaceNbsp = (node: Node) => {
      node.childNodes.forEach((c) => {
        if (c.nodeType === Node.TEXT_NODE) {
          c.textContent = (c.textContent || "").replace(/\u00A0/g, " ");
        } else {
          replaceNbsp(c);
        }
      });
    };
    replaceNbsp(container);

    // Remove empty blocks (p, h1-3, li) and trim their inner text/HTML.
    const blockSelectors = "p, h1, h2, h3, li";
    const blocks = Array.from(container.querySelectorAll(blockSelectors));
    blocks.forEach((b) => {
      // For list items, preserve inline tags; only trim whitespace and remove if empty.
      if (b.tagName === "LI") {
        const inner = (b.innerHTML || "").replace(/\s*\n\s*/g, " ").trim();
        if (!inner || inner.replace(/<br\s*\/?>/gi, "").trim() === "") {
          b.remove();
        } else {
          b.innerHTML = inner;
        }
      } else {
        // For other blocks, allow inline tags but collapse excessive whitespace/newlines.
        const inner = (b.innerHTML || "")
          .replace(/\s*\n\s*/g, "\n")
          .replace(/^\s+|\s+$/g, "");
        if (!inner || inner.replace(/<br\s*\/?>/gi, "").replace(/&nbsp;/gi, "").trim() === "") {
          b.remove();
        } else {
          b.innerHTML = inner;
        }
      }
    });

    // Remove <br> used solely as empty-line markers if they are inside empty parents
    container.querySelectorAll("br").forEach((br) => {
      const parent = br.parentElement;
      if (parent && parent.textContent?.trim() === "") {
        br.remove();
      }
    });

    // Sanitize: only allow a small set of tags, unwrap others but keep their content.
    const allowed = new Set([
      "P",
      "BR",
      "UL",
      "OL",
      "LI",
      "H1",
      "H2",
      "H3",
      "B",
      "STRONG",
      "I",
      "EM",
      "U",
      "A",
    ]);

    const sanitize = (node: Node) => {
      const children = Array.from(node.childNodes);
      children.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          if (!allowed.has(el.tagName)) {
            // unwrap element but keep its children
            while (el.firstChild) node.insertBefore(el.firstChild, el);
            el.remove();
          } else {
            // strip attributes except href for anchors
            if (el.tagName === "A") {
              const href = el.getAttribute("href");
              Array.from(el.attributes).forEach((attr) => {
                if (attr.name !== "href") el.removeAttribute(attr.name);
              });
              if (!href) el.removeAttribute("href");
            } else {
              Array.from(el.attributes).forEach((attr) => el.removeAttribute(attr.name));
            }
            sanitize(el);
          }
        } else {
          // text node — ok
        }
      });
    };
    sanitize(container);

    // After sanitization, remove any empty UL/OL that have no LI children
    container.querySelectorAll("ul,ol").forEach((list) => {
      if (!list.querySelector("li")) list.remove();
    });

    // Final trim
    const out = container.innerHTML.trim();
    return out ? out : "";
  };

  const countWords = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  // onInput handler
  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML.trim();
    const text = el.innerText || "";

    const words = countWords(text);
    setWordCount(words);

    const normalized = normalizeHTML(html);
    onChange(normalized);

    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  // Markdown shortcuts (headings, lists)
  const handleMarkdownKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;

    const el = editorRef.current;
    if (!el) return;

    const selection = document.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const block =
      container.nodeType === 3
        ? (container.parentElement as HTMLElement)
        : (container as HTMLElement);
    if (!block) return;

    const text = block.innerText.trimStart();

    setTimeout(() => {
      if (/^#{1,3}\s/.test(text)) {
        isTransformingRef.current = true;
        const level = text.match(/^#{1,3}/)![0].length;
        const clean = text.replace(/^#{1,3}\s/, "");
        block.innerHTML = `<h${level}>${clean}</h${level}>`;
        placeCaretAtEnd(block.querySelector(`h${level}`)!);
        handleInput();
        isTransformingRef.current = false;
      } else if (/^(\*|-)\s/.test(text)) {
        isTransformingRef.current = true;
        const clean = text.replace(/^(\*|-)\s/, "");
        block.innerHTML = `<ul><li>${clean}</li></ul>`;
        placeCaretAtEnd(block.querySelector("li")!);
        handleInput();
        isTransformingRef.current = false;
      } else if (/^\d+\.\s/.test(text)) {
        isTransformingRef.current = true;
        const clean = text.replace(/^\d+\.\s/, "");
        block.innerHTML = `<ol><li>${clean}</li></ol>`;
        placeCaretAtEnd(block.querySelector("li")!);
        handleInput();
        isTransformingRef.current = false;
      }
    }, 0);
  };

  function placeCaretAtEnd(el: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  // formatting commands
  const applyFormat = (cmd: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false);
    setTimeout(() => handleInput(), 0);
  };

  const applyBlockFormat = (tag: "p" | "h1" | "h2" | "h3") => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand("formatBlock", false, tag);
    setTimeout(() => handleInput(), 0);
  };

  const insertList = (type: "ul" | "ol") => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(
      type === "ul" ? "insertUnorderedList" : "insertOrderedList",
      false
    );
    // After insertion, some browsers put cursor inside a DIV or insert extra nodes;
    // normalize small inconsistencies and update state shortly after.
    setTimeout(() => {
      // Ensure we have proper <ul>/<ol> structure: if execCommand produced <div><ul>.. unwrap extra divs.
      const container = editorRef.current!;
      container.querySelectorAll("div").forEach((d) => {
        // only unwrap empty divs that directly wrap lists
        if (
          d.childElementCount &&
          (d.querySelector("ul") || d.querySelector("ol")) &&
          d.childElementCount === 1
        ) {
          while (d.firstChild) container.insertBefore(d.firstChild, d);
          d.remove();
        }
      });
      handleInput();
    }, 50);
  };

  const setAlign = (align: "left" | "center" | "right") => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const cmd =
      align === "left"
        ? "justifyLeft"
        : align === "center"
          ? "justifyCenter"
          : "justifyRight";
    document.execCommand(cmd, false);
    setTimeout(() => handleInput(), 0);
  };

  // word limit enforcement
  const handleBeforeInput = (e: InputEvent) => {
    const el = editorRef.current;
    if (!el) return;

    const text = el.innerText || "";
    const incoming = e.data ?? "";

    const selection = document.getSelection();
    const selectedText = selection?.toString() || "";

    const baseText = selectedText ? text.replace(selectedText, "") : text;

    const simulated = (baseText + " " + incoming).trim();
    const newWordCount = countWords(simulated);

    if (newWordCount > (maxWords ?? 800)) {
      e.preventDefault();
    }
  };

  // paste handling - plain text, limit words
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();

    const el = editorRef.current;
    if (!el) return;

    const paste = e.clipboardData?.getData("text/plain") || "";
    const currentText = el.innerText || "";

    const sel = document.getSelection();
    const selectedText = sel?.toString() || "";

    const baseText = selectedText
      ? currentText.replace(selectedText, "")
      : currentText;

    const baseWords = countWords(baseText);
    const pasteWordsArray = paste.trim().split(/\s+/).filter(Boolean);
    const pasteWordsCount = pasteWordsArray.length;

    const newWordCount = baseWords + pasteWordsCount;

    if (newWordCount > (maxWords ?? 800)) {
      const allowedWords = (maxWords ?? 800) - baseWords;

      if (allowedWords > 0) {
        const partialPaste = pasteWordsArray.slice(0, allowedWords).join(" ");
        document.execCommand("insertText", false, partialPaste + " ");
      }
      return;
    }

    document.execCommand("insertText", false, paste);
    setTimeout(() => handleInput(), 0);
  };

  // attach listeners
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const beforeInputHandler = (e: Event) => handleBeforeInput(e as InputEvent);
    const pasteHandler = (e: Event) => handlePaste(e as ClipboardEvent);

    el.addEventListener("beforeinput", beforeInputHandler);
    el.addEventListener("paste", pasteHandler);

    return () => {
      el.removeEventListener("beforeinput", beforeInputHandler);
      el.removeEventListener("paste", pasteHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-primary transition">
      <div className="flex items-center flex-wrap gap-2 px-3 py-2 border-b border-gray-100 text-gray-600 text-sm bg-white">
        <ToolbarButton
          active={activeFormats.bold}
          onClick={() => applyFormat("bold")}
          icon={<Bold className="w-4 h-4" />}
        />
        <ToolbarButton
          active={activeFormats.italic}
          onClick={() => applyFormat("italic")}
          icon={<Italic className="w-4 h-4" />}
        />
        <ToolbarButton
          active={activeFormats.underline}
          onClick={() => applyFormat("underline")}
          icon={<Underline className="w-4 h-4" />}
        />

        <div className="h-4 w-px bg-gray-200 mx-1" />

        <ToolbarButton
          active={activeFormats.ul}
          onClick={() => insertList("ul")}
          icon={<List className="w-4 h-4" />}
        />
        <ToolbarButton
          active={activeFormats.ol}
          onClick={() => insertList("ol")}
          icon={<ListOrdered className="w-4 h-4" />}
        />
      </div>

      <div className="relative bg-white">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => setTimeout(() => handleInput(), 0)}
          onKeyUp={handleMarkdownKey}
          onFocus={() => {
            setIsFocused(true);
            updateActiveFormats();
          }}
          onBlur={() => {
            setIsFocused(false);
            const el = editorRef.current;
            if (el) {
              const normalized = normalizeHTML(el.innerHTML);
              onChange(normalized);
            }
            updateActiveFormats();
          }}
          className="w-full px-3 py-3 text-sm text-gray-800 focus:outline-none min-h-[120px] max-h-[250px] overflow-y-auto prose prose-sm max-w-none"
          data-placeholder={placeholder}
        />
        <span className="absolute bottom-2 right-3 text-xs text-primary">
          {wordCount}/{maxWords} Words
        </span>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              Preview
            </h2>

            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{
                __html: value || "<p><em>No content yet</em></p>",
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        :global(.prose h1) {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: #111827;
        }
        :global(.prose h2) {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.4rem 0;
          color: #1f2937;
        }
        :global(.prose h3) {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.3rem 0;
          color: #374151;
        }

        /* ensure bullets / numbers are visible */
        :global(.prose ul) {
          list-style-type: disc;
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        :global(.prose ol) {
          list-style-type: decimal;
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        :global(.prose li) {
          margin-bottom: 0.25rem;
        }

        :global(div[contenteditable]:focus) {
          outline: none;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({
  icon,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${active
        ? "bg-primary/10 text-primary"
        : "hover:bg-gray-100 active:bg-gray-200 text-gray-600"
        }`}
    >
      {icon}
    </button>
  );
}
