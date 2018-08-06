/// <reference path="IFormulaPanel.ts" />
/// <reference path="Term/Term.ts" />
namespace fe {
    export class FormulaPanel implements IFormulaPanel {
        // Double buffering
        width = -1; // The width and height of our offscreen image
        height = -1;

        resizeForced = false;

        // Font
        static nFontType = 2;

        static nFontSize = 5;

        static FontType: string[] = [ "SansSerif", "Lucida Sans Unicode" ]; // small

        // fonts?

        static FontSize: number[] = [ 18, 13, 8, 3, 1 ];

        font: string[][] =  [];

        fontMetrics: FontMetrics[][] = [];

        baseFontSize = 0;

        // für Initialisierung der Fontmetrics
        first = true;

        term: Term;

        // Eigenschaften des Terms
        d: Dim;

        x: number;
        y: number;

        factor = -1; // = window.devicePixelRatio for smarter graphics

        baseline = -1; // -1 => egal, also zentriert

        backgroundColor: string = "#FFFFFF";
        foregroundColor: string = "#000000";
        protected markColor = "#C0C0C0";
        protected cursorColor = "#000000";

        debug = false;


        // ColorArea
        area: ColorArea[] = [];

        constructor(public canvas: HTMLCanvasElement, sInitTerm: string = null, baseFontSize: number = 0) {
            this.init(sInitTerm, baseFontSize);
            this.paint(this.canvas, true);
        }

        init(sInitTerm: string, baseFontSize: number): void {
            this.term = sInitTerm != null ? TermFactory.readStringS1(sInitTerm, this, null) : new EmptyTerm(this, null);
            this.baseFontSize = baseFontSize;
            this.d = new Dim(0, 0, 0);
            // deal with device pixels => factor
            if ( this.factor == -1 )
                this.factor = window.devicePixelRatio;
            let ctx = this.canvas.getContext('2d');
            if ( ctx['webkitBackingStorePixelRatio'] && ctx['webkitBackingStorePixelRatio'] > 1 )
                this.factor = 1;
            if ( this.factor > 1 ) {
                let canvasWidth = parseInt(this.canvas.getAttribute("width"));
                let canvasHeight = parseInt(this.canvas.getAttribute("height"));

                this.canvas.style.width = canvasWidth+"px";
                this.canvas.style.height = canvasHeight+"px";
                this.canvas.setAttribute("width", <any>(canvasWidth*this.factor));
                this.canvas.setAttribute("height", <any>(canvasHeight*this.factor));
                //ctx.transform(this.factor,0,0,this.factor,0,0);
                //ctx.scale(this.factor, this.factor);
            }
            // Fonts laden
            for (let type = 0; type < FormulaPanel.nFontType; type++) {
                this.font[type] = [];
                for (let size = 0; size < FormulaPanel.nFontSize; size++)
                    this.font[type][size] = (FormulaPanel.FontSize[size]*this.factor)+ "px "+FormulaPanel.FontType[type];
            }
        }

        calcDim(g: HTMLCanvasElement): void {
            if (this.first) { // initialisieren
                for (let type = 0; type < FormulaPanel.nFontType; type++) {
                    this.fontMetrics[type] = [];
                    for (let size = 0; size < FormulaPanel.nFontSize; size++)
                        this.fontMetrics[type][size] = new FontMetrics({fontFamily: FormulaPanel.FontType[type], fontSize: FormulaPanel.FontSize[size]*this.factor});
                }
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.first = false;
            }
            this.d.copy(0, 0, 0);
            this.term.calcDimAll(this.baseFontSize, this.d, g);
            this.x = (this.width - this.d.w) / 2;
            if (this.baseline == -1)
                this.y = (this.height - this.d.h1 - this.d.h2) / 2 + this.d.h1;
            else
                this.y = this.baseline;
        }

        setDim(w: number, h: number, baseline: number): void {
            this.width = w;
            this.height = h;
            this.canvas.width = w;
            this.canvas.height = h;
            if (baseline != -1)
                this.baseline = baseline;
            this.resizeForced = true;
            this.repaint();
        }

        paint(g: HTMLCanvasElement, clear: boolean): void {
            this.calcDim(g);
            let ctx = g.getContext("2d");
            ctx.save();
            if ( clear ) {
                // clean
                ctx.fillStyle = this.getBackground();
                ctx.fillRect(0, 0, this.width, this.height);
            }
            // ColorArea
            for (let ca of this.area) {
                ctx.fillStyle=ca.c;
                let x1 = ca.x1 == -1 ? 0 : ca.x1;
                let y1 = ca.y1 == -1 ? 0 : ca.y1;
                ctx.fillRect(x1, y1, (ca.x2 == -1 ? this.width : ca.x2) - x1, (ca.y2 == -1 ? this.height : ca.y2) - y1);
            }
            // Terme malen
            ctx.restore();
            ctx.fillStyle = this.getForeground();
            ctx.strokeStyle = this.getForeground();
            this.term.paintAll(g, this.x, this.y);
        }

        repaint() {
            // TODO MIG
            this.paint(this.canvas, true);
        }

        setBackground(color: string): void {
            this.backgroundColor = color;
            this.canvas.style.background = color;
        }

        getBackground(): string {
            return this.backgroundColor;
        }

        setForeground(color: string): void {
            this.foregroundColor = color;
            this.canvas.style.color = color;
            this.cursorColor = color;
        }

        setCursorColor(color: string): void {
            this.cursorColor = color;
        }

        setMarkColor(color: string): void {
            this.markColor = color;
        }

        getForeground(): string {
            return this.foregroundColor;
        }

        getFont(type: number, size: number): string {
            return this.font[type][size];
        }

        getFontMetrics(type: number, size: number): FontMetrics {
            return this.fontMetrics[type][size];
        }

        getFontDim(type: number, size: number): Dim {
            let fm: FontMetrics = this.getFontMetrics(type, size);
            return new Dim(Term.correctAscent(fm.getAscent()), fm.getDescent(), /*fm.stringWidth("n") / 2*/fm.getAscent()/4);
        }

        getMiddleDelta(size: number): number {
            return this.fontMetrics[0][size].getAscent() / 3;
        }

        getLineThickness(size: number): number {
            return ((2 - size) / 2) * this.factor + 1;
        }

        getMPad(): string {
            return this.term.toMPadAll();
        }

        setValue(s: string): void {
            this.term = TermFactory.readStringS1(s, this, null);
        }

        requestRedim(): boolean {
            return (this.baseline != -1 && this.d.h1 > this.baseline) || (this.baseline == -1 && (this.d.h1 + this.d.h2 > this.height)) || this.d.w > this.width;
        }

        addColorArea(addArea: ColorArea): void {
            this.area.push(addArea);
        }

        setCursor(cursor: Term): void {
            // ignore
        }
   }
}