/// <reference path="FormulaPanel.ts" />
namespace fe {
    export class FormulaField extends FormulaPanel {
        // PopupMenü
        toolbar: IToolbar = null;

        // Caret
        CaretVisible = true;

        hasFocus = false;

        // zusätzliche Zeiger
        cursor: Term;
        markBegin: Term;
        markEnd: Term;

        // Mausmarkierung
        mouseMark: boolean;

        mouseMarkTerm1: Term;
        mouseMarkTerm2: Term;

        // Eigenschaftenparameter
        smallCursor = false; // Cursor hat Font-maße und nicht die Maße des Cursor-Terms

        updownMark = true; // up/down kann markieren

        caretBlinks = true; // Cursor blinkt

        powIndKeys = true; // ob Tasten ^ und _ Power bw. Index erzeugen

        private caretThread: number = null;

        private doCloseToolbar: boolean;

        private hiddenInput: HTMLInputElement;

        constructor(canvas: HTMLCanvasElement, sInitTerm: string) {
            super(canvas, sInitTerm);
            this.cursor = this.term;

            // Listeners
            canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
            canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
            canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
            canvas.addEventListener("focus", this.onFocus.bind(this));

            if (this.caretBlinks) {
                this.caretThread = window.setInterval(
                    () => {
                        this.CaretVisible = !this.CaretVisible;
                        this.repaint();
                    }, 500);
            }

            // invisible input field (to trigger a virtual keybord at mobiles)
            this.hiddenInput = document.createElement('input');
            this.hiddenInput.type = 'text';
            this.hiddenInput.style.position = 'absolute';
            this.hiddenInput.style.opacity = "0";
            this.hiddenInput.style.pointerEvents = 'none';
            this.hiddenInput.style.zIndex = "0";
            this.hiddenInput.style.backgroundColor = '#0F0';
            // hide native blue text cursor on iOS
            //this.hiddenInput.style.transform = 'scale(0)'; TEST

            this.updateHiddenInput();
            document.body.appendChild(this.hiddenInput);

            // Listeners
            this.hiddenInput.addEventListener("keypress", this.onHiddenInputKeyPress.bind(this));
            this.hiddenInput.addEventListener("keydown", this.onHiddenInputKeyDown.bind(this));
            this.hiddenInput.addEventListener("blur", this.onHiddenInputBlur.bind(this));
            if ( navigator.userAgent.match(/Android/i) ) {
                this.hiddenInput.addEventListener("input", this.onHiddenInputInput.bind(this)); // for android virtual keyboard
            }
        }

        paint(g: HTMLCanvasElement): void {
            // clear
            if ( this.width != -1 ) {
                let ctx = g.getContext("2d");
                ctx.save();
                // clean
                ctx.fillStyle = this.getBackground();
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.restore();
            }
            // Markierung
            if (this.markBegin != null) {
                let t: Term = this.markEnd;
                let d1: Dim = this.markEnd.dim.clone();
                while (t.prev != null && t.prev != this.markBegin)
                    d1.add((t = t.prev).dim);
                let ctx = g.getContext("2d");
                ctx.save();
                //ctx.globalCompositeOperation = "xor";// TODO MIG ctx.fillXORMode(new Color(255, 255, 128));
                ctx.fillStyle = this.markColor;
                ctx.fillRect(this.markBegin.x + this.markBegin.dim.w, this.markBegin.y - d1.h1, d1.w, d1.h1 + d1.h2);
                ctx.restore();
                //ctx.globalCompositeOperation = "source-over";
            }
            super.paint(g, false);
            // Paint Cursor
            if (this.CaretVisible && this.hasFocus) {
                let ctx = g.getContext("2d");
                ctx.save();
                ctx.fillStyle = this.cursorColor;
                let cursorDim: Dim = this.smallCursor ? this.getFontDim(0, this.cursor.iFontSize) : this.cursor.getCursorDim();
                ctx.beginPath();
                ctx.moveTo(this.cursor.x + this.cursor.dim.w, this.cursor.y - cursorDim.h1);
                ctx.lineTo(this.cursor.x + this.cursor.dim.w, this.cursor.y + cursorDim.h2);
                ctx.stroke();
                ctx.restore();
            }
        }

        setDim(w: number, h: number, baseline: number): void {
            super.setDim(w, h, baseline);
            this.updateHiddenInput();
        }

