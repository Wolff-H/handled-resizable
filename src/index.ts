interface ResizerData
{
    resizee: HTMLElement
    mouse_start_x: number
    mouse_start_y: number
    resizee_start_width: number
    resizee_start_height: number
    movement:
    {
        x: -1|0|1
        y: -1|0|1
    }
    hooks?:
    {
        resizeStart?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void|false
        resize?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void|false
        resizeEnd?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void
    }
}

interface HandledResizableData
{
    tool_name: string
    description: string
    resizer_data_map: ResizerDataMap
    active_resizer: HTMLElement|null
}

type ResizerDataMap = WeakMap<HTMLElement, ResizerData>



/**
 * Offers ability of resizing element by dragging a handle.
 * @param resizer Resizer. The resizer handle.
 * @param resizee Resizee. The resizable element that will response to the resizer.
 * @param options Options.
 */
function handledResizable(
    resizer: HTMLElement,
    resizee: HTMLElement|null,
    options?:
    {
        movement?:
        {
            x?: -1|0|1,
            y?: -1|0|1,
        },
        hooks?:
        {
            resizeStart?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void|false,
            resize?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void|false,
            resizeEnd?: (event: MouseEvent, resizer: HTMLElement, resizer_data: ResizerData) => void,
        },
    },
){
    if(!window.__HandledResizable)
    {
        window.__HandledResizable =
        {
            tool_name: 'handled-resizable',
            description: 'Make an element resizable with a handle provided (by user).',
            resizer_data_map: new WeakMap(),
            active_resizer: null,
        } as HandledResizableData
    }

    const map: ResizerDataMap = window.__HandledResizable.resizer_data_map

    // delete //
    if(resizee === null)
    {
        map.delete(resizer)

        return
    }

    // create or update //
    map.set(
        resizer,
        {
            resizee: resizee,
            mouse_start_x: 0,
            mouse_start_y: 0,
            resizee_start_width: 0,
            resizee_start_height: 0,
            movement: Object.assign({ x: 1, y: 1 }, options?.movement),
            ...(options?.hooks ? { hooks: options.hooks } : {}),
        }
    )
    
    resizer.addEventListener('mousedown', _dragStart)
}

function _dragStart(event: MouseEvent)
{
    const resizer = event.target as HTMLElement
    const map:ResizerDataMap = window.__HandledResizable.resizer_data_map
    const resizer_data = map.get(resizer)!

    // custom hook //
    if(resizer_data.hooks?.resizeStart && resizer_data.hooks?.resizeStart(event, resizer, resizer_data) === false) return

    // initialize resizer_data //
    map.set(
        resizer,
        Object.assign(
            {},
            map.get(resizer),
            {
                mouse_start_x: event.clientX,
                mouse_start_y: event.clientY,
                resizee_start_width: parseInt(getComputedStyle(resizer_data.resizee).width, 10),
                resizee_start_height: parseInt(getComputedStyle(resizer_data.resizee).height, 10),
            }
        )
    )

    window.__HandledResizable.active_resizer = resizer

    document.addEventListener('mousemove', _drag)
    document.addEventListener('mouseup', _dragEnd)
}

function _drag(event: MouseEvent)
{
    const resizer = window.__HandledResizable.active_resizer
    const map:ResizerDataMap = window.__HandledResizable.resizer_data_map
    const resizer_data = map.get(resizer)!

    // custom hook //
    if(resizer_data.hooks?.resize && resizer_data.hooks?.resize(event, resizer, resizer_data) === false) return

    if(resizer_data.movement.x !== 0)
    {
        resizer_data.resizee.style.width = resizer_data.resizee_start_width + resizer_data.movement.x * (event.clientX - resizer_data.mouse_start_x) + 'px'
    }
    if(resizer_data.movement.y !== 0)
    {
        resizer_data.resizee.style.height = resizer_data.resizee_start_height + resizer_data.movement.y * (event.clientY - resizer_data.mouse_start_y) + 'px'
    }
}

function _dragEnd(event: MouseEvent)
{
    const resizer = window.__HandledResizable.active_resizer
    const map:ResizerDataMap = window.__HandledResizable.resizer_data_map
    const resizer_data = map.get(resizer)!

    document.removeEventListener('mousemove', _drag)
    document.removeEventListener('mouseup', _dragEnd)

    // custom hook //
    if(resizer_data.hooks?.resizeEnd)
    {
        resizer_data.hooks?.resizeEnd(event, resizer, resizer_data)
    }
}



export
{
    HandledResizableData,
    ResizerData,
    ResizerDataMap,
}

export default handledResizable