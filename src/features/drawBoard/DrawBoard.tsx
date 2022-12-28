import React from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAppSelector } from '../../app/hooks';
import { selectToolBox } from '../toolBox/toolBoxSlice';
import type { ShapeType } from '../toolBox/toolBoxSlice';
import { QuadCurve } from '../quadCurve/QuadCurve';

type NodeProp = {
    id: string,
    points: number[],
    strokeWidth: number,
};

type createdNode = {
    shape: ShapeType,
    prop: NodeProp,
};

type EventMapper = {
    [T in ShapeType]: {
        handleMouseDown: (e: KonvaEventObject<DragEvent>) => void,
        handleMouseMove: (e: KonvaEventObject<DragEvent>) => void,
        handleMouseUp: (e: KonvaEventObject<DragEvent>) => void,
    };
};

const mapper: {[T in ShapeType]: (props: NodeProp) => JSX.Element} = {
    "line": (props) => <Line key={props.id} id={props.id} points={props.points ? [...props.points] : []} stroke="black" strokeWidth={props.strokeWidth}></Line>,
    "curve": ({ id, points, strokeWidth }) => <QuadCurve key={id} id={id} points={points ? [...points] : []} stroke="black" strokeWidth={strokeWidth} />,
    "circle": ({ id, points, strokeWidth }) => <Circle key={id} id={id} x={points[2]} y={points[3]} stroke="black" radius={points[4]} strokeWidth={strokeWidth} ></Circle>,
    "rect": ({ id, points, strokeWidth }) => <Rect key={id} id={id} x={points[0]} y={points[1]} width={points[2]} height={points[3]} stroke="black" strokeWidth={strokeWidth} ></Rect>,
    "poly": (props) => <></>,
};

let id = 0;

export const DrawBoard = () => {
    const [nodes, setNodes] = React.useState<createdNode[]>([]);
    const [points, setPoints] = React.useState<number[]>([]);
    const [isDrawing, setIsDrawing] = React.useState<boolean>(false);

    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape, strokeWidth } = toolBoxState;

    const eventMapper: EventMapper = {
        "line": {
            handleMouseDown: (e) => {
                setPoints([e.evt.offsetX, e.evt.offsetY]);
                setIsDrawing(true);
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return;
                setPoints([...points.slice(0, 2), e.evt.offsetX, e.evt.offsetY]);
            },
            handleMouseUp: (e) => {
                const newNodeProp: NodeProp = {
                    id: id.toString(),
                    points: [...points],
                    strokeWidth,
                };
                id++;
                setNodes([...nodes, { shape: selectedShape, prop: newNodeProp }]);
                setIsDrawing(false);
                setPoints([]);
            },
        },
        "curve": {
            handleMouseDown: (e) => {
                setPoints([e.evt.offsetX, e.evt.offsetY]);
                setIsDrawing(true);
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return;
                setPoints([...points.slice(0, 2), e.evt.offsetX, e.evt.offsetY]);
            },
            handleMouseUp: (e) => {
                const newNodeProp: NodeProp = {
                    id: id.toString(),
                    points: [...points],
                    strokeWidth,
                };
                id++;
                setNodes([...nodes, { shape: selectedShape, prop: newNodeProp }]);
                setIsDrawing(false);
                setPoints([]);
            },
        },
        "circle": {
            handleMouseDown: (e) => {
                const start = [e.evt.offsetX, e.evt.offsetY];
                setPoints([...start, ...start, 0, 0]);
                setIsDrawing(true);
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return; 
                const { offsetX, offsetY } = e.evt;
                const center = [points[0] + offsetX, points[1] + offsetY].map(x => x / 2);
                const radius = [center[0] - offsetX, center[1] - offsetY].map(x => Math.abs(x)).reduce((prev, curr) => Math.min(prev, curr));
                setPoints([...points.slice(0, 2), ...center, radius]);
            },
            handleMouseUp: (e) => {
                const newNodeProp: NodeProp = {
                    id: id.toString(),
                    points: [...points],
                    strokeWidth,
                };
                id++;
                setNodes([...nodes, { shape: selectedShape, prop: newNodeProp }]);
                setIsDrawing(false);
                setPoints([]);
            },
        },
        "rect": {
            handleMouseDown: (e) => {
                const start = [e.evt.offsetX, e.evt.offsetY];
                setPoints([...start, 0, 0]);
                setIsDrawing(true);
            },
            handleMouseMove: (e) => {
                if (!isDrawing) return; 
                const { offsetX, offsetY } = e.evt;
                const width = offsetX - points[0];
                const height = offsetY - points[1];

                setPoints([...points.slice(0, 2), width, height]);
            },
            handleMouseUp: (e) => {
                const newNodeProp: NodeProp = {
                    id: id.toString(),
                    points: [...points],
                    strokeWidth,
                };
                id++;
                setNodes([...nodes, { shape: selectedShape, prop: newNodeProp }]);
                setIsDrawing(false);
                setPoints([]);
            },
        },
        "poly": {
            handleMouseDown: (e) => {},
            handleMouseMove: (e) => {},
            handleMouseUp: (e) => {},
        },
    }

    const { handleMouseDown, handleMouseMove, handleMouseUp } = eventMapper[selectedShape];

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
            <Layer>
                {nodes.map(({ shape, prop }) => (mapper[shape](prop))) }
                { isDrawing ? mapper[selectedShape]({id: id.toString(), points: [...points], strokeWidth}) : null }
            </Layer>
        </Stage>
    );
};
