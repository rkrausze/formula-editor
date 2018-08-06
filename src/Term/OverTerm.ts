/// <reference path="DoubleContainerTerm.ts" />
namespace fe {
    export class OverTerm extends DoubleContainerTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent, false);
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            let lh = this.fp.getLineThickness(iFontSize);
            // gesamt
            this.dim.w = this.d1.w > this.d2.w ? this.d1.w : this.d2.w;
            // normal
            this.dx1 = (this.dim.w - this.d1.w) / 2;
            this.dy1 = 0;
            // oben
            this.dx2 = (this.dim.w - this.d2.w) / 2;
            this.dy2 = -this.d2.h1 - lh - this.d1.h2;
            // gesamt
            this.dim.h1 = this.d2.h1 - this.dy2;
            this.dim.h2 = this.d1.h2;
        }

        toString(cursor: Term): string {
            return "\\over" + super.toString(cursor)
        }

        toMPad(): string {
            return "{" + this.con1.toMPadAll() + "}\\ontop{" + this.con2.toMPadAll() + "}";
        }
    }
}