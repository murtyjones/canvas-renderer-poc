export default abstract class Object {
    abstract getLeftPoint (): number;

    abstract getTopPoint (): number;

    abstract getWidth (): number;

    abstract getHeight (): number;

    abstract setLeftPoint (newLeft: number): void;

    abstract setTopPoint (newTop: number): void;

    abstract draw (ctx: CanvasRenderingContext2D): void;

    contains (mx: number, my: number) {
        const x = this.getLeftPoint();
        const y = this.getTopPoint();
        const w = this.getWidth();
        const h = this.getHeight();
        // All we have to do is make sure the Mouse X,Y fall in the area between
        // the shape's X and (X + Width) and its Y and (Y + Height)
        return  (x <= mx) && (x + w >= mx) && (y <= my) && (y + h >= my);
    }
}