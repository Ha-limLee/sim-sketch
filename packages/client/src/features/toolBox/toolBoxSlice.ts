import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export const Shapes = ["line", "curve", "circle", "rect", "poly"] as const;

export type ShapeType = typeof Shapes[number];

export interface ToolBoxState {
    selectedShape: ShapeType;
    strokeWidth: number;
    color: {
        red: number,
        green: number,
        blue: number,
    };
}

const initialState: ToolBoxState = {
    selectedShape: "line",
    strokeWidth: 10,
    color: {
        red: 0,
        green: 0,
        blue: 0,
    }
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
        setColor: (state, { payload }: PayloadAction<{red: number, green: number, blue: number}>) => {
            state.color = { ...payload };
        }
    }
});

export const { setShapeType, setStrokeWidth, setColor } = toolBoxSlice.actions;

export const selectToolBox = (state: RootState) => state.toolBox;

export default toolBoxSlice.reducer;