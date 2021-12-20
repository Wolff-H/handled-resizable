interface ResizerData {
    resizee: HTMLElement;
    mouse_start_x: number;
    mouse_start_y: number;
    resizee_start_width: number;
    resizee_start_height: number;
    movement: {
        x: -1 | 0 | 1;
        y: -1 | 0 | 1;
    };
    hooks?: {
        resizeStart?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void | false;
        resize?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void | false;
        resizeEnd?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void;
    };
}
interface HandledResizableData {
    tool_name: string;
    description: string;
    resizer_data_map: ResizerDataMap;
    active_resizer: HTMLElement | null;
}
declare type ResizerDataMap = WeakMap<HTMLElement, ResizerData>;
/**
 * Offers ability of resizing element by dragging a handle.
 * @param resizer Resizer. The resizer handle.
 * @param resizee Resizee. The resizable element that will response to the resizer.
 * @param options Options.
 */
declare function handledResizable(resizer: HTMLElement, resizee: HTMLElement | null, options?: {
    movement?: {
        x?: -1 | 0 | 1;
        y?: -1 | 0 | 1;
    };
    hooks?: {
        resizeStart?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void | false;
        resize?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void | false;
        resizeEnd?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void;
    };
}): void;
export { HandledResizableData, ResizerData, ResizerDataMap, };
export default handledResizable;
