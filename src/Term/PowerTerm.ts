/// <reference path="SingleContainerTerm.ts" />
namespace fe {
    export class PowerTerm extends SingleContainerTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent);
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize + 1, this.d, g);
            let m = this.prev.getHighestMiddle();
            let lh = 1; // fp.getLineThickness(iFontSize);
            this.dx = 0;
            this.dy = -this.d.h2 - m - lh;
            this.dim.w = this.d.w;
            this.dim.h1 = -this.dy + this.d.h1;
            this.dim.h2 = this.dy + this.d.h2;
        }

        getCursorDim(): Dim {
            let dc: Dim = this.fp.getFontDim(0, this.iFontSize);
            dc.w = this.dim.w;
            return dc;
        }

        toString(cursor: Term): string {
            return "^{" + this.con.toStringAll(cursor) + "}";
        }

        toMPad(): string {
            return "^{" + this.con.toMPadAll() + "}";
        }
    }
}