        // KeyListener
        onHiddenInputKeyDown(e: KeyboardEvent) {
            console.log("in keyDown");
            // e.preventDefault();
            let key: string = e.key;
            let shift: boolean = e.shiftKey;
            let oldCursor: Term = this.cursor;
            if (key == "F3" && shift) {
                // TODO MIG (new InfoDlg(getFrame(), "Info", this)).show();
            }
            else if (key == "F12" && e.ctrlKey) {
                // TODO MIG (new AboutDlg(getFrame(), "About", this)).show();
            }
            else if (key == "ArrowLeft") {
                this.cursor = this.cursor.left(shift);
                if (shift) {
                    if (oldCursor == this.markBegin)
                        this.markBegin = this.cursor;
                    else if (oldCursor == this.markEnd)
                        this.markEnd = this.cursor;
                    else {
                        this.markBegin = this.cursor;
                        this.markEnd = oldCursor;
                    }
                }
                if (!shift || this.markBegin == this.markEnd) {
                    this.markBegin = null;
                    this.markEnd = null;
                }
            } else if (key == "ArrowRight") {
                this.cursor = this.cursor.right(shift);
                if (shift) {
                    if (oldCursor == this.markBegin)
                        this.markBegin = this.cursor;
                    else if (oldCursor == this.markEnd)
                        this.markEnd = this.cursor;
                    else {
                        this.markBegin = oldCursor;
                        this.markEnd = this.cursor;
                    }
                }
                if (!shift || this.markBegin == this.markEnd) {
                    this.markBegin = null;
                    this.markEnd = null;
                }
            } else if (key == "ArrowDown") {
                this.cursor = this.cursor.down(shift, this.markBegin);
                if (shift && this.cursor != oldCursor)
                    if (this.updownMark) {
                        this.markBegin = this.cursor.prev;
                        this.markEnd = this.cursor;
                        this.cursor = (2 * (oldCursor.x - this.cursor.x) > this.cursor.dim.w) ? this.cursor : this.cursor.prev;
                    } else
                        this.cursor = oldCursor;
                if (!shift || this.markBegin == this.markEnd) {
                    this.markBegin = null;
                    this.markEnd = null;
                }
                e.preventDefault();
            } else if (key == "ArrowUp") {
                this.cursor = this.cursor.up(shift, this.markBegin);
                if (shift && this.cursor != oldCursor)
                    if (this.updownMark) {
                        this.markBegin = this.cursor.prev;
                        this.markEnd = this.cursor;
                        this.cursor = (2 * (oldCursor.x - this.cursor.x) > this.cursor.dim.w) ? this.cursor : this.cursor.prev;
                    } else
                       	this.cursor = oldCursor;
                if (!shift || this.markBegin == this.markEnd) {
                    this.markBegin = null;
                    this.markEnd = null;
                }
                e.preventDefault();
            } else if (key == "Delete" && this.markBegin != null) { // etwas markiert
                this.deleteMark();
            } else if (key == "Delete" && this.cursor.next != null) { // nichts
                // markiert
                if ((this.cursor.next.getBehavior() & Term.SIMPLE_DELETE) != 0) { // löschen
                    this.cursor.next = this.cursor.next.next;
                    if (this.cursor.next != null)
                    this.cursor.next.prev = this.cursor;
                } else { // markieren
                    this.markBegin = this.cursor;
                    this.markEnd = this.cursor.next;
                }
            } else if (key == "Backspace" && this.markBegin != null) { // etwas markiert
                this.deleteMark();
            } else if (key == "Backspace") { // nichts markiert
                if (this.cursor.prev != null && (this.cursor.getBehavior() & Term.SIMPLE_DELETE) != 0) { // löschen
                    this.cursor = this.cursor.prev;
                    this.cursor.next = this.cursor.next.next;
                    if (this.cursor.next != null)
                        this.cursor.next.prev = this.cursor;
                } else if (this.cursor.prev != null) { // markieren
                    this.markBegin = this.cursor.prev;
                    this.markEnd = this.cursor;
                } else if (this.cursor.parent != null) { // markieren
                    this.markBegin = this.cursor.parent.prev;
                    this.markEnd = this.cursor.parent;
                }

            }
            this.repaint();
        }

        onHiddenInputKeyPress(e: KeyboardEvent) {
            e.preventDefault();
            let c: string = e.key;
            console.log("keyPress: "+ c);
            if (c == '^' && this.powIndKeys) { // nichts markiert
                this.exec("new \\power#");
                return;
            }
            if (c == '_' && this.powIndKeys) { // nichts markiert
                this.exec("new \\index#");
                return;
            }
            if (this.markBegin != null)
                this.deleteMark();
            this.cursor.insertAsNext(new SimpleTerm(this, this.cursor.parent, c == '*' ? "\u2027" : "" + c, 0));
            this.cursor = this.cursor.next;
            this.repaint();
        }

