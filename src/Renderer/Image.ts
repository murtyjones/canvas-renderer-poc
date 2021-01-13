import Object from './Object';

export class Image extends Object {
    constructor(
        public image: CanvasImageSource,
        public dx: number,
        public dy: number,
        public dWidth: number,
        public dHeight: number,
        ) {
            super();
        };

        getLeftPoint () {
            return this.dx;
        }
    
        getTopPoint () {
            return this.dy;
        }
    
        getWidth () {
            return this.dWidth;
        }
    
        getHeight () {
            return this.dHeight;
        }

        setLeftPoint (newLeft: number) {
            this.dx = newLeft;
        }
    
        setTopPoint (newTop: number) {
            this.dy = newTop;
        }

        draw (ctx: CanvasRenderingContext2D) {
            void ctx.drawImage(this.image, this.dx, this.dy, this.dWidth, this.dHeight);
        }
}