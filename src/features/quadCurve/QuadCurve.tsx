import * as React from 'react';
import { Shape, Circle } from "react-konva";
import type { Context } from "konva/lib/Context";
import { Shape as ShapeType } from "konva/lib/Shape";
import { KonvaEventObject } from 'konva/lib/Node';

export const QuadCurve = ({ id, points, stroke, strokeWidth }: { id: string, points: number[], stroke: string, strokeWidth: number }) => {
    const [anchorPoint, setAnchorPoint] = React.useState<number[]>([
        (points[0] + points[2]) / 2,
        (points[1] + points[3]) / 2,
    ]);
    const center = [(points[0] + points[2]) / 2, (points[1] + points[3]) / 2];

    const sceneFunc = (ctx: Context, shape: ShapeType) => {
        if (points.length !== 4)
            return;
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        ctx.quadraticCurveTo(anchorPoint[0], anchorPoint[1], points[2], points[3]);
        ctx.fillStrokeShape(shape);
    };

    const anchorEvent = {
        handleDragMove (e: KonvaEventObject<DragEvent>) {
            setAnchorPoint([e.evt.offsetX, e.evt.offsetY]);
        },
        handleMouseDown(e: KonvaEventObject<MouseEvent>) {
            e.cancelBubble = true;
        }
    };

    return (
        <>
            <Shape stroke={stroke} strokeWidth={strokeWidth} sceneFunc={sceneFunc} />
            { anchorPoint.every(x => x) ?
                <Circle id={id} x={center[0]} y={center[1]} radius={25} stroke="gray" strokeWidth={5} draggable={true} dash={[10, 10]}
                    onMouseDown={anchorEvent.handleMouseDown} onDragMove={anchorEvent.handleDragMove}
                /> : null }
        </>
    );
}