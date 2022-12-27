import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectToolBox, setShapeType, ShapeType } from './toolBoxSlice';
import { Shapes } from './toolBoxSlice';

export const ToolBox = () => {
    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape } = toolBoxState;
    const dispatch = useAppDispatch();

    const handleClick = (shape: ShapeType) => {
        dispatch(setShapeType(shape));
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                {Shapes.map(shape => <Button key={shape} disabled={shape === selectedShape} onClick={ () => handleClick(shape) } >{ shape }</Button>)}
            </ButtonGroup>
            <Slider
                size="small"
                defaultValue={70}
                aria-label="Small"
                valueLabelDisplay="auto"
            />
        </>
    );
};