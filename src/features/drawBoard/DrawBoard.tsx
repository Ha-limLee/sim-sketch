import React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAppSelector } from '../../app/hooks';
import { selectToolBox } from '../toolBox/toolBoxSlice';
import type { ShapeType } from '../toolBox/toolBoxSlice';

type NodeProp = {
    id: string,
    points?: number[],
    strokeWidth: number,
};

type createdNode = {
    shape: ShapeType,
    prop: NodeProp,
};

const mapper: {[T in ShapeType]: (props: NodeProp) => JSX.Element} = {
    "line": (props) => <Line key={props.id} id={props.id} points={props.points ? [...props.points] : []} stroke="black" strokeWidth={props.strokeWidth}></Line>,
    "curve": (props) => <></>,
    "circle": (props) => <></>,
    "rect": (props) => <></>,
    "poly": (props) => <></>,
};

let id = 0;

export const DrawBoard = () => {
    const [nodes, setNodes] = React.useState<createdNode[]>([]);
    const [startPoint, setStartPoint] = React.useState<number[]>([]);
    const [endPoint, setEndPoint] = React.useState<number[]>([]);
    const [isDrawing, setIsDrawing] = React.useState<boolean>(false);

    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape, strokeWidth } = toolBoxState;

    const handleMouseDown = (e: KonvaEventObject<DragEvent>) => {
        setStartPoint([e.evt.offsetX, e.evt.offsetY]);
        setIsDrawing(true);
    };
    
    const handleMouseMove = (e: KonvaEventObject<DragEvent>) => {
        if (isDrawing) setEndPoint([e.evt.offsetX, e.evt.offsetY]);
    };

    const handleMouseUp = (e: KonvaEventObject<DragEvent>) => {
        const newNodeProp: NodeProp = {
            id: id.toString(),
            points: [...startPoint, e.evt.offsetX, e.evt.offsetY],
            strokeWidth,
        };
        id++;
        setNodes([...nodes, { shape: selectedShape, prop: newNodeProp }]);
        setIsDrawing(false);
        setStartPoint([]);
        setEndPoint([]);
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
            <Layer>
                {nodes.map(({ shape, prop }) => (mapper[shape](prop))) }
                { isDrawing ? mapper[selectedShape]({id: id.toString(), points: [...startPoint, ...endPoint], strokeWidth}) : null }
            </Layer>
        </Stage>
    );
};
