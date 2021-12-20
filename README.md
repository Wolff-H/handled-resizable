# drag-scroll

A javascript library that offers ability of scrolling element by dragging.

## Installation

`$ npm install dragroll`

## Usage

Notice: Due to the package name occupation on npm, this package is named as "dragroll". However for usual use, it's recommended to import as "dragScroll", which will be more semantic and accurate.

### Basic
```js
import dragScroll from "dragroll"

dragScroll(draggable, scrollable)
```

## API

```ts
function dragScroll(
    scrollable: HTMLElement,
    draggable: HTMLElement|null,
    options?:
    {
        movement?:
        {
            x?: [number, number]
            y?: [number, number]
            swapped?: boolean
        },
        constrained?: boolean
        destroy?: boolean,
        override?: boolean,
        avoid?: HTMLElement[],
        hooks?:
        {
            dragStart?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void|false
            drag?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void|false
            dragEnd?: (event: MouseEvent, draggable: HTMLElement, draggable_data: DraggableData) => void
        }
    },
): void
```

- `scrollable`

    The scrollable element. When drag occurs on draggable, scrollable scrolls correspondingly.

- `draggable`

    The draggable element. Drag on draggable triggers dragscroll action.  
    When null, clear all dragscroll relations on passed scrollable.

- `options`

    Other options.

    - `movement`
    
        Movement constraint.
    
        - `x`, `y`
        
            Defines each drag_trigger_threshold and scroll_respond_vector, in form [number, number], in unit "px".

            > drag_trigger_threshold: A quantum of dragging distance. When cursor drags out of per this quantum, trigger once scroll action.

            > scroll_respond_vector: A quantum of scrolling distance. When scroll triggers, scroll this much distance.

        - `swapped`
        
            When true, swap dragscroll axis.
        
    - `destroy`
    
        When true, from target scrollable remove the dragscroll relation on target draggable.
    
    - `override`

        When true, in update override whole scrollable relations to only contain target relation.
    
    - `constrained`

        When true, dragscroll will only happen when cursor is inside scrollable.
    
    - `avoid`

        Dragscroll will not happen on those elements.
    
    - `hooks`

        Custom hooks.

        - `dragStart`

            Call when drag starts. Return `false` to prevent default behaviour.

        - `drag`

            Call on each drag move. Return `false` to prevent default behaviour.

        - `dragEnd`

            Call when drag ends.

