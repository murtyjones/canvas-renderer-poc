import React, { useEffect, useReducer, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Renderer } from './Renderer';
import { Shape } from './Renderer/Shape';
import { Image } from './Renderer/Image';
import { render } from '@testing-library/react';

function App() {
  const canvasEl = useRef<HTMLCanvasElement|null>(null);
  const r = useRef<null | Renderer>(null);

  useEffect(() => {
    if (!canvasEl.current) { return; }
    const renderer = new Renderer(canvasEl.current);
    r.current = renderer;
    const rect = new Shape(
      20,
      20,
      100,
      100,
      'red'
    );
    renderer.addObject(rect);
    const img = document.createElement('img');
    img.src = 'https://upload.wikimedia.org/wikipedia/en/0/00/The_Child_aka_Baby_Yoda_%28Star_Wars%29.jpg';
    const image = new Image(
      img,
      50,
      50,
      100,
      100
    );
    renderer.addObject(image);
  }, [canvasEl])

  const toggleShapeColors = () => {
    r.current!.objects.forEach(each => {
      if ('fill' in each) {
        each.fill = each.fill === 'green' ? 'red' : 'green';
        r.current!.valid = false;
      }
    });
  };

  return (
    <>
      <canvas id="my-canvas" ref={canvasEl} width="400" height="300">
        This text is displayed if your browser does not support HTML5 Canvas.
      </canvas>
      <button onClick={toggleShapeColors}>
        Toggle all shape colors
      </button>
    </>
  );
}

export default App;
