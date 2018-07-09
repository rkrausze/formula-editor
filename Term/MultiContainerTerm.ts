/// <reference path="Term.ts" />
/// <reference path="EmptyTerm.ts" />
namespace fe {
    /**
    * Term whith 3 subterms
    *
    * @author krausze
    *
    */
    export abstract class MultiContainerTerm extends Term {
        /** Subterms */
        con: Term[];

        /** Dims of subterms */
        d: Dim[];

        dx: number[];
        dy: number[];

        /** Nr of main term */
        mainTermNr: number;

        nTerm: number;

        constructor(fp: IFormulaPanel, parent: Term, nTerm: number, mainTermNr: number) {
            super(fp, parent);
            this.nTerm = nTerm;
            this.mainTermNr = mainTermNr;
            this.con = [];
            this.d = [];
            this.dx = [];
            this.dy = [];
            for (let i = 0; i < this.nTerm; i++) {
                this.con[i] = new EmptyTerm(fp, this);
                this.d[i] = new Dim();
            }
        }

        // conTermbelegung
        getNCon(): number {
            return this.nTerm;
        }

        // Umrechnung, so dass Term 0 immer der mainTerm ist
        setCon(t: Term, iCon: number): void {
            let nr = iCon;
            if (iCon == 0)
                nr = this.mainTermNr;
            else if (iCon <= this.mainTermNr)
                nr--;
            if (nr < this.nTerm) {
                this.con[nr] = t;
                this.con[nr].setParentAll(this);
            }
        }

        getCon(iCon: number): Term {
            let nr = iCon;
            if (iCon == 0)
                nr = this.mainTermNr;
            else if (iCon <= this.mainTermNr)
                nr--;
            return (nr < this.nTerm) ? this.con[iCon] : null;
        }

        getBehavior(): number {
            return Term.ENTER_UPDOWN;
        }

        getLowestMiddle(): number {
            let m = this.con[0].getLowestMiddleAll() - this.dy[0];
            for (let i = 1; i < this.nTerm; i++) {
                let m1 = this.con[i].getLowestMiddleAll() - this.dy[i];
                if (m1 > m)
                    m = m1;
            }
            return m;
        }

        getHighestMiddle(): number {
            let m = this.con[0].getHighestMiddleAll() - this.dy[0];
            for (let i = 1; i < this.nTerm; i++) {
                let m1 = this.con[i].getHighestMiddleAll() - this.dy[i];
                if (m1 < m)
                    m = m1;
            }
            return m;
        }

        getTermNr(child: Term): number {
            for (let i = 0; i < this.nTerm; i++)
                if (this.con[i] == child)
                    return i;
            return -1;
        }

        paint(g: HTMLCanvasElement, x: number, y: number): void {
            for (let i = 0; i < this.nTerm; i++)
                this.con[i].paintAll(g, x + this.dx[i], y + this.dy[i]);
        }

        left(marking: boolean): Term {
            return marking ? this.prev : this.con[this.mainTermNr].last().cursorByLeft(marking);
        }

        cursorByLeft(marking: boolean): Term {
            return this;
        }

        cursorByRight(marking: boolean): Term {
            return marking ? this : this.con[this.mainTermNr].cursorByRight(marking);
        }

        cursorByLeftFromChild(child: Term, marking: boolean): Term {
            return this.prev;
        }

        down(marking: boolean, markBegin: Term): Term {
            return marking ? this : this.con[this.nTerm - 1].last().cursorByLeft(marking);
        }

        up(marking: boolean, markBegin: Term): Term {
            return marking ? this : this.con[0].last().cursorByLeft(marking);
        }

        cursorByDown(marking: boolean, x: number): Term {
            return this.con[0].cursorByDown(marking, x);
        }

        cursorByUp(marking: boolean, x: number): Term {
            return this.con[this.nTerm - 1].cursorByUp(marking, x);
        }

        cursorByDownFromChild(child: Term, marking: boolean, x: number): Term {
            if (child.first() != this.con[this.nTerm - 1]) // steht nicht auf unterstem
                // Child
                return marking ? this : this.con[this.getTermNr(child.first()) + 1].cursorByDown(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByDownFromChild(this, marking, x);
            else
                return null;
        }

        cursorByUpFromChild(child: Term, marking: boolean, x: number): Term {
            if (child.first() != this.con[0]) // steht auf unterem Teil
                return marking ? this : this.con[this.getTermNr(child.first()) - 1].cursorByUp(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByUpFromChild(this, marking, x);
            else
                return null;
        }

        cursorEnterUp(): Term {
            return this.con[0];
        }

        cursorEnterDown(): Term {
            return this.con[this.nTerm - 1];
        }

        // Mauspositionierung
        fromXY(x: number, y: number): Term {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            // oben oder unten
            for (let i = 0; i < this.nTerm; i++)
                if (this.d[i].isIn(x - this.x - this.dx[i], y - this.y - this.dy[i]))
                    return this.con[i].fromXY(x, y);
            return this.con[this.mainTermNr];
        }

        toString(): string {
            let s = "";
            for (let i = 0; i < this.nTerm; i++)
                s += "{" + this.getCon(i).toString() + "}";
            return s;
        }
    }

}