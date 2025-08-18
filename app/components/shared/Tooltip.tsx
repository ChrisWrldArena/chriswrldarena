import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
    if (!node) return window;
    const overflowY = window.getComputedStyle(node).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
        return node;
    }
    return node.parentElement ? getScrollParent(node.parentElement) : window;
}

export function AnalysisTooltip({ text }: { text: string }) {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
    const ref = useRef<HTMLSpanElement>(null);
    const truncated = text.slice(0, 30);
    const needsTooltip = text.length > 30;

    useEffect(() => {
        if (show && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const scrollParent = getScrollParent(ref.current);
            let scrollTop = 0, scrollLeft = 0;
            if (scrollParent instanceof HTMLElement) {
                scrollTop = scrollParent.scrollTop;
                scrollLeft = scrollParent.scrollLeft;
            } else {
                scrollTop = window.scrollY;
                scrollLeft = window.scrollX;
            }
            setCoords({
                left: rect.left + rect.width / 2 + scrollLeft,
                top: rect.bottom + scrollTop + 8, // 8px below
            });
        }
    }, [show]);

    return (
        <>
            <span
                ref={ref}
                tabIndex={0}
                className="outline-none  cursor-pointer"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
            >
                {truncated}{needsTooltip ? '...' : ''}
            </span>
            {needsTooltip && show && coords && createPortal(
                <div
                    className="fixed z-[99999] min-w-[220px] max-w-xs bg-white border border-gray-300 rounded-lg shadow-xl p-4 text-xs text-gray-800 animate-fade-in"
                    style={{ left: coords.left, top: coords.top, transform: 'translateX(-50%)' }}
                    role="tooltip"
                >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-300 rotate-45 z-40"></div>
                    <p className="whitespace-pre-wrap break-words">{text}</p>
                </div>,
                document.body
            )}
        </>
    );
}