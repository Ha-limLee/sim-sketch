import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { Container, styled } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectToolBox,
  setColor,
  setShapeType,
  setStrokeWidth,
  Shapes,
} from "./toolBoxSlice";
import type { ShapeType } from "./toolBoxSlice";
import { undo, redo, setIsDrawing } from "../drawBoard/drawBoardSlice";

const GreySlider = styled(Slider)(({ theme }) => ({
  color: theme.status.grey,
}));
const RedSlider = styled(Slider)(({ theme }) => ({ color: theme.status.red }));
const GreenSlider = styled(Slider)(({ theme }) => ({
  color: theme.status.green,
}));
const BlueSlider = styled(Slider)(({ theme }) => ({
  color: theme.status.blue,
}));

export const ToolBox = () => {
  const toolBoxState = useAppSelector(selectToolBox);
  const { selectedShape, color, strokeWidth } = toolBoxState;
  const dispatch = useAppDispatch();

  const handleClick = (shape: ShapeType) => {
    dispatch(setShapeType(shape));
    dispatch(setIsDrawing(false));
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={6}>
          <ButtonGroup
            variant="outlined"
            aria-label="outlined primary button group"
          >
            {Shapes.map((shape) => (
              <Button
                key={shape}
                disabled={shape === selectedShape}
                onClick={() => handleClick(shape)}
              >
                {shape}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={2}>
          <ButtonGroup
            variant="outlined"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => dispatch(undo())}>
              <UndoIcon />
            </Button>
            <Button onClick={() => dispatch(redo())}>
              <RedoIcon />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid container item xs={8}>
          <Grid item xs={11}>
            <GreySlider
              size="small"
              min={5}
              max={50}
              defaultValue={10}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChangeCommitted={(e, value) =>
                dispatch(setStrokeWidth(value as number))
              }
            />
          </Grid>

          <Grid item xs={11}>
            <RedSlider
              size="small"
              min={0}
              max={255}
              defaultValue={0}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChangeCommitted={(e, value) =>
                dispatch(setColor({ ...color, red: value as number }))
              }
            />
          </Grid>

          <Grid item xs={11}>
            <GreenSlider
              size="small"
              min={0}
              max={255}
              defaultValue={0}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChangeCommitted={(e, value) =>
                dispatch(setColor({ ...color, green: value as number }))
              }
            />
          </Grid>

          <Grid item xs={11}>
            <BlueSlider
              size="small"
              min={0}
              max={255}
              defaultValue={0}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChangeCommitted={(e, value) =>
                dispatch(setColor({ ...color, blue: value as number }))
              }
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={1}
          mt={2}
          sx={{
            backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
            height: strokeWidth,
          }}
        />
      </Grid>
    </Container>
  );
};
