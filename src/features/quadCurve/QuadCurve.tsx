import * as React from 'react';
import { Shape, Circle } from "react-konva";
import type { Context } from "konva/lib/Context";
import { Shape as ShapeType } from "konva/lib/Shape";
import { KonvaEventObject } from 'konva/lib/Node';
import { useAppDispatch } from '../../app/hooks';
import { modifyPoints } from '../drawBoard/drawBoardSlice';

export const QuadCurve = ({ id, points, stroke, strokeWidth }: { id: string, points: number[], stroke: string, strokeWidth: number}) => {
    const [anchorPoint, setAnchorPoint] = React.useState<number[]>([points[2], points[3]]);
    const dispatch = useAppDispatch();

    const sceneFunc = {
        onMove (ctx: Context, shape: ShapeType) {
            ctx.beginPath();
            ctx.moveTo(points[0], points[1]);
            ctx.lineTo(points[4], points[5]);
            ctx.fillStrokeShape(shape);
        },
        onEnd (ctx: Context, shape: ShapeType) {
            ctx.beginPath();
            ctx.moveTo(points[0], points[1]);
            ctx.quadraticCurveTo(anchorPoint[0], anchorPoint[1], points[4], points[5]);
            ctx.fillStrokeShape(shape);
        },
    };

    const anchorEvent = {
        handleMouseDown(e: KonvaEventObject<MouseEvent>) {
            e.cancelBubble = true;
        },
        handleDragMove (e: KonvaEventObject<DragEvent>) {
            setAnchorPoint([e.evt.offsetX, e.evt.offsetY]);
        },
        handleDragEnd({ evt: { offsetX, offsetY } }: KonvaEventObject<DragEvent>) {
            dispatch(modifyPoints({ id, points: [points[0], points[1], offsetX, offsetY, points[4], points[5]] }));
        },
        handleMouseUp(e: KonvaEventObject<MouseEvent>) {
            e.cancelBubble = true;
        },
    };

    return (
        <>
            <Shape stroke={stroke} strokeWidth={strokeWidth} sceneFunc={anchorPoint.every(x => x) ? sceneFunc.onEnd : sceneFunc.onMove} />
            { anchorPoint.every(x => x) ?
                <Circle x={anchorPoint[0]} y={anchorPoint[1]} radius={25} stroke="gray" strokeWidth={5} draggable={true} dash={[10, 10]}
                    onMouseDown={anchorEvent.handleMouseDown} onDragMove={anchorEvent.handleDragMove} onDragEnd={anchorEvent.handleDragEnd} onMouseUp={anchorEvent.handleMouseUp}
                /> : null }
        </>
    );
}