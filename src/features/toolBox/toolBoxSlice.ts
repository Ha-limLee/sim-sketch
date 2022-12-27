import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export const Shapes = ["line", "curve", "circle", "rect", "poly"] as const;

export type ShapeType = typeof Shapes[number];

export interface ShapeState {
    selectedShape: ShapeType;
}

const initialState: ShapeState = {
    selectedShape: "line",
}

export const toolBoxSlice = createSlice({
    name: "toolBox",
    initialState,
    reducers: {
        setShapeType: (state, { payload }: PayloadAction<ShapeType>) => {
            state.selectedShape = payload;
        },
    }
});

export const { setShapeType } = toolBoxSlice.actions;

export const selectToolBox = (state: RootState) => state.toolBox;

export default toolBoxSlice.reducer;