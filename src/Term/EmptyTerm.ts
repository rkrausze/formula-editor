/// <reference path="Term.ts" />
namespace fe {
    export class EmptyTerm extends Term {

        constructor (fp: IFormulaPanel, parent: Term) {
            super(fp, parent);
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            let fm: FontMetrics = this.fp.getFontMetrics(0, this.iFontSize);
            this.dim.h1 = Term.correctAscent(fm.getAscent());
            this.dim.h2 = fm.getDescent(); // fm.getDescent();
            this.dim.w = (this.next == null && this.prev == null) ? fm.getAscent() / 4 : 0; // tm.width / 2;
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            if (this.next == null) {
                let ctx = g.getContext("2d");
                ctx.save();
                ctx.fillStyle="#C0C0C0";
                ctx.fillRect(x, y - this.dim.h1, this.dim.w, this.dim.h1 + this.dim.h2);
                ctx.restore();
            }
        }

        toString(): string {
            return "EmtyTerm()";
        }

        toMPad(): string {
            return "";
        }
    }
}