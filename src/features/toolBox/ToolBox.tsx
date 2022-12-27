import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectToolBox, setShapeType, setStrokeWidth, Shapes } from './toolBoxSlice';
import type { ShapeType } from './toolBoxSlice';

export const ToolBox = () => {
    const toolBoxState = useAppSelector(selectToolBox);
    const { selectedShape } = toolBoxState;
    const dispatch = useAppDispatch();

    const handleClick = (shape: ShapeType) => {
        dispatch(setShapeType(shape));
    };

    const handleChange = (e: Event, value: number | number[]) => {
        dispatch(setStrokeWidth(value as number));
    };

    return (
        <Box mt={4} ml={2}>
            <Grid container>
                <Grid item xs={4}>
                    <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                        {Shapes.map(shape => <Button key={shape} disabled={shape === selectedShape} onClick={ () => handleClick(shape) } >{ shape }</Button>)}
                    </ButtonGroup>
                </Grid>
                <Grid item xs={8} />
                <Grid item xs={8}>
                    <Slider
                        size="small"
                        min={5}
                        max={50}
                        defaultValue={10}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};