import * as React from "react";
import { Shape, Circle } from "react-konva";
import type { Context } from "konva/lib/Context";
import { Shape as ShapeType } from "konva/lib/Shape";
import { KonvaEventObject } from "konva/lib/Node";

export const QuadCurve = ({
  id,
  points,
  anchorPoint,
  stroke,
  strokeWidth,
  isDrawing,
  onAnchorDragEnd,
}: {
  id: string;
  points: number[];
  anchorPoint?: number[];
  stroke: string;
  strokeWidth?: number;
  isDrawing?: boolean;
  onAnchorDragEnd?: (anchor: number[]) => void;
}) => {
  const [anchor, setAnchor] = React.useState<number[]>(anchorPoint ?? []);

  const sceneFunc = (ctx: Context, shape: ShapeType) => {
    const [anchorX = 0, anchorY = 0] = anchor;
    const [x0 = 0, y0 = 0, x1 = 0, y1 = 0] = points;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    if (anchorPoint && anchorPoint.length === 2)
      ctx.quadraticCurveTo(anchorX, anchorY, x1, y1);
    ctx.lineTo(x1, y1);
    ctx.fillStrokeShape(shape);
  };

  const anchorEvent = {
    handleMouseDown(e: KonvaEventObject<MouseEvent>) {
      e.cancelBubble = true;
    },
    handleDragMove(e: KonvaEventObject<DragEvent>) {
      e.cancelBubble = true;
      const { offsetX, offsetY } = e.evt;
      setAnchor([offsetX, offsetY]);
    },
    handleDragEnd(e: KonvaEventObject<DragEvent>) {
      e.cancelBubble = true;
      onAnchorDragEnd?.(anchor);
    },
    handleMouseUp(e: KonvaEventObject<MouseEvent>) {
      e.cancelBubble = true;
    },
  };

  return (
    <>
      <Shape stroke={stroke} strokeWidth={strokeWidth} sceneFunc={sceneFunc} />
      {anchorPoint && anchorPoint.length == 2 && isDrawing ? (
        <Circle
          x={anchorPoint[0]}
          y={anchorPoint[1]}
          radius={25}
          stroke="gray"
          strokeWidth={5}
          draggable={true}
          dragg
          dash={[10, 10]}
          onMouseDown={anchorEvent.handleMouseDown}
          onDragMove={anchorEvent.handleDragMove}
          onDragEnd={anchorEvent.handleDragEnd}
          onMouseUp={anchorEvent.handleMouseUp}
        />
      ) : null}
    </>
  );
};
