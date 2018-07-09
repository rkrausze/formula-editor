/// <reference path="DoubleContainerTerm.ts" />
namespace fe {
    export class RootNTerm extends DoubleContainerTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent, false);
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            let m = this.fp.getMiddleDelta(iFontSize);
            let lh = this.fp.getLineThickness(iFontSize);
            // Wert
            this.dx1 = this.d2.w + 4 * lh;
            this.dy1 = 0;
            // Radikant
            this.dx2 = lh;
            this.dy2 = -this.d2.h2 - m - lh;
            // gesamt
            this.dim.w = this.dx1 + this.d1.w + 2 * lh;
            let h11 = this.d1.h1 + 2 * lh, h12 = this.d2.h1 - this.dy2;
            this.dim.h1 = h11 > h12 ? h11 : h12;
            this.dim.h2 = this.d1.h2;
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            super.paint(g, x, y);
            let lh = this.fp.getLineThickness(this.iFontSize);
            let m = this.fp.getMiddleDelta(this.iFontSize) + lh / 2;
            let ctx = g.getContext("2d");
            ctx.fillRect(x + lh, y - m, this.d2.w, lh);
            ctx.beginPath();
            ctx.moveTo(x + lh + this.d2.w, y - m);
            ctx.lineTo(x + 2 * lh + this.d2.w, y + this.d1.h2);
            //ctx.stroke();
            ctx.moveTo(x + 2 * lh + this.d2.w, y + this.d1.h2);
            ctx.lineTo(x + this.dx1, y - this.d1.h1 - lh);
            ctx.stroke();
            ctx.fillRect(x + this.dx1, y - this.d1.h1 - 2 * lh, 2 * lh + this.d1.w - 1, lh);
        }

        // Mauspositionierung
        fromXY(x: number, y: number): Term {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            // links, rechts
            if (x <= this.x + this.d2.w)
                return this.con2.fromXY(x, y);
            return this.con1.fromXY(x, y);
        }

        toString(): string {
            return "\rootn{" + this.con1 + "}{" + this.con2 + "}";
        }

        toMPad(): string {
            return "{" + this.con2.toMPadAll() + "}\\nroot{" + this.con1.toMPadAll() + "}";
        }
    }
}