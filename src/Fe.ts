/// <reference path="FormulaField.ts" />
namespace fe {

    export class Fe {
        ff: FormulaField = null;

        fp: FormulaPanel = null;

        toolbar: Toolbar = null;

        oldStyle = true;

        assetsPath = 'assets/';

        constructor(canvas: HTMLCanvasElement, para: { [key: string]: any; } = {}) {
            this.oldStyle = this.booleanPara(para["oldstyle"], this.oldStyle);
            let sValue: string = para["value"];
            if (sValue == null) {
                sValue = para["mpad"];
                if (sValue != null)
                    sValue = MathePadConverter.toFormula(sValue, this.oldStyle);
            }
            this.fp = (para["noedit"] ? new FormulaPanel(canvas, sValue) : (this.ff = new FormulaField(canvas, sValue)));
            if (this.ff != null) {
                this.ff.smallCursor = this.booleanPara(para["smallcursor"], false);
                this.ff.updownMark = this.booleanPara(para["updownmark"], true); // up/down kann markieren
                this.ff.caretBlinks = this.booleanPara(para["caretblinks"], true); // Cursor blinkt
                this.ff.powIndKeys = this.booleanPara(para["powindkeys"], true); // ob Tasten ^ und _ Power bzw. Index erzeugen
                if ( para["assets"] )
                    this.assetsPath = para["assets"];
            }
            // Hintergrundfarbe
            if ( para["bgcolor"] )
                this.fp.setBackground(para["bgcolor"]);
            if ( para['fgcolor'] )
                this.fp.setForeground(para['fgcolor']);
            if ( para['cursorcolor'] )
                this.fp.setCursorColor(para['fgcolor']);
            if ( para['markcolor'] )
                this.fp.setMarkColor(para['fgcolor']);
            this.fp.debug = this.booleanPara(para["debug"], false);
            // scaling for device pixels
            if ( para['factor'] ) {
                if ( (""+para['factor']).toUpperCase() == 'NO' )
                    this.fp.factor = 1;
                else
                    this.fp.factor = parseInt(para['factor']);
            }
            // Area
            if ( para["area"] != null) {
                if ( typeof para["area"] == 'object' ) {
                    if ( typeof para["area"][0] == 'object' ) {  // multiple areas
                        for (let a of para["area"]) {
                            this.fp.addColorArea(new ColorArea(a));
                        }
                    }
                    else { // one area
                        this.fp.addColorArea(new ColorArea(para["area"]));
                    }
                }
            }
            // apply colors and areas
            this.fp.repaint();
            // Zusatz für FormulaField (Toolbar, focus usw.)
            if (this.ff != null) {
                let tbPara: string[] = [];
                for (let i = 0; i++;  )
                    if ( para['menu'+i] )
                        tbPara.push(para['menu'+i]);
                    else
                        break;
                this.toolbar = new Toolbar(this.ff, this.assetsPath, this.oldStyle, tbPara, para['menutitle'] || 'Tools');
                this.toolbar.setVisible(true);
                canvas.focus();
            }
        }

        booleanPara(para: string, defaultValue: boolean): boolean {
            if (para == null || para == undefined)
                return defaultValue;
            para = para.toLowerCase();
            if (para == "1" || para == "yes" || para == "true")
                return true;
            if (para == "0" || para == "no" || para == "false")
                return false;
            return defaultValue;
        }

        getMPad(): string {
            return this.fp.getMPad();
        }

        setMPad(s: string): void {
            this.fp.setValue(MathePadConverter.toFormula(s, this.oldStyle));
            this.fp.repaint();
        }

        setBGColor(s: string): void {
            this.fp.setBackground(s);
            this.fp.repaint();
        }

        getBGColor(): string {
            return this.fp.getBackground();
        }

        setDim(w: number, h: number, baseline: number): string {
            this.fp.setDim(w, h, baseline);
            return this.requestRedim();
        }

        getDim(): string {
            return this.fp.d.w + "," + this.fp.d.h1 + "," + this.fp.d.h2;
        }

        getYPositionOnScreen(): number {
            return this.fp.canvas.getBoundingClientRect().top;
        }

        requestRedim(): string {
            return this.fp.requestRedim() ? this.getDim() : "";
        }

        static calcAppletSizeMPad(mpad: string, xAdd: number, yAdd: number): string {
            let canvas = document.createElement('canvas');
            let f1: FormulaPanel = new FormulaPanel(canvas, MathePadConverter.toFormula(mpad, false/*oldStyle*/));
            f1.calcDim(canvas);
            return "width=\"" + (f1.d.w + xAdd) + "\" height=\"" + (f1.d.h1 + f1.d.h2 + yAdd) + "\"";
        }

        static calcDimMPad(mpad: string): string {
            let canvas = document.createElement('canvas');
            let f1: FormulaPanel = new FormulaPanel(canvas, MathePadConverter.toFormula(mpad, false/*oldStyle*/));
            f1.calcDim(canvas);
            return f1.d.w + "," + f1.d.h1 + "," + f1.d.h2;
        }
    }

}