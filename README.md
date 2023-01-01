# Sim Sketch
![main page](/doc/img/main.png)

## Features

### 1. Create shapes

- Line

Just drag the screen.

![create line](/doc/img/create-line.png)

- Curve

Select `CURVE` on the tool box and drag the screen.

![create curve 1](/doc/img/create-curve-1.png)

Drag the dashed circle to bend the line.

![create curve 2](/doc/img/create-curve-2.png)

- Circle

Select `CIRCLE` on the tool box and drag the screen.

![create circle](/doc/img/create-circle.png)

- Rectangle

Select `RECT` on the tool box and drag the screen.

![create rect](/doc/img/create-rect.png)

- Polygon

Select `POLY` on the tool box and click the screen.

You can see a small circle has been created.

![create poly 1](/doc/img/create-poly-1.png)

Click anywhere to set vertices.

![create poly 2](/doc/img/create-poly-2.png)

Click the first circle to finish drawing.

![create poly 3](/doc/img/create-poly-3.png)


### 2. Set stroke

Drag the point on the first slider to resize the stroke width.

You can set the stroke width from 5px to 50px.

![set stroke width](/doc/img/set-stroke-width.png)

Drag red, green, and blue slider to set the color of the stroke.

Each value range from 0 to 255.

![set stroke color](/doc/img/set-stroke-color.png)

### 3. Undo & Redo

Press `↶` button to undo recent shape creations.

- Before undo

![before undo](/doc/img/undo-before.png)

- After undo

![after undo](/doc/img/undo-after.png)

Press `↷` button to redo the actions.

※ You can redo only 40 times.

- After redo

![after redo](/doc/img/redo-after.png)


## How to run the project.

Fork or clone this repo.

At root directory, type below commands to install all dependencies.

> npm install

Now you can launch dev server.

> npm run serve