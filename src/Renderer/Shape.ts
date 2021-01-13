import Object from './Object';

export class Shape extends Object {
    constructor(
        public x: number,
        public y: number,
        public h: number,
        public w: number,
        public fill: string | CanvasGradient | CanvasPattern
    ) {
        super();
    };

    getLeftPoint () {
        return this.x;
    }

    getTopPoint () {
        return this.y;
    }

    getWidth () {
        return this.w;
    }

    getHeight () {
        return this.h;
    }

    setLeftPoint (newLeft: number) {
        this.x = newLeft;
    }

    setTopPoint (newTop: number) {
        this.y = newTop;
    }

    draw (ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}