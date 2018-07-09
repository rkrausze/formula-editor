/// <reference path="MultiContainerTerm.ts" />
namespace fe {
    export class OverUnderTerm extends MultiContainerTerm {

        constructor(fp: IFormulaPanel, parent: Term) {
            super(fp, parent, 3, 1);
        }

        /*
        * (non-Javadoc)
        *
        * @see Term#calcDim(int)
        */
        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d[0].copy(0, 0, 0);
            this.con[0].calcDimAll(iFontSize + 1, this.d[0], g);
            this.d[1].copy(0, 0, 0);
            this.con[1].calcDimAll(iFontSize, this.d[1], g);
            this.d[2].copy(0, 0, 0);
            this.con[2].calcDimAll(iFontSize + 1, this.d[2], g);
            let lh = this.fp.getLineThickness(iFontSize);
            // gesamt
            this.dim.w = this.d[0].w > this.d[1].w ? this.d[0].w : this.d[1].w;
            if (this.d[2].w > this.dim.w)
                this.dim.w = this.d[2].w;
            // normal
            this.dx[1] = (this.dim.w - this.d[1].w) / 2;
            this.dy[1] = 0;
            // oben
            this.dx[0] = (this.dim.w - this.d[0].w) / 2;
            this.dy[0] = -this.d[1].h1 - lh - this.d[0].h2;
            // unten
            this.dx[2] = (this.dim.w - this.d[2].w) / 2;
            this.dy[2] = this.d[1].h2 + lh + this.d[2].h1;
            // gesamt
            this.dim.h1 = this.d[0].h1 - this.dy[0];
            this.dim.h2 = this.d[2].h2 + this.dy[2];
        }

        /*
        * (non-Javadoc)
        *
        * @see Term#toString()
        */
        toString(): string {
            return "\\overunder" + super.toString();
        }

        toMPad(): string {
            return "{" + this.con[0].toMPadAll() + "}\\ontop{" + this.con[1].toMPadAll() + "}\\below{" + this.con[2].toMPadAll() + "}";
        }
    }
}