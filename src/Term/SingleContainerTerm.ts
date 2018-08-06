/// <reference path="Term.ts" />
/// <reference path="EmptyTerm.ts" />
namespace fe {
    export abstract class SingleContainerTerm extends Term {
        con: Term;

        d: Dim; // gesamtgröße von con

        dx: number;
        dy: number;

        constructor (fp: IFormulaPanel, parent: Term) {
            super(fp, parent);
            this.con = new EmptyTerm(fp, this);
            this.d = new Dim();
        }

        // conTermbelegung
        getNCon(): number {
            return 1;
        }

        setCon(t: Term, iCon: number): void {
            if (iCon == 0) {
                this.con = t;
                this.con.setParentAll(this);
            }
        }

        getCon(iCon: number): Term {
            if (iCon == 0)
                return this.con;
            return null;
        }

        getLowestMiddle(): number {
            return this.con.getLowestMiddleAll() - this.dy;
        }

        getHighestMiddle(): number {
            return this.con.getHighestMiddleAll() - this.dy;
        }

        paint(g: HTMLCanvasElement, x: number, y: number) {
            this.con.paintAll(g, x + this.dx, y + this.dy);
        }

        left(marking: boolean): Term {
            return marking ? this.prev : this.con.last().cursorByLeft(marking);
        }

        cursorByLeft(marking: boolean): Term {
            return this;
        }

        cursorByRight(marking: boolean): Term {
            return marking ? this : this.con.cursorByRight(marking);
        }

        cursorByLeftFromChild(child: Term, marking: boolean): Term {
            return this.prev;
        }

        cursorByDown(marking: boolean, x: number): Term {
            return this.con.cursorByDown(marking, x);
        }

        cursorByUp(marking: boolean, x: number): Term {
            return this.con.cursorByUp(marking, x);
        }

        cursorByDownFromChild(child: Term, marking: boolean, x: number): Term {
            if (marking)
                return this;
            else if (this.parent != null)
                return this.parent.cursorByDownFromChild(this, marking, x);
            else
                return null;
        }

        cursorByUpFromChild(child: Term, marking: boolean, x: number): Term {
            if (marking)
                return this;
            else if (this.parent != null)
                return this.parent.cursorByUpFromChild(this, marking, x);
            else
                return null;
        }

        // Mauspositionierung

        fromXY(x: number, y: number): Term {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            if (x > this.x + (this.dx + this.d.w + this.dim.w) / 2)
                return this;
            return this.con.fromXY(x, y);
        }

        toString(cursor: Term): string {
            return "SingleTerm(" + this.con.toStringAll(cursor) + ")";
        }

    }
}