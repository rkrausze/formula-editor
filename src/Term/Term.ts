/// <reference path="../Utils/Dim.ts" />
/// <reference path="../IFormulaPanel.ts" />
namespace fe {
    export abstract class Term {
        static SIMPLE_DELETE = 1;

        static ENTER_UPDOWN = 2;

        next: Term = null;
        prev: Term = null;
        parent: Term;

        dim: Dim;

        x: number;
        y: number;

        fp: IFormulaPanel;

        iFontSize: number;

        constructor (fp: IFormulaPanel, parent: Term) {
            this.fp = fp;
            this.parent = parent;
            this.dim = new Dim(0, 0, 0);
        }

        // conTermbelegung
        getNCon(): number {
            return 0;
        }

        setCon(t: Term, iCon: number) {
        }

        getCon(iCon: number): Term {
            return null;
        }

        // Chain operations
        insertAsNext(t: Term) {
            t.prev = this;
            t.next = this.next;
            this.next = t;
            if (t.next != null)
                t.next.prev = t;
        }

        insertChainAsNext(t: Term) {
            t.prev = this;
            if (this.next != null) { // abkürzen, wenn this letztes Kettenelement
                let l: Term = t.last();
                l.next = this.next;
                if (l.next != null)
                    l.next.prev = l;
            }
            this.next = t;
        }

        getBehavior(): number {
            return Term.SIMPLE_DELETE;
        }

        getDim(): Dim {
            return this.dim;
        }

        getCursorDim(): Dim {
            return this.dim;
        }

        calcDim(iFontSize: number, g: HTMLCanvasElement) {

        }

        calcDimAll(iFontSize: number, d: Dim, g: HTMLCanvasElement) {
            this.iFontSize = iFontSize;
            this.calcDim(iFontSize, g);
            d.add(this.dim);
            if (this.next != null)
                this.next.calcDimAll(iFontSize, d, g);
        }

        paint(g: HTMLCanvasElement, x: number, y: number) {};

        paintAll(g: HTMLCanvasElement, x: number, y: number) {
            this.x = x;
            this.y = y;
            // debug start
            if ( this.fp.debug ) {
                let ctx = g.getContext("2d");
                ctx.save();
                ctx.strokeStyle="#4400FF";
                ctx.strokeRect(x, y-this.dim.h1, this.dim.w, this.dim.h1);
                ctx.strokeRect(x, y, this.dim.w, this.dim.h2);
                ctx.restore();
            }
            // debug end
            this.paint(g, x, y);
            if (this.next != null)
                this.next.paintAll(g, x + this.dim.w, y);
        }

        // erstes und letztes Element der Kette

        first(): Term {
            return (this.prev != null) ? this.prev.first() : this;
        }

        last(): Term {
            return (this.next != null) ? this.next.last() : this;
        }

        inSameChainInfront(tPrev: Term): boolean { // ob tPrev in der selben Kette
            // vor this steht
            for (let t: Term = this.prev; t != null; t = t.prev)
                if (t == tPrev)
                    return true;
            return false;
        }

        inSameChainAfter(tNext: Term): boolean { // ob tNext in der selben Kette nach
            // this steht
            for (let t: Term = this.next; t != null; t = t.next)
                if (t == tNext)
                    return true;
            return false;
        }

        inSameChain(t: Term): boolean {
            return this.inSameChainAfter(t) || this.inSameChainInfront(t);
        }

        setParentAll(newParent: Term) {
            this.parent = newParent;
            if (this.next != null)
                this.next.setParentAll(newParent);
        }

        getLowestMiddle(): number { // Achtung: Middle wird von unten nach oben gemessen
            return this.fp.getMiddleDelta(this.iFontSize);
        }

        getHighestMiddle(): number {
            return this.fp.getMiddleDelta(this.iFontSize);
        }

        getLowestMiddleAll(): number {
            let m: number = this.getLowestMiddle();
            if (this.next == null)
                return m;
            let m1: number = this.next.getLowestMiddleAll();
            return m1 < m ? m1 : m;
        }

        getHighestMiddleAll(): number {
            let m: number = this.getHighestMiddle();
            if (this.next == null)
                return m;
            let m1: number = this.next.getHighestMiddleAll();
            return m1 > m ? m1 : m;
        }

