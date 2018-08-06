/// <reference path="Term.ts" />
/// <reference path="EmptyTerm.ts" />
namespace fe {
    export abstract class DoubleContainerTerm extends Term {
        /** Hauptterm (erhält Left, Right) */
        con1: Term;

        /** Nebenterm (erhält kein Left, Right von außen) */
        con2: Term;

        d1: Dim;
        d2: Dim;

        dx1: number;
        dy1: number;
        dx2: number;
        dy2: number;

        /** wether main term is on top of subterm */
        mainIsTop: boolean = true;

        constructor(fp: IFormulaPanel, parent: Term, mainIsTop: boolean) {
            super(fp, parent);
            this.con1 = new EmptyTerm(fp, this);
            this.con2 = new EmptyTerm(fp, this);
            this.d1 = new Dim();
            this.d2 = new Dim();
            this.mainIsTop = mainIsTop;
        }

        // conTermbelegung
        getNCon(): number {
            return 2;
        }

        setCon(t: Term, iCon: number) {
            if (iCon == 0) {
                this.con1 = t;
                this.con1.setParentAll(this);
            } else if (iCon == 1) {
                this.con2 = t;
                this.con2.setParentAll(this);
            }
        }

        getCon(iCon: number): Term {
            if (iCon == 0)
                return this.con1;
            else if (iCon == 1)
                return this.con2;
            else
                return null;
        }

        getBehavior(): number {
            return Term.ENTER_UPDOWN;
        }

        getUpper(): Term {
            return this.mainIsTop ? this.con1 : this.con2;
        }

        getLower(): Term {
            return this.mainIsTop ? this.con2 : this.con1;
        }

        getLowestMiddle(): number {
            return this.mainIsTop ? this.con2.getLowestMiddleAll() - this.dy2 : this.con1.getLowestMiddleAll() - this.dy1;
        }

        getHighestMiddle(): number {
            return this.mainIsTop ? this.con1.getHighestMiddleAll() - this.dy1 : this.con2.getHighestMiddleAll() - this.dy2;
        }

        paint(g: HTMLCanvasElement, x: number, y: number) {
            this.con1.paintAll(g, x + this.dx1, y + this.dy1);
            this.con2.paintAll(g, x + this.dx2, y + this.dy2);
        }

        left(marking: boolean): Term {
            return marking ? this.prev : this.con1.last().cursorByLeft(marking);
        }

        cursorByLeft(marking: boolean): Term {
            return this;// con1.last().cursorByLeft();
        }

        cursorByRight(marking: boolean): Term {
            return marking ? this : this.con1.cursorByRight(marking);
        }

        cursorByLeftFromChild(child: Term, marking: boolean): Term {
            return this.prev;
        }

        down(marking: boolean, markBegin: Term): Term {
            return marking ? this : this.getLower().last().cursorByLeft(marking);
        }

        up(marking: boolean, markBegin: Term): Term {
            return marking ? this : this.getUpper().last().cursorByLeft(marking);
        }

        cursorByDown(marking: boolean,  x: number): Term {
            return this.getUpper().cursorByDown(marking, x);
        }

        cursorByUp(marking: boolean, x: number): Term {
            return this.getLower().cursorByUp(marking, x);
        }

        cursorByDownFromChild(child: Term, marking: boolean, x: number): Term {
            if (child.first() == this.getUpper()) // steht auf oberem Teil
                return marking ? this : this.getLower().cursorByDown(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByDownFromChild(this, marking, x);
            else
                return null;
        }

        cursorByUpFromChild(child: Term, marking: boolean, x: number): Term {
            if (child.first() == this.getLower()) // steht auf unterem Teil
                return marking ? this : this.getUpper().cursorByUp(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByUpFromChild(this, marking, x);
            else
                return null;
        }

        cursorEnterUp(): Term {
            return this.getUpper();
        }

        cursorEnterDown(): Term {
            return this.getLower();
        }

        // Mauspositionierung
        fromXY(x: number, y: number): Term {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            // direkter Treffer?
            if (this.d1.isIn(x - this.x - this.dx1, y - this.y - this.dy1))
                return this.con1.fromXY(x, y);
            if (this.d2.isIn(x - this.x - this.dx2, y - this.y - this.dy2))
                return this.con2.fromXY(x, y);
            // oben oder unten
            if (y < this.y + (this.dy1 + this.dy2 + (this.mainIsTop ? this.d1.h2 - this.d2.h1 : this.d2.h2 - this.d1.h1)) / 2) // oben
                return this.getUpper().fromXY(x, y);
            return this.getLower().fromXY(x, y);
        }

        toString(cursor: Term): string {
            return "{" + this.con1.toStringAll(cursor) + "}{" + this.con2.toStringAll(cursor) + "}";
        }

    }

}