import * as React from 'react';
import { Shape, Circle } from "react-konva";
import type { Context } from "konva/lib/Context";
import { Shape as ShapeType } from "konva/lib/Shape";
import { KonvaEventObject } from 'konva/lib/Node';
import { useAppDispatch } from '../../app/hooks';
import { modifyProp } from '../drawBoard/drawBoardSlice';

export const QuadCurve = ({ id, points, anchorPoint, stroke, strokeWidth }: { id: string, points: number[], anchorPoint?: number[], stroke: string, strokeWidth: number}) => {
    const dispatch = useAppDispatch();

    const sceneFunc = (ctx: Context, shape: ShapeType) => {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        if (anchorPoint && anchorPoint.length === 2)
            ctx.quadraticCurveTo(anchorPoint[0], anchorPoint[1], points[2], points[3]);
        ctx.lineTo(points[2], points[3]);
        ctx.fillStrokeShape(shape);
    }

    const anchorEvent = {
        handleMouseDown(e: KonvaEventObject<MouseEvent>) {
            e.cancelBubble = true;
        },
        handleDragMove(e: KonvaEventObject<DragEvent>) {
            e.cancelBubble = true;
            const { offsetX, offsetY } = e.evt;
            dispatch(modifyProp({id, anchorPoint: [offsetX, offsetY]}));
        },
        handleMouseUp(e: KonvaEventObject<MouseEvent>) {
            e.cancelBubble = true;
        },
    };

    return (
        <>
            <Shape stroke={stroke} strokeWidth={strokeWidth} sceneFunc={sceneFunc} />
            {anchorPoint && anchorPoint.length == 2
                ? <Circle x={anchorPoint[0]} y={anchorPoint[1]} radius={25} stroke="gray" strokeWidth={5} draggable={true} dash={[10, 10]}
                    onMouseDown={anchorEvent.handleMouseDown} onDragMove={anchorEvent.handleDragMove} onMouseUp={anchorEvent.handleMouseUp} />
                : null}
        </>
    );
}