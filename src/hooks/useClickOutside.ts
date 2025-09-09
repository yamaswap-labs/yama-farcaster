import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
    handler: (event: MouseEvent | TouchEvent) => void
) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler(event);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [handler]);

    return ref;
}