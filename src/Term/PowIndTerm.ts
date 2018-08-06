/// <reference path="DoubleContainerTerm.ts" />
namespace fe {
    export class PowIndTerm extends DoubleContainerTerm {
        _left: boolean = false;

        constructor(fp: IFormulaPanel, parent: Term, _left: boolean = true) {
            super(fp, parent, true);
            this._left = _left;
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize + 1, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            // gesamt
            this.dim.w = (this.d1.w > this.d2.w ? this.d1.w : this.d2.w);
            // Power
            let m = this.prev.getHighestMiddle();
            let lh = 1; // fp.getLineThickness(iFontSize);
            this.dx1 = this._left ? this.dim.w - this.d1.w : 0;
            this.dy1 = -this.d1.h2 - m - lh;
            // Index
            m = this.prev.getLowestMiddle();
            this.dx2 = this._left ? this.dim.w - this.d2.w : 0;
            this.dy2 = this.d2.h1 - m + lh;
            // gesamt
            this.dim.h1 = -this.dy1 + this.d1.h1;
            this.dim.h2 = this.dy2 + this.d2.h2;
        }

        toString(cursor: Term): string {
            return "^{" + this.con1.toStringAll(cursor) + "}_{" + this.con2.toStringAll(cursor) + "}";
        }

        toMPad(): string {
            return "^{" + this.con1.toMPadAll() + "}_{" + this.con2.toMPadAll() + "}";
        }
    }
}