        // Cursorbewegung verarbeiten
        left(marking: boolean): Term {
            if (this.prev != null)
                return this.prev.cursorByLeft(marking);
            else if (!marking && this.parent != null)
                return this.parent.cursorByLeftFromChild(this, marking);
            else
                return this;
        }

        right(marking: boolean): Term {
            if (this.next != null)
                return this.next.cursorByRight(marking);
            else if (!marking && this.parent != null)
                return this.parent;
            else
                return this;
        }

        cursorByLeft(marking: boolean): Term {
            return this;
        }

        cursorByRight(marking: boolean): Term {
            return this;
        }

        cursorByLeftFromChild(child: Term, marking: boolean): Term {
            return this;
        }

        // vertikal
        down(marking: boolean, markBegin: Term): Term {
            let help: Term;
            if (!marking || markBegin != this) { // keine Enterversuche, wenn
                // Objekt schon markiert ist
                if (this.next != null && (help = this.next.cursorEnterDown()) != null)
                    return marking ? this.next : help;
                /*
                 * if ( prev != null && (help = prev.cursorBackEnterDown()) != null )
                 * return marking ? next : help;
                 */
            }
            if (this.parent == null)
                return this;
            else
                return (help = this.parent.cursorByDownFromChild(this, marking, this.x + this.dim.w)) != null ? help : this;
        }

        up(marking: boolean, markBegin: Term): Term {
            let help: Term;
            if (!marking || markBegin != this) {
                if (this.next != null && (help = this.next.cursorEnterUp()) != null)
                    return marking ? this.next : help;
                /*
                 * if ( prev != null && (help = prev.cursorBackEnterUp()) != null )
                 * return marking ? next : help;
                 */
            }
            if (this.parent == null)
                return this;
            return (help = this.parent.cursorByUpFromChild(this, marking, this.x + this.dim.w)) != null ? help : this;
        }

        cursorByDown(marking: boolean, x: number): Term {
            if (x < this.x + this.dim.w || this.next == null)
                return (this.prev == null || this.x + this.dim.w / 2 < x) ? this : this.prev;
            return this.next.cursorByDown(marking, x);
        }

        cursorByUp(marking: boolean, x: number): Term {
            if (x < this.x + this.dim.w || this.next == null)
                return (this.prev == null || this.x + this.dim.w / 2 < x) ? this : this.prev;
            return this.next.cursorByUp(marking, x);
        }

        cursorByDownFromChild(child: Term, marking: boolean, x: number): Term {
            return null;
        }

        cursorByUpFromChild(child: Term, marking: boolean, x: number): Term {
            return null;
        }

        // vertikal enter (Cursor steht direkt vor demmar Komplex)

        cursorEnterUp(): Term {
            return null;
        }

        cursorEnterDown(): Term {
            return null;
        }

        // Mauspositionierung

        fromXY(x: number, y: number): Term {
            // System.out.println(this.x+" "+this.y+" "+dim+" : "+x+" "+y);
            if (x < this.x + this.dim.w || this.next == null)
                return (this.prev == null || this.x + this.dim.w / 2 < x) ? this : this.prev;
            return this.next.fromXY(x, y);
        }

        // Umwandlung in Text

        abstract toString(cursor: Term): string;

        toStringAll(cursor: Term): string {
            return (this == cursor ? "\\CURSOR" : "") + this.toString(cursor) + (this.next != null ? this.next.toStringAll(cursor) : "");
        }

        abstract toMPad(): string;

        toMPadAll(): string {
            return this.toMPad() + (this.next != null ? this.next.toMPadAll() : "");
        }

        // liefert die absolute Größe der größten Klammer in der Hauptkette
        // (wenn sie sich lohnt, also bei Fracs, Overterms usw. nicht in das
        // Haupt-con gehen = Klamer wird ja eh größer)
        //
        containsBrackets(h?: number): number {
            if ( h === undefined ) {
                return (this.next != null) ? this.next.containsBrackets() : 0;
            }
            if (this.next == null)
                return h;
            let h1: number = this.next.containsBrackets();
            return h > h1 ? h : h1;
        }

        drawRelLine(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, b: number): void {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x+w, y+h);
            ctx.lineTo(x+w+b, y+h);
            ctx.lineTo(x+b, y);
            ctx.closePath();
            ctx.fill();

        }
        static correctAscent(ascent: number): number {
            return ascent; // TODO MIG ascent * 3 / 4 + 1;
        }
    }
}