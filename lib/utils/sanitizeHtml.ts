import DOMPurify from "dompurify";

export function sanitizeHtml(html?: string) {
    return html
        ? DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                "b",
                "strong",
                "i",
                "em",
                "u",
                "br",
                "ul",
                "ol",
                "li",
                "span",
            ],
        })
        : "";
}
