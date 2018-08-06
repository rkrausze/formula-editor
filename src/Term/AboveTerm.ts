/// <reference path="DoubleContainerTerm.ts" />
namespace fe {
    export class AboveTerm extends DoubleContainerTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent, true);
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize, this.d2, g);
            // FontMetrics fm = fp.getFontMetrics(0, iFontSize);
            let m = this.fp.getMiddleDelta(iFontSize);
            let lh = this.fp.getLineThickness(iFontSize);
            let wb = (this.d1.w > this.d2.w ? this.d1.w : this.d2.w);
            this.dx1 = 2 * lh + (wb - this.d1.w) / 2;
            this.dx2 = 2 * lh + (wb - this.d2.w) / 2;
            this.dy1 = -m - lh * 3 / 2 - this.d1.h2;
            this.dy2 = -m + (lh * 3 - lh * 3 / 2) + this.d2.h1;
            this.dim.w = wb + 4 * lh;
            this.dim.h1 = -this.dy1 + this.d1.h1;
            this.dim.h2 = this.dy2 + this.d2.h2;
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            this.con1.paintAll(g, x + this.dx1, y + this.dy1);
            this.con2.paintAll(g, x + this.dx2, y + this.dy2);
            /*
            * int m = fp.getMiddleDelta(iFontSize); int lh =
            * fp.getLineThickness(iFontSize); g.fillRect(x+lh, y-m-lh/2,
            * dim.w-2*lh, lh);
            */
        }

        toString(cursor: Term): string {
            return "\\above" + super.toString(cursor)
        }

        toMPad(): string {
            return "{" + this.con1.toMPadAll() + "}\\over{" + this.con2.toMPadAll() + "}";
        }

    }
}