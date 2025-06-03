import 'react-beautiful-dnd';
import { ComponentType } from 'react';
import { DragDropContextProps, DroppableProps, DraggableProps } from 'react-beautiful-dnd';

declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export type DraggableId = string;
  export type DroppableId = string;

  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }

  export interface DragResult {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination: DraggableLocation | null;
    reason: 'DROP' | 'CANCEL';
  }

  export interface DropResult extends DragResult {
    combine: DraggableLocation | null;
  }

  export interface DraggableProvided {
    draggableProps: {
      style?: React.CSSProperties;
      [key: string]: any;
    };
    dragHandleProps: {
      [key: string]: any;
    } | null;
    innerRef: (element: HTMLElement | null) => void;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    isClone: boolean;
    dropAnimation: {
      duration: number;
      curve: string;
      moveTo: Position;
    } | null;
    draggingOver: DroppableId | null;
    combineWith: DraggableId | null;
    combineTargetFor: DraggableId | null;
    mode: 'FLUID' | 'SNAP' | null;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactNode;
    droppableProps: {
      [key: string]: any;
    };
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
    draggingFromThisWith: DraggableId | null;
    isUsingPlaceholder: boolean;
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (update: DragUpdate) => void;
    children: React.ReactNode;
  }

  export interface DroppableProps {
    droppableId: string;
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    ignoreContainerClipping?: boolean;
    renderClone?: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => React.ReactNode;
    getContainerForClone?: () => HTMLElement;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
  }

  export interface DraggableProps {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
  }

  export const DragDropContext: ComponentType<DragDropContextProps>;
  export const Droppable: ComponentType<DroppableProps>;
  export const Draggable: ComponentType<DraggableProps>;
} 