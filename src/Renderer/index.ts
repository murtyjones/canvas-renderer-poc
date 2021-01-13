import { Image } from "./Image";
import { Shape } from "./Shape";

type Object = Shape | Image;

export class Renderer {
    private ctx: CanvasRenderingContext2D;
  
    public valid: boolean;
  
    public objects: Object[];
  
    private selection: Object | null;
  
    private selectionColor: string;
  
    private selectionWidth: number;
  
    private redrawInterval: number; // ms
  
    private dragoffx: number;
  
    private dragoffy: number;
  
    private dragging: boolean;
  
    constructor(private canvas: HTMLCanvasElement) {
      this.ctx = canvas.getContext('2d')!;
      this.valid = false; // when set to false, the canvas will redraw everything
      this.objects = [];  // the collection of things to be drawn
      this.selection = null;
      this.selectionColor = '#CC0000';
      this.selectionWidth = 2;  
      this.redrawInterval = 30;
      this.dragoffx = 0; // See mousedown and mousemove events for explanation
      this.dragoffy = 0;
      this.dragging = false;
      const _this = this;
      //fixes a problem where double clicking causes text to get selected on the canvas
      canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
      // Up, down, and move are for dragging
      canvas.addEventListener('mousedown', function(e) {
        var mouse = _this.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = _this.objects;
        var l = shapes.length;
        for (var i = l-1; i >= 0; i--) {
          if (shapes[i].contains(mx, my)) {
            var mySel = shapes[i];
            // Keep track of where in the object we clicked
            // so we can move it smoothly (see mousemove)
            _this.dragoffx = mx - mySel.getLeftPoint();
            _this.dragoffy = my - mySel.getTopPoint()
            _this.dragging = true;
            _this.selection = mySel;
            _this.valid = false;
            return;
          }
        }
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (_this.selection) {
          _this.selection = null;
          _this.valid = false; // Need to clear the old selection border
        }
      }, true);
      canvas.addEventListener('mousemove', function(e) {
        if (_this.dragging && _this.selection){
          var mouse = _this.getMouse(e);
          // We don't want to drag the object by its top-left corner, we want to drag it
          // from where we clicked. Thats why we saved the offset and use it here
          _this.selection.setLeftPoint(mouse.x - _this.dragoffx);
          _this.selection.setTopPoint(mouse.y - _this.dragoffy);
          _this.valid = false; // Something's dragging so we must redraw
        }
      }, true);
      canvas.addEventListener('mouseup', function(e) {
        _this.dragging = false;
      }, true);
      // double click for making new shapes
      canvas.addEventListener('dblclick', function(e) {
        var mouse = _this.getMouse(e);
        _this.addObject(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
      }, true);
      this.redraw();
    }

    redraw () {
        this.draw();
        requestAnimationFrame(() => { this.redraw() });
    }
  
    draw () {
      if (!this.valid) {
        this.clear();
        this.objects.forEach(shape => {
            const x = shape.getLeftPoint();
            const y = shape.getTopPoint();
            const w = shape.getWidth()
            const h = shape.getHeight();
            // We can skip the drawing of elements that have moved off the screen:
            if (x > this.canvas.width || y > this.canvas.height || x + w < 0 || y + h < 0) return;
            shape.draw(this.ctx);
        });
  
        // draw selection
        // right now this is just a stroke along the edge of the selected Shape
        this.maybeDrawSelection();
        
        // ** Add stuff you want drawn on top all the time here **
        
        this.valid = true;
      }
    }
  
    clear () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    maybeDrawSelection () {
      if (this.selection) {
        this.ctx.strokeStyle = this.selectionColor;
        this.ctx.lineWidth = this.selectionWidth;
        var mySel = this.selection;
        this.ctx.strokeRect(mySel.getLeftPoint(), mySel.getTopPoint(), mySel.getWidth(), mySel.getHeight());
      }
    }
  
    addObject (shape: Object) {
      this.objects.push(shape);
      this.valid = false;
    }
  
    // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
    // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
    getMouse (e: MouseEvent) {
      let element: HTMLElement | null = this.canvas, offsetX = 0, offsetY = 0, mx, my;
      
      // Compute the total offset
      if (element.offsetParent !== undefined) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent as any));
      }
  
      // // Add padding and border style widths to offset
      // // Also add the <html> offsets in case there's a position:fixed bar
      // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
      // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  
      mx = e.pageX - offsetX;
      my = e.pageY - offsetY;
      
      // We return a simple javascript object (a hash) with x and y defined
      return {x: mx, y: my};
    }
  }