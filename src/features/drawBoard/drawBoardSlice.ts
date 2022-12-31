import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ShapeType } from '../toolBox/toolBoxSlice';

export type NodeProp = {
    id: string,
    points: number[],
    strokeWidth: number,
    color: string,
};

export type createdNode = {
    shape: ShapeType,
    prop: NodeProp,
};

export interface DrawBoardState {
    nodeId: number;
    nodes: createdNode[];
    points: number[],
    isDrawing: boolean,
    undoStack: createdNode[];
}

const initialState: DrawBoardState = {
    nodeId: 0,
    nodes: [],
    points: [],
    isDrawing: false,
    undoStack: [],
};

export const drawBoardSlice = createSlice({
    name: "drawBoard",
    initialState,
    reducers: {
        setNodes: (state, { payload }: PayloadAction<createdNode[]>) => {
            state.nodes = payload;
        },
        setNodeId: (state, { payload }: PayloadAction<number>) => {
            state.nodeId = payload;
        },
        modifyPoints: ({ nodes }, { payload: {id, points} }: PayloadAction<{id: string, points: number[]}>) => {
            const index = nodes.findIndex(x => x.prop.id === id);
            if (index !== -1) nodes[index].prop.points = points;
        },
        setPoints: (state, { payload }: PayloadAction<number[]>) => {
            state.points = payload;
        },
        setIsDrawing: (state, {payload}: PayloadAction<boolean>) => {
            state.isDrawing = payload;
            if (payload) {
                state.nodeId += 1;
            }
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

export const { setNodes, setNodeId, modifyPoints, setPoints, setIsDrawing, undo, redo } = drawBoardSlice.actions;

export const selectDrawBoard = (state: RootState) => state.drawBoard;

export default drawBoardSlice.reducer;