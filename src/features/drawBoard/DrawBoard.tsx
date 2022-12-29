import React from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectToolBox } from '../toolBox/toolBoxSlice';
import type { ShapeType } from '../toolBox/toolBoxSlice';
import { QuadCurve } from '../quadCurve/QuadCurve';
import { DrawBoardState, selectDrawBoard, setNodes, setPoints, setIsDrawing } from './drawBoardSlice';
import type { NodeProp } from './drawBoardSlice';

type EventMapper = {
    [T in ShapeType]: {
        handleMouseDown: (e: KonvaEventObject<DragEvent>) => void,
        handleMouseMove: (e: KonvaEventObject<DragEvent>) => void,
        handleMouseUp: (e: KonvaEventObject<DragEvent>) => void,
    };
};

const group2 = (arr: number[]) => {
    const ret: number[][] = Array.from(Array(Math.floor((arr.length + 1) / 2)), () => []);
    arr.forEach((val, i) => {
        ret[Math.floor(i / 2)].push(val);
    });
    return ret;
}

const groupPoints = (arr: number[]) => {
    const points = group2(arr);
    const ret = [];
    for (let i = 0; i < points.length - 1; i++) {
        ret.push([...points[i], ...points[i + 1]]);
    }
    return ret;
};

const mapper: {[T in ShapeType]: (props: NodeProp) => JSX.Element | JSX.Element[]} = {
    "line": ({ id, points, strokeWidth, color }) => <Line key={id} id={id} points={points ? [...points] : []} stroke={color} strokeWidth={strokeWidth}></Line>,
    "curve": ({ id, points, strokeWidth, color }) => <QuadCurve key={id} id={id} points={points ? [...points] : []} stroke={color} strokeWidth={strokeWidth} />,
    "circle": ({ id, points, strokeWidth, color }) => <Circle key={id} id={id} x={points[2]} y={points[3]} stroke={color} radius={points[4]} strokeWidth={strokeWidth} ></Circle>,
    "rect": ({ id, points, strokeWidth, color }) => <Rect key={id} id={id} x={points[0]} y={points[1]} width={points[2]} height={points[3]} stroke={color} strokeWidth={strokeWidth} ></Rect>,
    "poly": ({ id, points, strokeWidth, color, handleClick, isDrawing }) => {
        if (isDrawing) {
            const first = <Circle key={id} id={id} x={points[0]} y={points[1]} radius={10} stroke="black" onClick={handleClick} ></Circle>
            const lines = groupPoints(points).map((point, i) => <Line key={id + i + 1} id={(id + i + 1).toString()} points={[...point]} stroke={color} strokeWidth={1}></Line>);
            return [first, ...lines];
        }
        return <Line key={id} id={id} points={[...points]} stroke={color} strokeWidth={strokeWidth} closed={true} />;
    }
};

const toRgb = ({ red, green, blue }: { red: number, green: number, blue: number }) => `rgb(${red}, ${green}, ${blue})`;

export const DrawBoard = () => {
    const dispatch = useAppDispatch();
    
    const customEquality = (oldVal: DrawBoardState, newVal: DrawBoardState) => (oldVal.nodes === newVal.nodes && oldVal.points === newVal.points && oldVal.isDrawing === newVal.isDrawing);
    const drawBoardState = useAppSelector(selectDrawBoard, customEquality);
    const { nodes, nodeId, points, isDrawing } = drawBoardState;

    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape, strokeWidth, color } = toolBoxState;

    const currNodeMapper: { [T in ShapeType | 'base'] ?: any } = {
        base() {
            return {
                id: nodeId.toString(),
                points: [...points],
                strokeWidth,
                color: toRgb(color),
            }
        },
        poly() {
            const source = this.base();
            return {
                ...source,
                handleClick: (e: KonvaEventObject<MouseEvent>) => {
                    dispatch(setNodes([...nodes, { shape: selectedShape, prop: {...source} }]));
                    dispatch(setIsDrawing(false));
                    dispatch(setPoints([]));
                },
                isDrawing: true,
            }
        }
    };

    const eventMapper: EventMapper = {
        "line": {
            handleMouseDown: (e) => {
                dispatch(setPoints([e.evt.offsetX, e.evt.offsetY]));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return;
                dispatch(setPoints([...points.slice(0, 2), e.evt.offsetX, e.evt.offsetY]));
            },
            handleMouseUp: (e) => {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: currNodeMapper.base() }]));
                dispatch(setIsDrawing(false));
                dispatch(setPoints([]));
            },
        },
        "curve": {
            handleMouseDown: (e) => {
                dispatch(setPoints([e.evt.offsetX, e.evt.offsetY]));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return;
                const { offsetX, offsetY } = e.evt;
                const center = [points[0] + offsetX, points[1] + offsetY].map(x => x / 2);
                dispatch(setPoints([...points.slice(0, 2), ...center, offsetX, offsetY]));
            },
            handleMouseUp(e) {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: currNodeMapper.base() }]));
                dispatch(setIsDrawing(false));
                dispatch(setPoints([]));
            },
        },
        "circle": {
            handleMouseDown: (e) => {
                const start = [e.evt.offsetX, e.evt.offsetY];
                dispatch(setPoints([...start, ...start, 0, 0]));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return;
                const { offsetX, offsetY } = e.evt;
                const center = [points[0] + offsetX, points[1] + offsetY].map(x => x / 2);
                const radius = [center[0] - offsetX, center[1] - offsetY].map(x => Math.abs(x)).reduce((prev, curr) => Math.min(prev, curr));
                dispatch(setPoints([...points.slice(0, 2), ...center, radius]));
            },
            handleMouseUp: (e) => {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: currNodeMapper.base() }]));
                dispatch(setIsDrawing(false));
                dispatch(setPoints([]));
            },
        },
        "rect": {
            handleMouseDown: (e) => {
                const start = [e.evt.offsetX, e.evt.offsetY];
                dispatch(setPoints([...start, 0, 0]));
                dispatch(setIsDrawing(true));
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return;
                const { offsetX, offsetY } = e.evt;
                const width = offsetX - points[0];
                const height = offsetY - points[1];
                dispatch(setPoints([...points.slice(0, 2), width, height]));
            },
            handleMouseUp: (e) => {
                dispatch(setNodes([...nodes, { shape: selectedShape, prop: currNodeMapper.base() }]));
                dispatch(setIsDrawing(false));
                dispatch(setPoints([]));
            },
        },
        "poly": {
            handleMouseDown: (e) => { },
            handleMouseMove: (e) => { },
            handleMouseUp: (e) => {
                const { offsetX, offsetY } = e.evt;
                dispatch(setPoints([...points, offsetX, offsetY]));
                dispatch(setIsDrawing(true));
            },
        },
    };

    const { handleMouseDown, handleMouseMove, handleMouseUp } = eventMapper[selectedShape];

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
            <Layer>
                {nodes.map(({ shape, prop }) => (mapper[shape](prop))) }
                { isDrawing ? mapper[selectedShape]((selectedShape in currNodeMapper) ? currNodeMapper[selectedShape]() : currNodeMapper.base()) : null }
            </Layer>
        </Stage>
    );
};