        /**
         * Only used on Android. The virtual keyboard fires no usabel key events.
         *
         * @param {Event} e not used
         *
         * @memberOf FormulaField
         */
        onHiddenInputInput(e: Event) {
            e.preventDefault();
            if ( this.hiddenInput.value != "" ) {
                if (this.markBegin != null)
                    this.deleteMark();
                let c = this.hiddenInput.value;
                this.cursor.insertAsNext(new SimpleTerm(this, this.cursor.parent, c == '*' ? "\u2027" : "" + c, 0));
                this.cursor = this.cursor.next;
                this.repaint();
                this.hiddenInput.value = "";
            }
        }

        // High Level Funktionen mit der Markierung
        deleteMark(): void { // Markierung nur innerhalb einer Kette =>
            // einfaches auslinken reicht
            this.markBegin.next = this.markEnd.next;
            if (this.markEnd.next != null)
                this.markEnd.next.prev = this.markBegin;
            this.cursor = this.markBegin;
            this.markBegin = null;
            this.markEnd = null;
        }

        // kettet Markierung aus und fügt inserTerm ein,
        // liefert ausgekettete Termkette (die Markierung zurück) (ohne
        // führenden EmptyTerm)
        // insertTerm darf auch null sein
        chainOutMark(insertTerm: Term): Term {
            // ausskettung retten
            let res: Term = this.markBegin.next;
            // verkleben
            if (insertTerm == null) {
                this.markBegin.next = this.markEnd.next;
                if (this.markEnd.next != null)
                this.markEnd.next.prev = this.markBegin;
            } else {
                this.markBegin.next = insertTerm;
                insertTerm.prev = this.markBegin;
                insertTerm.next = this.markEnd.next;
                if (this.markEnd.next != null)
                    this.markEnd.next.prev = insertTerm;
                insertTerm.parent = this.markBegin.parent; // sicher is sicher
            }
            // Enden der Auskettung säubern
            res.prev = null;
            this.markEnd.next = null;
            this.markBegin = null;
            this.markEnd = null;
            return res;
        }

        // Steuerung von außen
        exec(command: string): void {
            if (StrUtil.startsWith(command, "new ")) {
                // speziell für l-Terme
                if (StrUtil.startsWith(command, "new \\lindex") || StrUtil.startsWith(command, "new \\lpower") || StrUtil.startsWith(command, "new \\lpowind")) {
                    if (this.markBegin != null)
                        this.cursor = this.markBegin;
                    else if (this.cursor.prev != null)
                        this.cursor = this.cursor.prev;
                    this.markBegin = null;
                }
                // weiter normal
                if (this.markBegin != null)
                    this.cursor = this.markBegin; // cursor darf nicht auf MarkEnd sitzen
                let tMark: Term = this.markBegin != null ? this.chainOutMark(null) : null;
                // achtung, es kommt etwas mit führendem EmptyTerm zurück, also gleich .next
                let t: Term = TermFactory.readStringS2(command.substring(4), this, this.cursor.parent, tMark).next;
                if (t == null)
                    return;
                let tLast: Term = t.last();
                this.cursor.insertChainAsNext(t);
                if (t.getNCon() == 0)
                    this.cursor = tLast.cursorByLeft(false);
                else
                    this.cursor = t.getCon((t.getNCon() > 1 && tMark != null && command.indexOf('#') != -1) ? 1 : 0).last().cursorByLeft(false);
                this.repaint();
            }
        }

        // MausActions

        onMouseDown(e: MouseEvent): void {
            e.preventDefault();
            this.ensureKeyFocus = 0;
            if ( !this.hasFocus ) {
                this.requestFocus();
            }
            let xm = e.offsetX;
            let ym = e.offsetY;
            if (this.d.isIn(xm - this.x, ym - this.y))
                this.cursor = this.term.fromXY(xm, ym);
            else if (xm < this.x)
                this.cursor = this.term;
            else if (this.x + this.d.w < xm)
                this.cursor = this.term.last().cursorByLeft(false);
            console.log("e: %o", e);
            console.log("cur: %o", this.cursor);
            if (e.button == 0) {
                this.mouseMark = true;
                this.markBegin = null;
                this.mouseMarkTerm1 = this.cursor;
            }
            this.repaint();
        }

        onMouseUp(e: MouseEvent): void {
            e.preventDefault();
            this.mouseMark = false;
        }

        // MouseMotions

