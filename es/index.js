/**
 * Offers ability of resizing element by dragging a handle.
 * @param resizer Resizer. The resizer handle.
 * @param resizee Resizee. The resizable element that will response to the resizer.
 * @param options Options.
 */
function handledResizable(resizer, resizee, options) {
    if (!window.__HandledResizable) {
        window.__HandledResizable =
            {
                tool_name: 'handled-resizable',
                description: 'Make an element resizable with a handle provided (by user).',
                resizer_data_map: new WeakMap(),
                active_resizer: null,
            };
    }
    const map = window.__HandledResizable.resizer_data_map;
    // delete //
    if (resizee === null) {
        map.delete(resizer);
        return;
    }
    // create or update //
    map.set(resizer, {
        resizee: resizee,
        mouse_start_x: 0,
        mouse_start_y: 0,
        resizee_start_width: 0,
        resizee_start_height: 0,
        movement: Object.assign({ x: 1, y: 1 }, options?.movement),
        ...(options?.hooks ? { hooks: options.hooks } : {}),
    });
    resizer.addEventListener('mousedown', _dragStart);
}
function _dragStart(event) {
    const resizer = event.target;
    const map = window.__HandledResizable.resizer_data_map;
    const resizer_data = map.get(resizer);
    // custom hook //
    if (resizer_data.hooks?.resizeStart && resizer_data.hooks?.resizeStart(event, resizer, resizer_data) === false)
        return;
    // initialize resizer_data //
    map.set(resizer, Object.assign({}, map.get(resizer), {
        mouse_start_x: event.clientX,
        mouse_start_y: event.clientY,
        resizee_start_width: parseInt(getComputedStyle(resizer_data.resizee).width, 10),
        resizee_start_height: parseInt(getComputedStyle(resizer_data.resizee).height, 10),
    }));
    window.__HandledResizable.active_resizer = resizer;
    document.addEventListener('mousemove', _drag);
    document.addEventListener('mouseup', _dragEnd);
}
function _drag(event) {
    const resizer = window.__HandledResizable.active_resizer;
    const map = window.__HandledResizable.resizer_data_map;
    const resizer_data = map.get(resizer);
    // custom hook //
    if (resizer_data.hooks?.resize && resizer_data.hooks?.resize(event, resizer, resizer_data) === false)
        return;
    if (resizer_data.movement.x !== 0) {
        resizer_data.resizee.style.width = resizer_data.resizee_start_width + resizer_data.movement.x * (event.clientX - resizer_data.mouse_start_x) + 'px';
    }
    if (resizer_data.movement.y !== 0) {
        resizer_data.resizee.style.height = resizer_data.resizee_start_height + resizer_data.movement.y * (event.clientY - resizer_data.mouse_start_y) + 'px';
    }
}
function _dragEnd(event) {
    const resizer = window.__HandledResizable.active_resizer;
    const map = window.__HandledResizable.resizer_data_map;
    const resizer_data = map.get(resizer);
    document.removeEventListener('mousemove', _drag);
    document.removeEventListener('mouseup', _dragEnd);
    // custom hook //
    if (resizer_data.hooks?.resizeEnd) {
        resizer_data.hooks?.resizeEnd(event, resizer, resizer_data);
    }
}
export default handledResizable;
