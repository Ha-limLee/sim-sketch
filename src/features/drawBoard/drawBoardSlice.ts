import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { KonvaEventObject } from 'konva/lib/Node';
import { ShapeType } from '../toolBox/toolBoxSlice';

export type NodeProp = {
    id: string,
    points: number[],
    strokeWidth: number,
    handleClick?: (e: KonvaEventObject<MouseEvent>) => void,
    isDrawing?: boolean,
    color: string,
};

export type createdNode = {
    shape: ShapeType,
    prop: NodeProp,
};

export interface DrawBoardState {
    nodeId: number,
    nodes: createdNode[];
}

const initialState: DrawBoardState = {
    nodeId: 0,
    nodes: [],
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
    }
});

export const { setNodes, setNodeId } = drawBoardSlice.actions;

export const selectDrawBoard = (state: RootState) => state.drawBoard;

export default drawBoardSlice.reducer;