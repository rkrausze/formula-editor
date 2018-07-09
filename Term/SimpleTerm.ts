/// <reference path="Term.ts" />
namespace fe {
    export class SimpleTerm extends Term {
        s: string;

        iFontIndex: number;

        constructor (fp: IFormulaPanel, parent: Term, s: string, iFontIndex: number) {
            super(fp, parent);
            this.s = s;
            this.iFontIndex = iFontIndex;
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            let ctx = g.getContext("2d");
            ctx.font = this.fp.getFont(this.iFontIndex, this.iFontSize);
            let tm: TextMetrics = ctx.measureText(this.s);
            let fm = this.fp.getFontMetrics(this.iFontIndex, this.iFontSize);
            this.dim.h1 = Term.correctAscent(fm.getAscent());
            this.dim.h2 = fm.getDescent();
            this.dim.w = tm.width;

            // alternative
            /*
            * LineMetrics lm = fm.getLineMetrics(s, g); dim.h1 =
            * (int)lm.getAscent(); dim.h2 = (int)lm.getDescent();
            */
            // oder so?
            /*
            * Rectangle2D r = fm.getStringBounds(s, g); dim.h1 =
            * (int)r.getHeight(); dim.h2 = 0;
            */
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            let ctx = g.getContext("2d");
            ctx.save();
            ctx.font = this.fp.getFont(this.iFontIndex, this.iFontSize); //"30px Arial";
            ctx.fillText(this.s, x, y);
            ctx.restore();
        }

        toString(): string {
            return this.s;
        }

        toMPad(): string {
            return this.s; // s.equals("\\") ? "\\\\" : s;
        }

    }
}