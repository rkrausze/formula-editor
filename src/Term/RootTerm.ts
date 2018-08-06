/// <reference path="SingleContainerTerm.ts" />
namespace fe {
    export class RootTerm extends SingleContainerTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent);
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize, this.d, g);
            let lh = this.fp.getLineThickness(iFontSize);
            this.dx = 5 * lh;
            this.dy = 0;
            this.dim.w = 6 * lh + this.d.w;
            this.dim.h1 = this.d.h1 + 2 * lh;
            this.dim.h2 = this.d.h2;
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            this.con.paintAll(g, x + this.dx, y + this.dy);
            let lh = this.fp.getLineThickness(this.iFontSize);
            let m = this.fp.getMiddleDelta(this.iFontSize) + lh / 2;
            let ctx = g.getContext("2d");
            ctx.fillRect(x + lh, y - m, lh, lh);
            ctx.beginPath();
            ctx.moveTo(x + 2 * lh, y - m);
            ctx.lineTo(x + 3 * lh, y + this.d.h2);
            //ctx.stroke();
            ctx.moveTo(x + 3 * lh, y + this.d.h2);
            ctx.lineTo(x + 4 * lh, y - this.d.h1 - lh);
            ctx.stroke();
            ctx.fillRect(x + 4 * lh, y - this.d.h1 - 2 * lh, 2 * lh + this.d.w - 1, lh);
        }

        toString(cursor: Term): string {
            return "\root2{" + this.con.toStringAll(cursor) + "}";
        }

        toMPad(): string {
            return "\\root{" + this.con.toMPadAll() + "}";
        }
    }
}