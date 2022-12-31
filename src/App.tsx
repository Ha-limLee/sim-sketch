import React from 'react';
import { ToolBox } from './features/toolBox/ToolBox';
import { DrawBoard } from './features/drawBoard/DrawBoard';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Container>
      <ToolBox />
      <DrawBoard />
    </Container>
  );
};

export default App;