        onMouseMove(e: MouseEvent): void {
            e.preventDefault();
            let xm: number = e.offsetX;
            let ym: number = e.offsetY;
            if (this.d.isIn(xm - this.x, ym - this.y) && this.mouseMark) {
                this.cursor = this.term.fromXY(xm, ym);
                this.mouseMarkTerm2 = this.cursor;
                // Markierung setzen
                if (this.mouseMarkTerm1 == this.mouseMarkTerm2) {
                    this.markBegin = this.cursor.prev;
                    this.markEnd = this.cursor;
                } else {
                    // Termchains bilden (von Root alle parents bis zum Term
                    let tc1: TermChainer = TermChainer.MakeTermChainer(this.mouseMarkTerm1);
                    let tc2: TermChainer = TermChainer.MakeTermChainer(this.mouseMarkTerm2);
                    // finden, wo die Kette auseinander geht
                    // System.out.println(tc1.term+" "+tc2.term);
                    while (tc1.term == tc2.term && tc1.next != null && tc2.next != null) {
                        tc1 = tc1.next;
                        tc2 = tc2.next;
                    }
                    // ist ein tc-Term womöglich schon ein Mark-term?
                    if (tc1.next == null && tc1.term == tc2.term) {
                        let p: Term = tc1.term;
                        this.markBegin = p.prev != null ? p.prev : p;
                        this.markEnd = p;
                        this.cursor = this.markBegin;
                    } else if (tc2.next == null && tc1.term == tc2.term) {
                        let p: Term = tc2.term;
                        this.markBegin = p.prev != null ? p.prev : p;
                        this.markEnd = p;
                        this.cursor = this.markEnd;
                    }
                    // tc1.parent (== tc2.parent) ist gemeinsames parent
                    // d.h. tc1.term und tc2.term liegen entweder in der selben
                    // Unterkette von
                    // tc1.parent oder in verschiedenen
                    else if (tc1.term.inSameChainInfront(tc2.term)) { // selbe
                        // Kette ,
                        // tc2 ...
                        // tc1
                        this.markBegin = (tc2.next != null && tc2.term.prev != null) ? tc2.term.prev : tc2.term;
                        this.markEnd = tc1.term;
                        this.cursor = this.markBegin;
                    } else if (tc1.term.inSameChainAfter(tc2.term)) { // selbe
                        // Kette ,
                        // tc1 ...
                        // tc2
                        this.markBegin = (tc1.next != null && tc1.term.prev != null) ? tc1.term.prev : tc1.term;
                        this.markEnd = tc2.term;
                        this.cursor = this.markEnd;
                    } else { // verschiedene Ketten, also parent markieren
                        let p: Term = tc1.term.parent;
                        this.markBegin = p.prev != null ? p.prev : p;
                        this.markEnd = p;
                        this.cursor = p;
                    }
                }
                this.repaint();
            }
        }

        // /*
        // * (non-Javadoc)
        // *
        // * @see java.awt.event.FocusListener#focusGained(java.awt.event.FocusEvent)
        // */
        // boolean focusAction = false;

        // boolean menuAction = false;

        // // int onSetVisible = 0;
        ensureKeyFocus: number = 0;

        onFocus(e: FocusEvent) {
            console.log("focus");
            this.preventCloseToolbar();
            this.hasFocus = true;
            // TODO MIG if (ensureKeyFocus > 0)
            //    ensureKeyFocus--;
            if (this.toolbar != null && !this.toolbar.isVisible()) {
                //focusAction = true;
                //ensureKeyFocus = 2;
                this.toolbar.setVisible(true);
            }
            this.hiddenInput.focus();
        }

        onHiddenInputBlur(e: FocusEvent) {
            console.log("blur hi");
            // TODO MIG if (ensureKeyFocus > 0)
            //     ensureKeyFocus--;
            if (this.toolbar != null && this.toolbar.isVisible() /*&& this.ensureKeyFocus == 0*/)
                this.closeToolbar();
            // focusAction = false;
            this.hasFocus = false;
        }

        closeToolbar() {
            this.doCloseToolbar = true;
            setTimeout(() => {
                if (this.doCloseToolbar) {
                    this.toolbar.setVisible(false);
                    this.doCloseToolbar = false;
                }
            }, 500);
        }

        preventCloseToolbar(): void {
            this.doCloseToolbar = false;
        }

        requestFocus(): void {
            this.canvas.focus();
        }

        // deal with hiddenInput
        private updateHiddenInput(): void {
            let ad = ElementUtils.getAbsDim(this.canvas);
            this.hiddenInput.style.left = ad.x+'px';
            this.hiddenInput.style.top = ad.y+'px';
            this.hiddenInput.style.width = ad.w+'px';
            this.hiddenInput.style.height = ad.h+'px';
        }

    }
}