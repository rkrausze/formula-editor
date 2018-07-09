/// <reference path="AboveTerm.ts" />
namespace fe {
    export class FracTerm extends AboveTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent);
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            super.paint(g, x, y);
            let m = this.fp.getMiddleDelta(this.iFontSize);
            let lh = this.fp.getLineThickness(this.iFontSize);
            let ctx = g.getContext("2d");
            ctx.fillRect(x + lh, y - m - lh / 2, this.dim.w - 2 * lh, lh);
        }

        toString(): string {
            return "\frac{" + this.con1 + "}{" + this.con2 + "}";
        }

        toMPad(): string {
            return "{" + this.con1.toMPadAll() + "}/{" + this.con2.toMPadAll() + "}";
        }
    }
}