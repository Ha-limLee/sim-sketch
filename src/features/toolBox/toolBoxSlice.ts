import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export const Shapes = ["line", "curve", "circle", "rect", "poly"] as const;

export type ShapeType = typeof Shapes[number];

export interface ToolBoxState {
    selectedShape: ShapeType;
    strokeWidth: number;
}

const initialState: ToolBoxState = {
    selectedShape: "line",
    strokeWidth: 10,
};

export const toolBoxSlice = createSlice({
    name: "toolBox",
    initialState,
    reducers: {
        setShapeType: (state, { payload }: PayloadAction<ShapeType>) => {
            state.selectedShape = payload;
        },
        setStrokeWidth: (state, { payload }: PayloadAction<number>) => {
            state.strokeWidth = payload;
        },
    }
});

export const { setShapeType, setStrokeWidth } = toolBoxSlice.actions;

export const selectToolBox = (state: RootState) => state.toolBox;

export default toolBoxSlice.reducer;