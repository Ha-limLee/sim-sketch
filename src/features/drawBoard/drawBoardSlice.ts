import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ShapeType } from '../toolBox/toolBoxSlice';

export type NodeProp = {
    id: string,
    x?: number,
    y?: number,
    radius?: number,
    width?: number,
    height?: number,
    points?: number[],
    anchorPoint?: number[],
    strokeWidth?: number,
    color?: string,
};

export type createdNode = {
    shape: ShapeType,
    prop: NodeProp,
};

export interface DrawBoardState {
    nodes: createdNode[];
    draft: NodeProp;
    isDrawing: boolean,
    undoStack: createdNode[];
}

const initialState: DrawBoardState = {
    nodes: [],
    draft: { id: '0' },
    isDrawing: false,
    undoStack: [],
};

function* IdGen() {
    let prevId = '';
    while (true) {
        let nextId = '';
        do {
            nextId = Date.now().toString() + Math.random().toString();
        } while (nextId === prevId);
        yield (prevId = nextId);
    }
}

const gen = IdGen();

export const drawBoardSlice = createSlice({
    name: "drawBoard",
    initialState,
    reducers: {
        setNodes: (state, { payload }: PayloadAction<createdNode[]>) => {
            state.nodes = payload;
        },
        modifyProp: ({ nodes }, { payload }: PayloadAction<NodeProp>) => {
            const index = nodes.findIndex(x => x.prop.id === payload.id);
            if (index !== -1) {
                const { prop } = nodes[index];
                nodes[index].prop = { ...prop, ...payload };
                return;
            }
        },
        setDraft: (state, {payload}: PayloadAction<NodeProp>) => {
            state.draft = payload;
        },
        setIsDrawing: (state, {payload}: PayloadAction<boolean>) => {
            state.isDrawing = payload;
            if (!payload) return;
            const { value: id, done } = gen.next();
            if (done) return;
            state.draft.id = id;
        },
        undo: ({ nodes, undoStack }) => {
            const last = nodes.pop();
            if (!last) return;
            if (undoStack.length < 40) {
                undoStack.push(last);
                return;
            }
            undoStack.shift();
            undoStack.push(last);
        },
        redo: ({ nodes, undoStack }) => {
            const last = undoStack.pop();
            if (last) nodes.push(last);
        }
    }
});

export const { setNodes, modifyProp, setDraft, setIsDrawing, undo, redo } = drawBoardSlice.actions;

export const selectDrawBoard = (state: RootState) => state.drawBoard;

export default drawBoardSlice.reducer;