
import React from 'react';
import { Stage, Layer, Star, Line } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAppSelector } from '../../app/hooks';
import { selectToolBox } from '../toolBox/toolBoxSlice';
import type { ShapeType } from '../toolBox/toolBoxSlice';

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

type NodeProp = {
    id: string,
    points?: number[],
};

type createdNode = {
    shape: ShapeType,
    prop: NodeProp,
};

const mapper: {[T in ShapeType]: (props: NodeProp) => JSX.Element} = {
    "line": (props) => <Line key={props.id} id={props.id} points={props.points ? [...props.points] : []} stroke="black" strokeWidth={10}></Line>,
    "curve": (props) => <></>,
    "circle": (props) => <></>,
    "rect": (props) => <></>,
    "poly": (props) => <></>,
};

const INITIAL_STATE = generateShapes();

let id = 0;

export const DrawBoard = () => {
    const [nodes, setNodes] = React.useState<createdNode[]>([]);
    const [stars, setStars] = React.useState(INITIAL_STATE);
    const [startPoint, setStartPoint] = React.useState<number[]>([]);
    const [endPoint, setEndPoint] = React.useState<number[]>([]);
    const [isDrawing, setIsDrawing] = React.useState<boolean>(false);

    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape } = toolBoxState;

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })
    );
  };
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        }; 
      })
    );
  };
    const handleMouseDown = (e: KonvaEventObject<DragEvent>) => {
        setStartPoint([e.evt.offsetX, e.evt.offsetY]);
        setIsDrawing(true);
    };
    
    const handleMouseMove = (e: KonvaEventObject<DragEvent>) => {
        if (isDrawing) setEndPoint([e.evt.offsetX, e.evt.offsetY]);
    };

    const handleMouseUp = (e: KonvaEventObject<DragEvent>) => {
        setNodes([...nodes, { shape: selectedShape, prop: { id: id.toString(), points: [...startPoint, e.evt.offsetX, e.evt.offsetY] } }]);
        id++;
        setIsDrawing(false);
        setStartPoint([]);
        setEndPoint([]);
    };

  return (
      <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
          <Layer>
            {nodes.map(({ shape, prop }) => (mapper[shape](prop))) }
            { isDrawing ? mapper[selectedShape]({id: id.toString(), points: [...startPoint, ...endPoint]}) : null }
        </Layer>
    </Stage>
  );
};
