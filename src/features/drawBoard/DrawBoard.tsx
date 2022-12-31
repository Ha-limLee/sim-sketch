import React from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectToolBox } from '../toolBox/toolBoxSlice';
import type { ShapeType } from '../toolBox/toolBoxSlice';
import { QuadCurve } from '../quadCurve/QuadCurve';
import { selectDrawBoard, setNodes, setDraft, setIsDrawing } from './drawBoardSlice';
import type { NodeProp } from './drawBoardSlice';

type EventMapper = {
    [T in ShapeType]: {
        handleMouseDown: (e: KonvaEventObject<DragEvent>) => void,
        handleMouseMove: (e: KonvaEventObject<DragEvent>) => void,
        handleMouseUp: (e: KonvaEventObject<DragEvent>) => void,
    };
};

type DraftProp = NodeProp & { handleClick?: (evt: KonvaEventObject<MouseEvent>) => void; isDrawing?: boolean };

const nodeBuilder: { [T in ShapeType]: (props: DraftProp) => JSX.Element | JSX.Element[] | undefined } = {
    "line": ({ id, points, strokeWidth, color }) =>
                <Line key={id} id={id} points={points ? [...points] : []} stroke={color} strokeWidth={strokeWidth}></Line>,
    "curve": ({ id, points, anchorPoint, strokeWidth, color }) =>
                <QuadCurve key={id} id={id} points={points ? [...points] : []} anchorPoint={anchorPoint ? [...anchorPoint] : []} stroke={color ?? "black"} strokeWidth={strokeWidth ?? 5} />,
    "circle": ({ id, x, y, radius, strokeWidth, color }) =>
                <Circle key={id} id={id} x={x} y={y} stroke={color} radius={radius} strokeWidth={strokeWidth} ></Circle>,
    "rect": ({ id, x, y, width, height, strokeWidth, color }) =>
                <Rect key={id} id={id} x={x} y={y} width={width} height={height} stroke={color} strokeWidth={strokeWidth} ></Rect>,
    "poly": ({ id, x, y, points, strokeWidth, color, handleClick, isDrawing }) => {
        if (!points) return;
        return (
            isDrawing
                ? [<Line key={id} id={id} points={points ? [...points] : []} stroke={color} strokeWidth={1} />, <Circle key={id + 1} id={id + 1} x={points[0]} y={points[1]} radius={10} stroke="black" onClick={handleClick} />]
                : <Line key={id} id={id} points={points ? [...points] : []} stroke={color} strokeWidth={strokeWidth} closed={true} />
        );
    }
};

const toRgb = ({ red, green, blue }: { red: number, green: number, blue: number }) => `rgb(${red}, ${green}, ${blue})`;

export const DrawBoard = () => {
    const dispatch = useAppDispatch();
    
    const drawBoardState = useAppSelector(selectDrawBoard);
    const { nodes, draft, isDrawing } = drawBoardState;

    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape, strokeWidth, color } = toolBoxState;

    const createDraft = () => ({ id: draft.id, strokeWidth, color: toRgb(color) });

    const draftMapper: { [T in ShapeType] ?: DraftProp } = {
        poly: {
            ...draft,
            handleClick: (e: KonvaEventObject<MouseEvent>) => {
                dispatch(setNodes([...nodes, {shape: selectedShape, prop: draft}]));
                dispatch(setIsDrawing(false));
                dispatch(setDraft(createDraft()));
            },
            isDrawing: true,
        }
    };

    const eventMapper: EventMapper = {
        "line": {
            handleMouseDown: (e) => {
                const { offsetX, offsetY } = e.evt;
                dispatch(setDraft({ ...createDraft(), points: [offsetX, offsetY] }));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                const { points } = draft;
                if (!isDrawing || !points) return;
                const { offsetX, offsetY } = e.evt;
                dispatch(setDraft({ ...draft, points: [...points.slice(0, 2), offsetX, offsetY] }));
            },
            handleMouseUp: (e) => {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: draft }]));
                dispatch(setIsDrawing(false));
            },
        },
        "curve": {
            handleMouseDown: (e) => {
                const { offsetX, offsetY } = e.evt;
                dispatch(setDraft({ ...createDraft(), points: [offsetX, offsetY] }));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                const points = draft.points;
                if (!isDrawing || !points || points.length < 2) return;
                const { offsetX, offsetY } = e.evt;
                const anchorPoint = [points[0] + offsetX, points[1] + offsetY].map(x => x / 2);
                dispatch(setDraft({ ...draft, points: [...points.slice(0, 2), offsetX, offsetY], anchorPoint }));
            },
            handleMouseUp(e) {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: draft }]));
                dispatch(setIsDrawing(false));
            },
        },
        "circle": {
            handleMouseDown: (e) => {
                const { offsetX, offsetY } = e.evt;
                dispatch(setDraft({ ...createDraft(), points: [offsetX, offsetY], x: offsetX, y: offsetY }));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                const { points } = draft;
                if (!isDrawing || !points) return;

                const { offsetX, offsetY } = e.evt;
                const center = [points[0] + offsetX, points[1] + offsetY].map(x => x / 2);
                const radius = [center[0] - offsetX, center[1] - offsetY].map(x => Math.abs(x)).reduce((prev, curr) => Math.min(prev, curr));
                dispatch(setDraft({ ...draft, x: center[0], y: center[1], radius }));
            },
            handleMouseUp: (e) => {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: draft }]));
                dispatch(setIsDrawing(false));
            },
        },
        "rect": {
            handleMouseDown: (e) => {
                const { offsetX, offsetY } = e.evt;
                dispatch(setDraft({ ...createDraft(), x: offsetX, y: offsetY }));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                const { x, y } = draft;
                if (!isDrawing || !x || !y) return;
                const { offsetX, offsetY } = e.evt;
                const width = offsetX - x;
                const height = offsetY - y;
                dispatch(setDraft({ ...draft, width, height }));
            },
            handleMouseUp: (e) => {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: draft }]));
                dispatch(setIsDrawing(false));
            },
        },
        "poly": {
            handleMouseDown: (e) => { },
            handleMouseMove: (e) => { },
            handleMouseUp: (e) => {
                const { offsetX, offsetY } = e.evt;
                const { points } = draft;
                if (!isDrawing || !points) {
                    dispatch(setDraft({ ...createDraft(), points: [offsetX, offsetY] }));
                    dispatch(setIsDrawing(true));
                    return;
                }
                dispatch(setDraft({ ...draft, points: [...points, offsetX, offsetY] }));
            },
        },
    };

    const { handleMouseDown, handleMouseMove, handleMouseUp } = eventMapper[selectedShape];

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
            <Layer>
                {nodes.map(({ shape, prop }) => (nodeBuilder[shape](prop))) }
                {isDrawing ? nodeBuilder[selectedShape](draftMapper[selectedShape] ?? draft) : null}
            </Layer>
        </Stage>
    );
};
