/// <reference path="SingleContainerTerm.ts" />
namespace fe {
    export class BracketTerm extends SingleContainerTerm {
        type: number;

        addBorder: number;

        centerBr = false;

        canUseFont = true;

        static borderFactor: number[] = [ 3, 3, 3, 3, 3, 5, 3, 3];

        constructor(fp: IFormulaPanel, parent: Term, type: number) {
            super(fp, parent);
            this.type = type;
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement): void {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize, this.d, g);
            // Höhe der Klammer berechnen (Symmetrie beachten)
            let m = this.fp.getMiddleDelta(iFontSize);
            let h = this.d.h1 - m > this.d.h2 + m ? this.d.h1 - m : this.d.h2 + m; // Flügelhöhe
            // Dim dFont = fp.getFontDim(0, iFontSize);
            let lh = this.fp.getLineThickness(iFontSize);
            this.addBorder = BracketTerm.borderFactor[this.type] * lh;// dFont.w*h/dFont.h1;
            this.dx = this.addBorder;
            this.dy = 0;
            this.dim.w = 2 * (this.addBorder) + this.d.w;
            this.canUseFont = true;
            if (this.centerBr) {
                this.dim.h1 = h + 2 * lh + m;
                this.dim.h2 = h + 2 * lh - m;
            } else {
                /*
                * dim.h1 = d.h1+2*lh; dim.h2 = d.h2+2*lh;
                */
                this.dim.h1 = this.d.h1;
                this.dim.h2 = this.d.h2;
                if (this.con.containsBrackets() == this.dim.h1 + this.dim.h2) {
                    this.canUseFont = false;
                    this.dim.h1 = this.d.h1 + 2 * lh;
                    this.dim.h2 = this.d.h2 + 2 * lh;
                }
            }
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            this.con.paintAll(g, x + this.dx, y + this.dy);
            // int m = fp.getMiddleDelta(iFontSize);
            let dFont: Dim = this.fp.getFontDim(0, this.iFontSize);
            let lh = this.fp.getLineThickness(this.iFontSize);
            // calc size of "ordinary" brackets
            /*
            * FontMetrics fm = fp.getFontMetrics(iFontIndex, iFontSize); dim.h1 =
            * fm.getAscent()-fm.getLeading(); dim.h2 = fm.getDescent();
            */
            let ctx = g.getContext("2d");
            ctx.save();
            if (this.type == 0) {
                if (this.d.h1 <= dFont.h1 && this.d.h2 <= dFont.h2 && this.canUseFont) {
                    ctx.font = this.fp.getFont(0, this.iFontSize);
                    ctx.fillText("(", x, y - lh);
                    ctx.fillText(")", x + this.addBorder + this.d.w + lh + lh + lh - ctx.measureText(")").width, y - lh);
                } else {
                    // ctx.fillRect(x+lh, y-dim.h1, lh, dim.h1+dim.h2);
                    // ctx.fillRect(x+addBorder+d.w+lh, y-dim.h1, lh, dim.h1+dim.h2);
                    let h2 = (this.dim.h1 + this.dim.h2) / 2;
                    let d1 = lh + lh;
                    let r = ((d1 * d1 + h2 * h2) / 2) / d1;
                    let beta = Math.atan((2 * d1 * h2) / (h2 * h2 - d1 * d1));
                    ctx.beginPath();
                    ctx.arc(x + lh / 2 + r, y - this.dim.h1 + h2, r, Math.PI - beta, Math.PI+beta);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x + this.addBorder + this.d.w + 3 * lh / 2 - r, y - this.dim.h1 + h2, r, -beta, beta);
                    ctx.stroke();
                    d1 = lh + lh - 1;
                    r = ((d1 * d1 + h2 * h2) / 2) / d1;
                    beta = Math.atan((2 * d1 * h2) / (h2 * h2 - d1 * d1));
                    ctx.beginPath();
                    ctx.arc(x + lh / 2 + 1 + r, y - this.dim.h1 + h2, r, Math.PI - beta, Math.PI+beta);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x + this.addBorder + this.d.w + 3 * lh / 2 - r - 1, y - this.dim.h1 + h2, r, -beta, beta);
                    ctx.stroke();
                }
            } else if (this.type == 1) {
                if (this.d.h1 <= dFont.h1 && this.d.h2 <= dFont.h2 && this.canUseFont) {
                    ctx.font = this.fp.getFont(0, this.iFontSize);
                    ctx.fillText("[", x, y - lh);
                    ctx.fillText("]", x + this.addBorder + this.d.w + lh + lh + lh - ctx.measureText(")").width, y - lh);
                } else {
                    ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                    ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                    ctx.fillRect(x + 2 * lh, y - this.dim.h1, 2 * lh, lh);
                    ctx.fillRect(x + 2 * lh, y + this.dim.h2 - lh, 2 * lh, lh);
                    ctx.fillRect(x + this.addBorder + this.d.w - lh, y - this.dim.h1, 2 * lh, lh);
                    ctx.fillRect(x + this.addBorder + this.d.w - lh, y + this.dim.h2 - lh, 2 * lh, lh);
                }
            } else if (this.type == 2) {
                if (this.d.h1 <= dFont.h1 && this.d.h2 <= dFont.h2 && this.canUseFont) {
                    ctx.font = this.fp.getFont(0, this.iFontSize);
                    ctx.fillText("{", x, y - lh);
                    ctx.fillText("}", x + this.addBorder + this.d.w + lh + lh + lh - ctx.measureText(")").width, y - lh);
                } else {
                    let h = this.dim.h1 + this.dim.h2;
                    let h2 = h / 2;
                    let y1 = y - this.dim.h1 + h2;
                    this.drawRelLine(ctx, x + lh + lh, y - this.dim.h1 + lh, lh, -lh, lh);
                    ctx.fillRect(x + lh + lh, y - this.dim.h1 + lh, lh, h2 - lh - lh);
                    this.drawRelLine(ctx, x + lh + lh, y1 - lh, -lh, lh, lh);
                    this.drawRelLine(ctx, x + lh + lh, y1 + lh, -lh, -lh, lh);
                    ctx.fillRect(x + lh + lh, y1 + lh, lh, h2 - lh - lh);
                    this.drawRelLine(ctx, x + lh + lh, y1 + h2 - lh, lh, lh, lh);

                    this.drawRelLine(ctx, x + this.addBorder + this.d.w, y - this.dim.h1 + lh, -lh, -lh, lh);
                    ctx.fillRect(x + this.addBorder + this.d.w, y - this.dim.h1 + lh, lh, h2 - lh - lh);
                    this.drawRelLine(ctx, x + this.addBorder + this.d.w, y1 - lh, lh, lh, lh);
                    this.drawRelLine(ctx, x + this.addBorder + this.d.w, y1 + lh, lh, -lh, lh);
                    ctx.fillRect(x + this.addBorder + this.d.w, y1 + lh, lh, h2 - lh - lh);
                    this.drawRelLine(ctx, x + this.addBorder + this.d.w, y1 + h2 - lh, -lh, lh, lh);
                }
            } else if (this.type == 3) {
                let ym = y + (this.dim.h2 - this.dim.h1) / 2;
                ctx.beginPath();
                ctx.moveTo(x + lh, ym);
                ctx.lineTo(x + 3 * lh, y - this.dim.h1);
                //ctx.stroke();
                ctx.moveTo(x + lh, ym);
                ctx.lineTo(x + 3 * lh, y + this.dim.h2);
                //ctx.stroke();
                ctx.moveTo(x + this.addBorder + this.d.w + 2 * lh, ym);
                ctx.lineTo(x + this.addBorder + this.d.w, y - this.dim.h1);
                //ctx.stroke();
                ctx.moveTo(x + this.addBorder + this.d.w + 2 * lh, ym);
                ctx.lineTo(x + this.addBorder + this.d.w, y + this.dim.h2);
                ctx.stroke();
            } else if (this.type == 4) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
            } else if (this.type == 5) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + 3 * lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + 3 * lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
            } else if (this.type == 6) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + 2 * lh, y + this.dim.h2 - lh, 2 * lh, lh);
                ctx.fillRect(x + this.addBorder + this.d.w - lh, y + this.dim.h2 - lh, 2 * lh, lh);
            } else if (this.type == 7) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + 2 * lh, y - this.dim.h1, 2 * lh, lh);
                ctx.fillRect(x + this.addBorder + this.d.w - lh, y - this.dim.h1, 2 * lh, lh);
            }
            ctx.restore();
        }

        toString(cursor: Term): string {
            return "\\bracket" + this.type + "{" + this.con.toStringAll(cursor) + "}";
        }

        toMPad(): string {
            if (this.type == 0)
                return "(" + this.con.toMPadAll() + ")";
            else if (this.type == 1)
                return "[" + this.con.toMPadAll() + "]";
            else if (this.type == 2)
                return "\\{" + this.con.toMPadAll() + "\\}";
            // hier fehlen noch die anderen Klammetypen
            return "(" + this.con.toMPadAll() + ")";
        }

        containsBrackets(): number {
            return super.containsBrackets(this.dim.h1 + this.dim.h2);
        }
    }
}