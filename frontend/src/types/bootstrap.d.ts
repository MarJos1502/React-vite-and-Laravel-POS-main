declare interface Window {
    bootstrap: {
        Tooltip: new (element: Element) => unknown;
        Popover: new (element: Element) => unknown;
    }
} 