var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fe;
(function (fe) {
    var FontMetrics = /** @class */ (function () {
        function FontMetrics(_a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.fontFamily, fontFamily = _c === void 0 ? 'Times' : _c, _d = _b.fontWeight, fontWeight = _d === void 0 ? 'normal' : _d, _e = _b.fontSize, fontSize = _e === void 0 ? 200 : _e, _f = _b.origin, origin = _f === void 0 ? 'baseline' : _f;
            this.initialized = false;
            // ——————————————————————————————————————————————————
            // Settings
            // ——————————————————————————————————————————————————
            this.settings = {
                chars: {
                    capHeight: 'S',
                    baseline: 'n',
                    xHeight: 'x',
                    descent: 'p',
                    ascent: 'h',
                    tittle: 'i'
                }
            };
            this.setFont(fontFamily, fontSize, fontWeight),
                this.res = __assign({}, this.normalize(this.getMetrics(), fontSize, origin), { fontFamily: fontFamily,
                    fontWeight: fontWeight,
                    fontSize: fontSize });
        }
        FontMetrics.prototype.getAscent = function () {
            return -this.res['ascent'];
        };
        FontMetrics.prototype.getDescent = function () {
            return this.res['descent'];
        };
        //        FontMetrics.settings = settings
        // ——————————————————————————————————————————————————
        // Methods
        // ——————————————————————————————————————————————————
        FontMetrics.prototype.initialize = function () {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.initialized = true;
        };
        FontMetrics.prototype.setFont = function (fontFamily, fontSize, fontWeight) {
            if (!this.initialized)
                this.initialize();
            this.padding = fontSize * 0.5;
            this.canvas.width = fontSize * 2;
            this.canvas.height = fontSize * 2 + this.padding;
            this.context.font = fontWeight + " " + fontSize + "px " + fontFamily;
            this.context.textBaseline = 'top';
            this.context.textAlign = 'center';
        };
        FontMetrics.prototype.setAlignment = function (baseline) {
            if (baseline === void 0) { baseline = 'top'; }
            var ty = baseline === 'bottom' ? this.canvas.height : 0;
            this.context.setTransform(1, 0, 0, 1, 0, ty);
            this.context.textBaseline = baseline;
        };
        FontMetrics.prototype.updateText = function (text) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillText(text, this.canvas.width / 2, this.padding, this.canvas.width);
        };
        FontMetrics.prototype.computeLineHeight = function () {
            var letter = 'A';
            this.setAlignment('bottom');
            var gutter = this.canvas.height - this.measureBottom(letter);
            this.setAlignment('top');
            return this.measureBottom(letter) + gutter;
        };
        FontMetrics.prototype.getPixels = function (text) {
            this.updateText(text);
            return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        };
        FontMetrics.prototype.getFirstIndex = function (pixels) {
            for (var i = 3, n = pixels.length; i < n; i += 4) {
                if (pixels[i] > 0)
                    return (i - 3) / 4;
            }
            return pixels.length;
        };
        FontMetrics.prototype.getLastIndex = function (pixels) {
            for (var i = pixels.length - 1; i >= 3; i -= 4) {
                if (pixels[i] > 0)
                    return i / 4;
            }
            return 0;
        };
        FontMetrics.prototype.normalize = function (metrics, fontSize, origin) {
            var result = {};
            var offset = metrics[origin];
            // RK for (let key in metrics) { result[key] = (metrics[key] - offset) / fontSize }
            for (var key in metrics) {
                result[key] = (metrics[key] - offset);
            }
            return result;
        };
        FontMetrics.prototype.measureTop = function (text) {
            return Math.round(this.getFirstIndex(this.getPixels(text)) / this.canvas.width) - this.padding;
        };
        FontMetrics.prototype.measureBottom = function (text) {
            return Math.round(this.getLastIndex(this.getPixels(text)) / this.canvas.width) - this.padding;
        };
        FontMetrics.prototype.getMetrics = function (chars) {
            if (chars === void 0) { chars = this.settings.chars; }
            return {
                capHeight: this.measureTop(chars.capHeight),
                baseline: this.measureBottom(chars.baseline),
                xHeight: this.measureTop(chars.xHeight),
                descent: this.measureBottom(chars.descent),
                bottom: this.computeLineHeight(),
                ascent: this.measureTop(chars.ascent),
                tittle: this.measureTop(chars.tittle),
                top: 0
            };
        };
        return FontMetrics;
    }());
    fe.FontMetrics = FontMetrics;
})(fe || (fe = {}));
/// <reference path="Utils/FontMetrics.ts" />
var fe;
(function (fe) {
    /**
     * @author krausze
     *
     */
    var Dim = /** @class */ (function () {
        /**
         * Constructor with single initial values.
         *
         * @param h1
         *            Ascent of area
         * @param h2
         *            Descent of area
         * @param w
         *            Width of area
         */
        function Dim(h1, h2, w) {
            if (h1)
                this.h1 = h1;
            if (h2)
                this.h2 = h2;
            if (w)
                this.w = w;
        }
        /**
         * Constructor with initial values.
         *
         * @param d
         *            Dim to copy values from
         */
        Dim.prototype.clone = function () {
            return new Dim(this.h1, this.h2, this.w);
        };
        /**
         * Add size of d. Areas are aligned at the same baseline besides.
         *
         * @param d
         *            Dim to add
         * @return the Dim itself
         */
        Dim.prototype.add = function (d) {
            this.h1 = this.h1 > d.h1 ? this.h1 : d.h1;
            this.h2 = this.h2 > d.h2 ? this.h2 : d.h2;
            this.w += d.w;
            return this;
        };
        /**
         * Copy values from another Dim.
         *
         * @param d
         *            Dim to copy from.
         * @return the Dim itself
         */
        Dim.prototype.copyDim = function (d) {
            this.h1 = d.h1;
            this.h2 = d.h2;
            this.w = d.w;
            return this;
        };
        /**
         * Set the values of a Dim.
         *
         * @param h1
         *            Ascent of the area.
         * @param h2
         *            Descent of the area.
         * @param w
         *            Width of the area.
         * @return the Dim itself
         */
        Dim.prototype.copy = function (h1, h2, w) {
            this.h1 = h1;
            this.h2 = h2;
            this.w = w;
            return this;
        };
        /**
         * Checks. wether the point (x,y) is in te area.
         *
         * @param x
         * @param y
         * @return true, if the point is in the area.
         */
        Dim.prototype.isIn = function (x, y) {
            return (-this.h1 <= y && y <= this.h2 && 0 <= x && x <= this.w);
        };
        /*
        * (non-Javadoc)
        *
        * @see java.lang.Object#toString()
        */
        Dim.prototype.toString = function () {
            return "(" + this.h1 + ", " + this.h2 + "; " + this.w + ")";
        };
        return Dim;
    }());
    fe.Dim = Dim;
})(fe || (fe = {}));
/// <reference path="../Utils/Dim.ts" />
/// <reference path="../IFormulaPanel.ts" />
var fe;
(function (fe) {
    var Term = /** @class */ (function () {
        function Term(fp, parent) {
            this.next = null;
            this.prev = null;
            this.fp = fp;
            this.parent = parent;
            this.dim = new fe.Dim(0, 0, 0);
        }
        // conTermbelegung
        Term.prototype.getNCon = function () {
            return 0;
        };
        Term.prototype.setCon = function (t, iCon) {
        };
        Term.prototype.getCon = function (iCon) {
            return null;
        };
        // Chain operations
        Term.prototype.insertAsNext = function (t) {
            t.prev = this;
            t.next = this.next;
            this.next = t;
            if (t.next != null)
                t.next.prev = t;
        };
        Term.prototype.insertChainAsNext = function (t) {
            t.prev = this;
            if (this.next != null) {
                var l = t.last();
                l.next = this.next;
                if (l.next != null)
                    l.next.prev = l;
            }
            this.next = t;
        };
        Term.prototype.getBehavior = function () {
            return Term.SIMPLE_DELETE;
        };
        Term.prototype.getDim = function () {
            return this.dim;
        };
        Term.prototype.getCursorDim = function () {
            return this.dim;
        };
        Term.prototype.calcDim = function (iFontSize, g) {
        };
        Term.prototype.calcDimAll = function (iFontSize, d, g) {
            this.iFontSize = iFontSize;
            this.calcDim(iFontSize, g);
            d.add(this.dim);
            if (this.next != null)
                this.next.calcDimAll(iFontSize, d, g);
        };
        Term.prototype.paint = function (g, x, y) { };
        ;
        Term.prototype.paintAll = function (g, x, y) {
            this.x = x;
            this.y = y;
            // debug start
            if (this.fp.debug) {
                var ctx = g.getContext("2d");
                ctx.save();
                ctx.strokeStyle = "#4400FF";
                ctx.strokeRect(x, y - this.dim.h1, this.dim.w, this.dim.h1);
                ctx.strokeRect(x, y, this.dim.w, this.dim.h2);
                ctx.restore();
            }
            // debug end
            this.paint(g, x, y);
            if (this.next != null)
                this.next.paintAll(g, x + this.dim.w, y);
        };
        // erstes und letztes Element der Kette
        Term.prototype.first = function () {
            return (this.prev != null) ? this.prev.first() : this;
        };
        Term.prototype.last = function () {
            return (this.next != null) ? this.next.last() : this;
        };
        Term.prototype.inSameChainInfront = function (tPrev) {
            // vor this steht
            for (var t = this.prev; t != null; t = t.prev)
                if (t == tPrev)
                    return true;
            return false;
        };
        Term.prototype.inSameChainAfter = function (tNext) {
            // this steht
            for (var t = this.next; t != null; t = t.next)
                if (t == tNext)
                    return true;
            return false;
        };
        Term.prototype.inSameChain = function (t) {
            return this.inSameChainAfter(t) || this.inSameChainInfront(t);
        };
        Term.prototype.setParentAll = function (newParent) {
            this.parent = newParent;
            if (this.next != null)
                this.next.setParentAll(newParent);
        };
        Term.prototype.getLowestMiddle = function () {
            return this.fp.getMiddleDelta(this.iFontSize);
        };
        Term.prototype.getHighestMiddle = function () {
            return this.fp.getMiddleDelta(this.iFontSize);
        };
        Term.prototype.getLowestMiddleAll = function () {
            var m = this.getLowestMiddle();
            if (this.next == null)
                return m;
            var m1 = this.next.getLowestMiddleAll();
            return m1 < m ? m1 : m;
        };
        Term.prototype.getHighestMiddleAll = function () {
            var m = this.getHighestMiddle();
            if (this.next == null)
                return m;
            var m1 = this.next.getHighestMiddleAll();
            return m1 > m ? m1 : m;
        };
        // Cursorbewegung verarbeiten
        Term.prototype.left = function (marking) {
            if (this.prev != null)
                return this.prev.cursorByLeft(marking);
            else if (!marking && this.parent != null)
                return this.parent.cursorByLeftFromChild(this, marking);
            else
                return this;
        };
        Term.prototype.right = function (marking) {
            if (this.next != null)
                return this.next.cursorByRight(marking);
            else if (!marking && this.parent != null)
                return this.parent;
            else
                return this;
        };
        Term.prototype.cursorByLeft = function (marking) {
            return this;
        };
        Term.prototype.cursorByRight = function (marking) {
            return this;
        };
        Term.prototype.cursorByLeftFromChild = function (child, marking) {
            return this;
        };
        // vertikal
        Term.prototype.down = function (marking, markBegin) {
            var help;
            if (!marking || markBegin != this) {
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
        };
        Term.prototype.up = function (marking, markBegin) {
            var help;
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
        };
        Term.prototype.cursorByDown = function (marking, x) {
            if (x < this.x + this.dim.w || this.next == null)
                return (this.prev == null || this.x + this.dim.w / 2 < x) ? this : this.prev;
            return this.next.cursorByDown(marking, x);
        };
        Term.prototype.cursorByUp = function (marking, x) {
            if (x < this.x + this.dim.w || this.next == null)
                return (this.prev == null || this.x + this.dim.w / 2 < x) ? this : this.prev;
            return this.next.cursorByUp(marking, x);
        };
        Term.prototype.cursorByDownFromChild = function (child, marking, x) {
            return null;
        };
        Term.prototype.cursorByUpFromChild = function (child, marking, x) {
            return null;
        };
        // vertikal enter (Cursor steht direkt vor demmar Komplex)
        Term.prototype.cursorEnterUp = function () {
            return null;
        };
        Term.prototype.cursorEnterDown = function () {
            return null;
        };
        // Mauspositionierung
        Term.prototype.fromXY = function (x, y) {
            // System.out.println(this.x+" "+this.y+" "+dim+" : "+x+" "+y);
            if (x < this.x + this.dim.w || this.next == null)
                return (this.prev == null || this.x + this.dim.w / 2 < x) ? this : this.prev;
            return this.next.fromXY(x, y);
        };
        Term.prototype.toStringAll = function () {
            return this.toString() + (this.next != null ? this.next.toStringAll() : "");
        };
        Term.prototype.toMPadAll = function () {
            return this.toMPad() + (this.next != null ? this.next.toMPadAll() : "");
        };
        // liefert die absolute Größe der größten Klammer in der Hauptkette
        // (wenn sie sich lohnt, also bei Fracs, Overterms usw. nicht in das
        // Haupt-con gehen = Klamer wird ja eh größer)
        //
        Term.prototype.containsBrackets = function (h) {
            if (h === undefined) {
                return (this.next != null) ? this.next.containsBrackets() : 0;
            }
            if (this.next == null)
                return h;
            var h1 = this.next.containsBrackets();
            return h > h1 ? h : h1;
        };
        Term.prototype.drawRelLine = function (ctx, x, y, w, h, b) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x + w + b, y + h);
            ctx.lineTo(x + b, y);
            ctx.closePath();
            ctx.fill();
        };
        Term.correctAscent = function (ascent) {
            return ascent; // TODO MIG ascent * 3 / 4 + 1;
        };
        Term.SIMPLE_DELETE = 1;
        Term.ENTER_UPDOWN = 2;
        return Term;
    }());
    fe.Term = Term;
})(fe || (fe = {}));
/// <reference path="IFormulaPanel.ts" />
/// <reference path="Term/Term.ts" />
var fe;
(function (fe) {
    var FormulaPanel = /** @class */ (function () {
        function FormulaPanel(canvas, sInitTerm, baseFontSize) {
            if (sInitTerm === void 0) { sInitTerm = null; }
            if (baseFontSize === void 0) { baseFontSize = 0; }
            this.canvas = canvas;
            // Double buffering
            this.width = -1; // The width and height of our offscreen image
            this.height = -1;
            this.resizeForced = false;
            this.font = [];
            this.fontMetrics = [];
            this.baseFontSize = 0;
            // für Initialisierung der Fontmetrics
            this.first = true;
            this.baseline = -1; // -1 => egal, also zentriert
            this.backgroundColor = "#FFFFFF";
            this.foregroundColor = "#000000";
            this.markColor = "#C0C0C0";
            this.cursorColor = "#000000";
            this.debug = false;
            // ColorArea
            this.area = [];
            this.init(sInitTerm, baseFontSize);
            this.paint(this.canvas, true);
        }
        FormulaPanel.prototype.init = function (sInitTerm, baseFontSize) {
            this.term = sInitTerm != null ? fe.TermFactory.readStringS1(sInitTerm, this, null) : new fe.EmptyTerm(this, null);
            this.baseFontSize = baseFontSize;
            this.d = new fe.Dim(0, 0, 0);
            // Fonts laden
            for (var type = 0; type < FormulaPanel.nFontType; type++) {
                this.font[type] = [];
                for (var size = 0; size < FormulaPanel.nFontSize; size++)
                    this.font[type][size] = FormulaPanel.FontSize[size] + "px " + FormulaPanel.FontType[type];
            }
        };
        FormulaPanel.prototype.calcDim = function (g) {
            if (this.first) {
                for (var type = 0; type < FormulaPanel.nFontType; type++) {
                    this.fontMetrics[type] = [];
                    for (var size = 0; size < FormulaPanel.nFontSize; size++)
                        this.fontMetrics[type][size] = new fe.FontMetrics({ fontFamily: FormulaPanel.FontType[type], fontSize: FormulaPanel.FontSize[size] });
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
        };
        FormulaPanel.prototype.setDim = function (w, h, baseline) {
            this.width = w;
            this.height = h;
            this.canvas.width = w;
            this.canvas.height = h;
            if (baseline != -1)
                this.baseline = baseline;
            this.resizeForced = true;
            this.repaint();
        };
        FormulaPanel.prototype.paint = function (g, clear) {
            this.calcDim(g);
            var ctx = g.getContext("2d");
            ctx.save();
            if (clear) {
                // clean
                ctx.fillStyle = this.getBackground();
                ctx.fillRect(0, 0, this.width, this.height);
            }
            // ColorArea
            for (var _i = 0, _a = this.area; _i < _a.length; _i++) {
                var ca = _a[_i];
                ctx.fillStyle = ca.c;
                var x1 = ca.x1 == -1 ? 0 : ca.x1;
                var y1 = ca.y1 == -1 ? 0 : ca.y1;
                ctx.fillRect(x1, y1, (ca.x2 == -1 ? this.width : ca.x2) - x1, (ca.y2 == -1 ? this.height : ca.y2) - y1);
            }
            // Terme malen
            ctx.restore();
            ctx.fillStyle = this.getForeground();
            ctx.strokeStyle = this.getForeground();
            this.term.paintAll(g, this.x, this.y);
        };
        FormulaPanel.prototype.repaint = function () {
            // TODO MIG
            this.paint(this.canvas, true);
        };
        FormulaPanel.prototype.setBackground = function (color) {
            this.backgroundColor = color;
            this.canvas.style.background = color;
        };
        FormulaPanel.prototype.getBackground = function () {
            return this.backgroundColor;
        };
        FormulaPanel.prototype.setForeground = function (color) {
            this.foregroundColor = color;
            this.canvas.style.color = color;
            this.cursorColor = color;
        };
        FormulaPanel.prototype.setCursorColor = function (color) {
            this.cursorColor = color;
        };
        FormulaPanel.prototype.setMarkColor = function (color) {
            this.markColor = color;
        };
        FormulaPanel.prototype.getForeground = function () {
            return this.foregroundColor;
        };
        FormulaPanel.prototype.getFont = function (type, size) {
            return this.font[type][size];
        };
        FormulaPanel.prototype.getFontMetrics = function (type, size) {
            return this.fontMetrics[type][size];
        };
        FormulaPanel.prototype.getFontDim = function (type, size) {
            var fm = this.getFontMetrics(type, size);
            return new fe.Dim(fe.Term.correctAscent(fm.getAscent()), fm.getDescent(), /*fm.stringWidth("n") / 2*/ fm.getAscent() / 4);
        };
        FormulaPanel.prototype.getMiddleDelta = function (size) {
            return this.fontMetrics[0][size].getAscent() / 3;
        };
        FormulaPanel.prototype.getLineThickness = function (size) {
            return ((2 - size) / 2) + 1;
        };
        FormulaPanel.prototype.getMPad = function () {
            return this.term.toMPadAll();
        };
        FormulaPanel.prototype.setValue = function (s) {
            this.term = fe.TermFactory.readStringS1(s, this, null);
        };
        FormulaPanel.prototype.requestRedim = function () {
            return (this.baseline != -1 && this.d.h1 > this.baseline) || (this.baseline == -1 && (this.d.h1 + this.d.h2 > this.height)) || this.d.w > this.width;
        };
        FormulaPanel.prototype.addColorArea = function (addArea) {
            this.area.push(addArea);
        };
        // Font
        FormulaPanel.nFontType = 2;
        FormulaPanel.nFontSize = 5;
        FormulaPanel.FontType = ["SansSerif", "Lucida Sans Unicode"]; // small
        // fonts?
        FormulaPanel.FontSize = [18, 13, 8, 3, 1];
        return FormulaPanel;
    }());
    fe.FormulaPanel = FormulaPanel;
})(fe || (fe = {}));
/// <reference path="FormulaPanel.ts" />
var fe;
(function (fe) {
    var FormulaField = /** @class */ (function (_super) {
        __extends(FormulaField, _super);
        function FormulaField(canvas, sInitTerm) {
            var _this = _super.call(this, canvas, sInitTerm) || this;
            // PopupMenü
            _this.toolbar = null;
            // Caret
            _this.CaretVisible = true;
            _this.hasFocus = false;
            // Eigenschaftenparameter
            _this.smallCursor = false; // Cursor hat Font-maße und nicht die Maße des Cursor-Terms
            _this.updownMark = true; // up/down kann markieren
            _this.caretBlinks = true; // Cursor blinkt
            _this.powIndKeys = true; // ob Tasten ^ und _ Power bw. Index erzeugen
            _this.caretThread = null;
            // /*
            // * (non-Javadoc)
            // *
            // * @see java.awt.event.FocusListener#focusGained(java.awt.event.FocusEvent)
            // */
            // boolean focusAction = false;
            // boolean menuAction = false;
            // // int onSetVisible = 0;
            _this.ensureKeyFocus = 0;
            _this.cursor = _this.term;
            // Listener
            canvas.addEventListener("keypress", _this.onKeyPress.bind(_this));
            canvas.addEventListener("keydown", _this.onKeyDown.bind(_this));
            canvas.addEventListener("mousedown", _this.onMouseDown.bind(_this));
            canvas.addEventListener("mouseup", _this.onMouseUp.bind(_this));
            canvas.addEventListener("mousemove", _this.onMouseMove.bind(_this));
            canvas.addEventListener("focus", _this.onFocus.bind(_this));
            canvas.addEventListener("blur", _this.onBlur.bind(_this));
            if (_this.caretBlinks) {
                _this.caretThread = window.setInterval(function () {
                    _this.CaretVisible = !_this.CaretVisible;
                    _this.repaint();
                }, 500);
            }
            return _this;
        }
        FormulaField.prototype.paint = function (g) {
            // clear
            if (this.width != -1) {
                var ctx = g.getContext("2d");
                ctx.save();
                // clean
                ctx.fillStyle = this.getBackground();
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.restore();
            }
            // Markierung
            if (this.markBegin != null) {
                var t = this.markEnd;
                var d1 = this.markEnd.dim.clone();
                while (t.prev != null && t.prev != this.markBegin)
                    d1.add((t = t.prev).dim);
                var ctx = g.getContext("2d");
                ctx.save();
                //ctx.globalCompositeOperation = "xor";// TODO MIG ctx.fillXORMode(new Color(255, 255, 128));
                ctx.fillStyle = this.markColor;
                ctx.fillRect(this.markBegin.x + this.markBegin.dim.w, this.markBegin.y - d1.h1, d1.w, d1.h1 + d1.h2);
                ctx.restore();
                //ctx.globalCompositeOperation = "source-over";
            }
            _super.prototype.paint.call(this, g, false);
            // Paint Cursor
            if (this.CaretVisible && this.hasFocus) {
                var ctx = g.getContext("2d");
                ctx.save();
                ctx.fillStyle = this.cursorColor;
                var cursorDim = this.smallCursor ? this.getFontDim(0, this.cursor.iFontSize) : this.cursor.getCursorDim();
                ctx.beginPath();
                ctx.moveTo(this.cursor.x + this.cursor.dim.w, this.cursor.y - cursorDim.h1);
                ctx.lineTo(this.cursor.x + this.cursor.dim.w, this.cursor.y + cursorDim.h2);
                ctx.stroke();
                ctx.restore();
            }
        };
        // KeyListener
        FormulaField.prototype.onKeyDown = function (e) {
            console.log("in keyDown");
            // e.preventDefault();
            var key = e.key;
            var shift = e.shiftKey;
            var oldCursor = this.cursor;
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
            }
            else if (key == "ArrowRight") {
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
            }
            else if (key == "ArrowDown") {
                this.cursor = this.cursor.down(shift, this.markBegin);
                if (shift && this.cursor != oldCursor)
                    if (this.updownMark) {
                        this.markBegin = this.cursor.prev;
                        this.markEnd = this.cursor;
                        this.cursor = (2 * (oldCursor.x - this.cursor.x) > this.cursor.dim.w) ? this.cursor : this.cursor.prev;
                    }
                    else
                        this.cursor = oldCursor;
                if (!shift || this.markBegin == this.markEnd) {
                    this.markBegin = null;
                    this.markEnd = null;
                }
                e.preventDefault();
            }
            else if (key == "ArrowUp") {
                this.cursor = this.cursor.up(shift, this.markBegin);
                if (shift && this.cursor != oldCursor)
                    if (this.updownMark) {
                        this.markBegin = this.cursor.prev;
                        this.markEnd = this.cursor;
                        this.cursor = (2 * (oldCursor.x - this.cursor.x) > this.cursor.dim.w) ? this.cursor : this.cursor.prev;
                    }
                    else
                        this.cursor = oldCursor;
                if (!shift || this.markBegin == this.markEnd) {
                    this.markBegin = null;
                    this.markEnd = null;
                }
                e.preventDefault();
            }
            else if (key == "Delete" && this.markBegin != null) {
                this.deleteMark();
            }
            else if (key == "Delete" && this.cursor.next != null) {
                // markiert
                if ((this.cursor.next.getBehavior() & fe.Term.SIMPLE_DELETE) != 0) {
                    this.cursor.next = this.cursor.next.next;
                    if (this.cursor.next != null)
                        this.cursor.next.prev = this.cursor;
                }
                else {
                    this.markBegin = this.cursor;
                    this.markEnd = this.cursor.next;
                }
            }
            else if (key == "Backspace" && this.markBegin != null) {
                this.deleteMark();
            }
            else if (key == "Backspace") {
                if (this.cursor.prev != null && (this.cursor.getBehavior() & fe.Term.SIMPLE_DELETE) != 0) {
                    this.cursor = this.cursor.prev;
                    this.cursor.next = this.cursor.next.next;
                    if (this.cursor.next != null)
                        this.cursor.next.prev = this.cursor;
                }
                else if (this.cursor.prev != null) {
                    this.markBegin = this.cursor.prev;
                    this.markEnd = this.cursor;
                }
                else if (this.cursor.parent != null) {
                    this.markBegin = this.cursor.parent.prev;
                    this.markEnd = this.cursor.parent;
                }
            }
            this.repaint();
        };
        FormulaField.prototype.onKeyPress = function (e) {
            e.preventDefault();
            var c = e.key;
            console.log("keyPress: " + c);
            if (c == '^' && this.powIndKeys) {
                this.exec("new \\power#");
                return;
            }
            if (c == '_' && this.powIndKeys) {
                this.exec("new \\index#");
                return;
            }
            if (this.markBegin != null)
                this.deleteMark();
            this.cursor.insertAsNext(new fe.SimpleTerm(this, this.cursor.parent, c == '*' ? "\u2027" : "" + c, 0));
            this.cursor = this.cursor.next;
            this.repaint();
        };
        // High Level Funktionen mit der Markierung
        FormulaField.prototype.deleteMark = function () {
            // einfaches auslinken reicht
            this.markBegin.next = this.markEnd.next;
            if (this.markEnd.next != null)
                this.markEnd.next.prev = this.markBegin;
            this.cursor = this.markBegin;
            this.markBegin = null;
            this.markEnd = null;
        };
        // kettet Markierung aus und fügt inserTerm ein,
        // liefert ausgekettete Termkette (die Markierung zurück) (ohne
        // führenden EmptyTerm)
        // insertTerm darf auch null sein
        FormulaField.prototype.chainOutMark = function (insertTerm) {
            // ausskettung retten
            var res = this.markBegin.next;
            // verkleben
            if (insertTerm == null) {
                this.markBegin.next = this.markEnd.next;
                if (this.markEnd.next != null)
                    this.markEnd.next.prev = this.markBegin;
            }
            else {
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
        };
        // Steuerung von außen
        FormulaField.prototype.exec = function (command) {
            if (fe.StrUtil.startsWith(command, "new ")) {
                // speziell für l-Terme
                if (fe.StrUtil.startsWith(command, "new \\lindex") || fe.StrUtil.startsWith(command, "new \\lpower") || fe.StrUtil.startsWith(command, "new \\lpowind")) {
                    if (this.markBegin != null)
                        this.cursor = this.markBegin;
                    else if (this.cursor.prev != null)
                        this.cursor = this.cursor.prev;
                    this.markBegin = null;
                }
                // weiter normal
                if (this.markBegin != null)
                    this.cursor = this.markBegin; // cursor darf nicht auf MarkEnd sitzen
                var tMark = this.markBegin != null ? this.chainOutMark(null) : null;
                // achtung, es kommt etwas mit führendem EmptyTerm zurück, also gleich .next
                var t = fe.TermFactory.readStringS2(command.substring(4), this, this.cursor.parent, tMark).next;
                if (t == null)
                    return;
                var tLast = t.last();
                this.cursor.insertChainAsNext(t);
                if (t.getNCon() == 0)
                    this.cursor = tLast.cursorByLeft(false);
                else
                    this.cursor = t.getCon((t.getNCon() > 1 && tMark != null && command.indexOf('#') != -1) ? 1 : 0).last().cursorByLeft(false);
                this.repaint();
            }
        };
        // MausActions
        FormulaField.prototype.onMouseDown = function (e) {
            e.preventDefault();
            this.ensureKeyFocus = 0;
            if (!this.hasFocus) {
                this.requestFocus();
            }
            var xm = e.offsetX;
            var ym = e.offsetY;
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
        };
        FormulaField.prototype.onMouseUp = function (e) {
            e.preventDefault();
            this.mouseMark = false;
        };
        // MouseMotions
        FormulaField.prototype.onMouseMove = function (e) {
            e.preventDefault();
            var xm = e.offsetX;
            var ym = e.offsetY;
            if (this.d.isIn(xm - this.x, ym - this.y) && this.mouseMark) {
                this.cursor = this.term.fromXY(xm, ym);
                this.mouseMarkTerm2 = this.cursor;
                // Markierung setzen
                if (this.mouseMarkTerm1 == this.mouseMarkTerm2) {
                    this.markBegin = this.cursor.prev;
                    this.markEnd = this.cursor;
                }
                else {
                    // Termchains bilden (von Root alle parents bis zum Term
                    var tc1 = fe.TermChainer.MakeTermChainer(this.mouseMarkTerm1);
                    var tc2 = fe.TermChainer.MakeTermChainer(this.mouseMarkTerm2);
                    // finden, wo die Kette auseinander geht
                    // System.out.println(tc1.term+" "+tc2.term);
                    while (tc1.term == tc2.term && tc1.next != null && tc2.next != null) {
                        tc1 = tc1.next;
                        tc2 = tc2.next;
                    }
                    // ist ein tc-Term womöglich schon ein Mark-term?
                    if (tc1.next == null && tc1.term == tc2.term) {
                        var p = tc1.term;
                        this.markBegin = p.prev != null ? p.prev : p;
                        this.markEnd = p;
                        this.cursor = this.markBegin;
                    }
                    else if (tc2.next == null && tc1.term == tc2.term) {
                        var p = tc2.term;
                        this.markBegin = p.prev != null ? p.prev : p;
                        this.markEnd = p;
                        this.cursor = this.markEnd;
                    }
                    else if (tc1.term.inSameChainInfront(tc2.term)) {
                        // Kette ,
                        // tc2 ...
                        // tc1
                        this.markBegin = (tc2.next != null && tc2.term.prev != null) ? tc2.term.prev : tc2.term;
                        this.markEnd = tc1.term;
                        this.cursor = this.markBegin;
                    }
                    else if (tc1.term.inSameChainAfter(tc2.term)) {
                        // Kette ,
                        // tc1 ...
                        // tc2
                        this.markBegin = (tc1.next != null && tc1.term.prev != null) ? tc1.term.prev : tc1.term;
                        this.markEnd = tc2.term;
                        this.cursor = this.markEnd;
                    }
                    else {
                        var p = tc1.term.parent;
                        this.markBegin = p.prev != null ? p.prev : p;
                        this.markEnd = p;
                        this.cursor = p;
                    }
                }
                this.repaint();
            }
        };
        FormulaField.prototype.onFocus = function (e) {
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
        };
        FormulaField.prototype.onBlur = function (e) {
            console.log("blur");
            // TODO MIG if (ensureKeyFocus > 0)
            //     ensureKeyFocus--;
            if (this.toolbar != null && this.toolbar.isVisible() /*&& this.ensureKeyFocus == 0*/)
                this.closeToolbar();
            // focusAction = false;
            this.hasFocus = false;
        };
        FormulaField.prototype.closeToolbar = function () {
            var _this = this;
            this.doCloseToolbar = true;
            setTimeout(function () {
                if (_this.doCloseToolbar) {
                    _this.toolbar.setVisible(false);
                    _this.doCloseToolbar = false;
                }
            }, 500);
        };
        FormulaField.prototype.preventCloseToolbar = function () {
            this.doCloseToolbar = false;
        };
        FormulaField.prototype.requestFocus = function () {
            this.canvas.focus();
        };
        return FormulaField;
    }(fe.FormulaPanel));
    fe.FormulaField = FormulaField;
})(fe || (fe = {}));
/// <reference path="FormulaField.ts" />
var fe;
(function (fe) {
    var Fe = /** @class */ (function () {
        function Fe(canvas, para) {
            if (para === void 0) { para = {}; }
            this.ff = null;
            this.fp = null;
            this.toolbar = null;
            this.oldStyle = true;
            this.assetsPath = 'assets/';
            this.oldStyle = this.booleanPara(para["oldstyle"], this.oldStyle);
            var sValue = para["value"];
            if (sValue == null) {
                sValue = para["mpad"];
                if (sValue != null)
                    sValue = fe.MathePadConverter.toFormula(sValue, this.oldStyle);
            }
            this.fp = (para["noedit"] ? new fe.FormulaPanel(canvas, sValue) : (this.ff = new fe.FormulaField(canvas, sValue)));
            if (this.ff != null) {
                this.ff.smallCursor = this.booleanPara(para["smallcursor"], false);
                this.ff.updownMark = this.booleanPara(para["updownmark"], true); // up/down kann markieren
                this.ff.caretBlinks = this.booleanPara(para["caretblinks"], true); // Cursor blinkt
                this.ff.powIndKeys = this.booleanPara(para["powindkeys"], true); // ob Tasten ^ und _ Power bzw. Index erzeugen
                if (para["assets"])
                    this.assetsPath = para["assets"];
            }
            // Hintergrundfarbe
            if (para["bgcolor"])
                this.fp.setBackground(para["bgcolor"]);
            if (para['fgcolor'])
                this.fp.setForeground(para['fgcolor']);
            if (para['cursorcolor'])
                this.fp.setCursorColor(para['fgcolor']);
            if (para['markcolor'])
                this.fp.setMarkColor(para['fgcolor']);
            this.fp.debug = this.booleanPara(para["debug"], false);
            // Area
            if (para["area"] != null) {
                if (typeof para["area"] == 'object') {
                    if (typeof para["area"][0] == 'object') {
                        for (var _i = 0, _a = para["area"]; _i < _a.length; _i++) {
                            var a = _a[_i];
                            this.fp.addColorArea(new fe.ColorArea(a));
                        }
                    }
                    else {
                        this.fp.addColorArea(new fe.ColorArea(para["area"]));
                    }
                }
            }
            // apply colors and areas
            this.fp.repaint();
            // Zusatz für FormulaField (Toolbar, focus usw.)
            if (this.ff != null) {
                var tbPara = [];
                for (var i = 0; i++;)
                    if (para['menu' + i])
                        tbPara.push(para['menu' + i]);
                    else
                        break;
                this.toolbar = new fe.Toolbar(this.ff, this.assetsPath, this.oldStyle, tbPara);
                this.toolbar.setVisible(true);
                canvas.focus();
            }
        }
        Fe.prototype.booleanPara = function (para, defaultValue) {
            if (para == null || para == undefined)
                return defaultValue;
            para = para.toLowerCase();
            if (para == "1" || para == "yes" || para == "true")
                return true;
            if (para == "0" || para == "no" || para == "false")
                return false;
            return defaultValue;
        };
        Fe.prototype.getMPad = function () {
            return this.fp.getMPad();
        };
        Fe.prototype.setMPad = function (s) {
            this.fp.setValue(fe.MathePadConverter.toFormula(s, this.oldStyle));
            this.fp.repaint();
        };
        Fe.prototype.setBGColor = function (s) {
            this.fp.setBackground(s);
            this.fp.repaint();
        };
        Fe.prototype.getBGColor = function () {
            return this.fp.getBackground();
        };
        Fe.prototype.setDim = function (w, h, baseline) {
            this.fp.setDim(w, h, baseline);
            return this.requestRedim();
        };
        Fe.prototype.getDim = function () {
            return this.fp.d.w + "," + this.fp.d.h1 + "," + this.fp.d.h2;
        };
        Fe.prototype.getYPositionOnScreen = function () {
            return this.fp.canvas.getBoundingClientRect().top;
        };
        Fe.prototype.requestRedim = function () {
            return this.fp.requestRedim() ? this.getDim() : "";
        };
        Fe.calcAppletSizeMPad = function (mpad, xAdd, yAdd) {
            var canvas = document.createElement('canvas');
            var f1 = new fe.FormulaPanel(canvas, fe.MathePadConverter.toFormula(mpad, false /*oldStyle*/));
            f1.calcDim(canvas);
            return "width=\"" + (f1.d.w + xAdd) + "\" height=\"" + (f1.d.h1 + f1.d.h2 + yAdd) + "\"";
        };
        Fe.calcDimMPad = function (mpad) {
            var canvas = document.createElement('canvas');
            var f1 = new fe.FormulaPanel(canvas, fe.MathePadConverter.toFormula(mpad, false /*oldStyle*/));
            f1.calcDim(canvas);
            return f1.d.w + "," + f1.d.h1 + "," + f1.d.h2;
        };
        return Fe;
    }());
    fe.Fe = Fe;
})(fe || (fe = {}));
var fe;
(function (fe) {
    var MCode = /** @class */ (function () {
        function MCode(name, priority, trans, symbol) {
            if (symbol === void 0) { symbol = ""; }
            this.name = name;
            this.priority = priority;
            this.trans = trans;
            this.symbol = symbol;
        }
        MCode.prototype.getTrans = function (oldStyle) {
            return oldStyle && this.symbol != "" ? ("FONT1" + this.symbol) : this.trans;
        };
        return MCode;
    }());
    fe.MCode = MCode;
})(fe || (fe = {}));
var fe;
(function (fe) {
    var StrUtil = /** @class */ (function () {
        function StrUtil() {
        }
        StrUtil.startsWith = function (haystack, needle, start) {
            if (start === void 0) { start = 0; }
            return haystack.indexOf(needle, start) == start;
        };
        StrUtil.endsWith = function (haystack, needle, start) {
            if (start === void 0) { start = 0; }
            var lHaystack = haystack.length;
            var lNeedle = needle.length;
            return lNeedle <= lHaystack && haystack.substr(lHaystack - lNeedle) == needle;
        };
        return StrUtil;
    }());
    fe.StrUtil = StrUtil;
})(fe || (fe = {}));
/// <reference path="MCode.ts" />
/// <reference path="Utils/StrUtil.ts" />
var fe;
(function (fe) {
    var MathePadConverter = /** @class */ (function () {
        function MathePadConverter() {
        }
        MathePadConverter.Replace = function (s, find, replace) {
            var res = "";
            var i = 0, j;
            while (i < s.length && (j = s.indexOf(find, i)) != -1) {
                res += s.substring(i, j);
                res += replace;
                i = j + find.length;
            }
            if (i < s.length)
                res += s.substring(i);
            return res;
        };
        MathePadConverter.HTML2MetaHTML = function (s) {
            var res = MathePadConverter.Replace(s, "&auml;", "ä");
            res = MathePadConverter.Replace(res, "&ouml;", "ö");
            res = MathePadConverter.Replace(res, "&uuml;", "ü");
            res = MathePadConverter.Replace(res, "&Auml;", "Ä");
            res = MathePadConverter.Replace(res, "&Ouml;", "Ö");
            res = MathePadConverter.Replace(res, "&Uuml;", "Ü");
            res = MathePadConverter.Replace(res, "&szlig;", "ß");
            return res;
        };
        MathePadConverter.toFormula = function (s, oldStyle) {
            var s1 = MathePadConverter.Text2mh(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.HTML2MetaHTML(s), "\\upsilon", "\\ypsilon"), "\\upsih", "\\ypsih"), "\\infin", "\\irfin"), "&lt;", "<"), "&gt;", ">"), oldStyle); // 14
            for (var i = 0; i < MathePadConverter.mChar.length; i += 2)
                s1 = MathePadConverter.Replace(s1, MathePadConverter.mChar[i], MathePadConverter.mChar[i + 1]);
            s1 = MathePadConverter.Replace(s1, "\\irfin", "\u221E");
            s1 = MathePadConverter.Replace(s1, "\\", "\\\\");
            s1 = MathePadConverter.Replace(s1, "@", "\\");
            // console.log("CONV: "+s+" ===> "+s1);
            return s1;
        };
        /*
        * function SafeJoin(s1, s2, h) { var res = ""; if ( (IsClean(s1) &&
        * IsClean(s2)) || s1 == "" || s2 == "" ) res = s1+s2; else res =
        * SetH(msTable, h) + '<tr><td style="white-space:nowrap;">' + s1 + '</td><td style="white-space:nowrap;">' +
        * s2 + "</td></tr></table>"; return res; }
        *
        * function SafeJoin3(s1, s2, s3, h) { var res = ""; if ( IsClean(s1) &&
        * IsClean(s2) && IsClean(s3) ) res = s1+s2+s3; else res = SetH(msTable, h) + '<tr><td style="white-space:nowrap;">' +
        * s1 + '</td><td style="white-space:nowrap;">' + s2 + '</td><td style="white-space:nowrap;">' +
        * s3 + "</td></tr></table>"; return res; }
        */
        MathePadConverter.GetIndExp = function (s, i1, i2) {
            var i = i1;
            if (i2 == 99999)
                i2 = s.length;
            if (i1 >= i2)
                return i;
            var nBracket = 0;
            var nEBracket = 0;
            var nCollect = 0;
            var nVCollect = 0;
            do {
                var ch = s.charAt(i);
                if (ch == '(')
                    nBracket++;
                else if (ch == ')') {
                    if (nBracket > 0)
                        nBracket--;
                }
                else if (ch == '[')
                    nEBracket++;
                else if (ch == ']') {
                    if (nEBracket > 0)
                        nEBracket--;
                }
                else if (ch == '\\' && i > 0 && s.charAt(i + 1) == '{') {
                    nVCollect++;
                    i++;
                }
                else if (ch == '\\' && i > 0 && s.charAt(i - 1) == '}') {
                    if (nVCollect > 0)
                        nVCollect--;
                    i++;
                }
                else if (ch == '{')
                    nCollect++;
                else if (ch == '}') {
                    if (nCollect > 0)
                        nCollect--;
                }
                i++;
            } while (i < i2 && (nBracket != 0 || nEBracket != 0 || nCollect != 0 || nVCollect != 0));
            return i;
        };
        MathePadConverter.Text2mh = function (sVal, oldStyle) {
            var sOut = "";
            var s = sVal;
            while (s.length > 0 && s.charAt(0) == ' ')
                s = s.substring(1);
            while (s.length > 0 && s.charAt(s.length - 1) == ' ')
                s = s.substring(0, s.length - 1);
            if (s == "")
                return sOut;
            var i = s.length - 1;
            var iSp = i;
            var typeSp = -1;
            var prioritySp = 100;
            var nBracket = 0;
            var nEBracket = 0;
            var nCollect = 0;
            var nVCollect = 0;
            var aBracket = 99999;
            var eBracket = 99999;
            var aEBracket = 99999;
            var eEBracket = 99999;
            var aCollect = 99999;
            var eCollect = 99999;
            var aVCollect = 99999;
            var eVCollect = 99999;
            var iExp = 99999;
            var iInd = 99999;
            // Splitpunkt Sp finden (Achtung: rückwäts)
            while (i >= 0) {
                var ch = s.charAt(i);
                if (ch == ')') {
                    nBracket++;
                    if (eBracket == 99999)
                        eBracket = i;
                }
                else if (ch == '(') {
                    if (nBracket > 0)
                        nBracket--;
                    if (aBracket == 99999 && nBracket == 0)
                        aBracket = i;
                }
                else if (ch == ']') {
                    nEBracket++;
                    if (eEBracket == 99999)
                        eEBracket = i;
                }
                else if (ch == '[') {
                    if (nEBracket > 0)
                        nEBracket--;
                    if (aEBracket == 99999 && nEBracket == 0)
                        aEBracket = i;
                }
                else if (ch == '}' && i > 0 && s.charAt(i - 1) == '\\') {
                    nVCollect++;
                    if (eVCollect == 99999)
                        eVCollect = i;
                }
                else if (ch == '{' && i > 0 && s.charAt(i - 1) == '\\') {
                    if (nVCollect > 0)
                        nVCollect--;
                    if (aVCollect == 99999 && nVCollect == 0)
                        aVCollect = i;
                }
                else if (ch == '}') {
                    nCollect++;
                    if (eCollect == 99999)
                        eCollect = i;
                }
                else if (ch == '{') {
                    if (nCollect > 0)
                        nCollect--;
                    if (aCollect == 99999 && nCollect == 0)
                        aCollect = i;
                }
                else if (nBracket == 0 && nCollect == 0 && nEBracket == 0 && nVCollect == 0) {
                    for (var j = 0; j < MathePadConverter.mCode.length; j++)
                        if (fe.StrUtil.startsWith(s, MathePadConverter.mCode[j].name, i)) {
                            if (MathePadConverter.mCode[j].priority < prioritySp) {
                                prioritySp = MathePadConverter.mCode[j].priority;
                                iSp = i;
                                typeSp = j;
                            }
                        }
                    // <=> vs. => Problem
                    if (typeSp == 1 && iSp > 0 && s.charAt(iSp - 1) == '<') {
                        iSp--;
                        typeSp++;
                    }
                    if (ch == '^' && iExp == 99999)
                        iExp = i;
                    if (ch == '_' && iInd == 99999)
                        iInd = i;
                }
                i--;
            }
            if (prioritySp != 100 && prioritySp != 9) {
                var sPre = MathePadConverter.Text2mh(s.substring(0, iSp), oldStyle);
                var sPost = MathePadConverter.Text2mh(s.substring(iSp + MathePadConverter.mCode[typeSp].name.length), oldStyle);
                var tr = MathePadConverter.mCode[typeSp].getTrans(oldStyle);
                if (fe.StrUtil.startsWith(tr, "2R"))
                    sOut = tr.substring(2) + "{" + sPost + "}{" + sPre + "}";
                else if (fe.StrUtil.startsWith(tr, "2"))
                    sOut = tr.substring(1) + "{" + sPre + "}{" + sPost + "}";
                else if (fe.StrUtil.startsWith(tr, "1"))
                    sOut = sPre + tr.substring(1) + "{" + sPost + "}";
                else
                    sOut = sPre + tr + sPost;
            }
            else if (prioritySp == 9) {
                // Teile ermitteln
                var ifirst = (iExp < iInd) ? iExp : iInd, iIndE = void 0, iExpE = void 0;
                var s1 = MathePadConverter.Text2mh(s.substring(0, ifirst), oldStyle);
                var sInd = "";
                var sExp = "";
                var s1Ind = "";
                var s1Exp = "";
                if (iInd != 99999) {
                    iIndE = MathePadConverter.GetIndExp(s, iInd + 1, iExp < iInd ? 99999 : iExp);
                    if (iIndE == iExp || iIndE == s.length)
                        sInd = s.substring(iInd + 1, iIndE);
                    else {
                        return MathePadConverter.Text2mh(s.substring(0, iIndE), oldStyle) + MathePadConverter.Text2mh(s.substring(iIndE), oldStyle);
                    }
                    s1Ind = MathePadConverter.Text2mh(sInd, oldStyle);
                }
                if (iExp != 99999) {
                    iExpE = MathePadConverter.GetIndExp(s, iExp + 1, iInd < iExp ? 99999 : iInd);
                    if (iExpE == iInd || iExpE == s.length)
                        sExp = s.substring(iExp + 1, iExpE);
                    else {
                        return MathePadConverter.Text2mh(s.substring(0, iExpE), oldStyle) + MathePadConverter.Text2mh(s.substring(iExpE), oldStyle);
                    }
                    s1Exp = MathePadConverter.Text2mh(sExp, oldStyle);
                }
                // schreiben
                if (sInd == "")
                    sOut = s1 + "^{" + MathePadConverter.Text2mh(sExp, oldStyle) + "}";
                else if (sExp == "")
                    sOut = s1 + "_{" + MathePadConverter.Text2mh(sInd, oldStyle) + "}";
                else
                    sOut = s1 + "@powind{" + s1Exp + "}{" + s1Ind + "}";
            }
            else {
                var MaxeBracket = -1;
                if (aBracket != 99999 && eBracket != 9999 && eBracket > MaxeBracket)
                    MaxeBracket = eBracket;
                if (aCollect != 99999 && eCollect != 9999 && eCollect > MaxeBracket)
                    MaxeBracket = eCollect;
                if (aEBracket != 99999 && eEBracket != 9999 && eEBracket > MaxeBracket)
                    MaxeBracket = eEBracket;
                if (aVCollect != 99999 && eVCollect != 9999 && eVCollect > MaxeBracket)
                    MaxeBracket = eVCollect;
                if (eBracket < MaxeBracket)
                    eBracket = 99999;
                if (eCollect < MaxeBracket)
                    eCollect = 99999;
                if (eEBracket < MaxeBracket)
                    eEBracket = 99999;
                if (eVCollect < MaxeBracket)
                    eVCollect = 99999;
                if (aBracket != 99999 && eBracket != 99999)
                    sOut = MathePadConverter.DoBracket(s, aBracket, eBracket, 0, 0, oldStyle); // "(",
                else if (aEBracket != 99999 && eEBracket != 99999)
                    sOut = MathePadConverter.DoBracket(s, aEBracket, eEBracket, 0, 1, oldStyle); // "[",
                else if (aVCollect != 99999 && eVCollect != 99999)
                    sOut = MathePadConverter.DoBracket(s, aVCollect, eVCollect, 1, 2, oldStyle); // "{",
                else if (aCollect != 99999 && eCollect != 99999) {
                    var sPre = MathePadConverter.Text2mh(s.substring(0, aCollect), oldStyle);
                    if (eCollect < aCollect) {
                        return sPre + "{" + MathePadConverter.Text2mh(s.substring(aCollect + 1), oldStyle);
                    }
                    var sMid = MathePadConverter.Text2mh(s.substring(aCollect + 1, eCollect), oldStyle);
                    var sPost = MathePadConverter.Text2mh(s.substring(eCollect + 1), oldStyle);
                    sOut = sPre + sMid + sPost;
                }
                else {
                    sOut = s;
                }
            }
            return sOut;
        };
        MathePadConverter.DoBracket = function (s, a, e, addChar, type, oldStyle) {
            var sPre = MathePadConverter.Text2mh(s.substring(0, a - addChar), oldStyle);
            if (e < a)
                return sPre + "@bracket" + type + "{" + MathePadConverter.Text2mh(s.substring(a + 1), oldStyle) + "}";
            var sMid = MathePadConverter.Text2mh(s.substring(a + 1, e - addChar), oldStyle);
            var sPost = MathePadConverter.Text2mh(s.substring(e + 1), oldStyle);
            return sPre + "@bracket" + type + "{" + sMid + "}" + sPost;
        };
        // auszugebende "\" werden erstmal als @ dargestellt, damit einzelne "\"
        // verdoppelt werden können
        /*
        * var msTable = "<table cellpadding=0 cellspacing=0 textpadding=0 #h#>";
        *
        * var t1 = msTable + '<tr><td align=center valign=middle nowrap style="white-space:nowrap;">';
        * var t2 = '</td><td align=center valign=middle nowrap style="white-space:nowrap;">
        * &nbsp;'; var t3 = '&nbsp; </td><td align=center valign=middle nowrap style="white-space:nowrap;">';
        * var t4 = '</td></tr></table>';
        *
        * var sym = (top.document.all || top.document.layers) && !window.opera;
        *
        * var mCode = new Array(
        */
        MathePadConverter.mCode = [
            // new MCode(" ", 0, ""),
            new fe.MCode("=>", 0, "\u21D2"), new fe.MCode("<=>", 0, "\u21D4"), new fe.MCode(";", 0, "; "), new fe.MCode("\\in", 0, "\u220A"), new fe.MCode("\\notin", 0, "\u2209"), new fe.MCode("\\subset", 2, "\u2282"), new fe.MCode("\\subseteq", 1, "\u2286"), new fe.MCode("\\supset", 2, "\u2283"), new fe.MCode("\\supseteq", 1, "\u2287"), new fe.MCode("\\notsubset", 2, "\u2284"), new fe.MCode("\\all", 2, "\u2200"), new fe.MCode("\\exist", 2, "\u2203"), new fe.MCode("<=", 3, "\u2264"), new fe.MCode(">=", 3, "\u2265"), new fe.MCode("\\asymp", 4, "\u2248"), new fe.MCode("\\to", 4, "\u2192"), new fe.MCode("=", 4, " = "), new fe.MCode("\\ne", 4, "\u2260"), new fe.MCode("<", 4, " < "), new fe.MCode(">", 4, " > "), new fe.MCode("| ", 4, "| "), new fe.MCode("|", 4, "|"), new fe.MCode("\\over", 4, "2@above"), new fe.MCode("\\cup", 5, "\u22C3"), new fe.MCode("\\cap", 6, "\u22C2"), new fe.MCode("+", 7, "+"), new fe.MCode("-", 7, "-"), new fe.MCode("\\pm", 7, "\u00B1"),
            // new MCode("-", 7, '-'),
            new fe.MCode("*", 8, "\u2027"),
            new fe.MCode(": ", 8, ": "), new fe.MCode(":", 8, ":"), new fe.MCode("/", 8, "2@frac"),
            // new MCode(" ", 8, ''), //msTable+"<tr><td align=center
            // valign=middle nowrap style="white-space:nowrap;">", "</td><td
            // align=center valign=middle nowrap>", "</td></tr></table>",
            // '&nbsp;'),
            new fe.MCode("_", 9, "_"), new fe.MCode("^", 9, "^"), new fe.MCode("\\root", 10, "1@root"), new fe.MCode("\\nroot", 10, "2R@rootn"), new fe.MCode("\\per", 10, "1@overline"), new fe.MCode("\\u", 10, "1@underline"), new fe.MCode("\\du", 10, "1@dunderline")
        ];
        MathePadConverter.mChar = ["\\null", "\u2205", "\\sigmaf", "\u03C2", "\\thetasym", "\u03D1", "\\ypsih", "\u03D2", "\\asterisk", "\u22C6",
            "\\Alpha", "\u0391", "\\Beta", "\u0392", "\\Gamma", "\u0393", "\\Delta", "\u0394", "\\Epsilon", "\u0395", "\\Zeta", "\u0396", "\\Eta", "\u0397", "\\Theta", "\u0398", "\\Iota", "\u0399", "\\Kappa", "\u039A", "\\Lambda", "\u039B", "\\Mu", "\u039C", "\\Nu", "\u039D", "\\Xi", "\u039E", "\\Omicron", "\u039F", "\\Pi", "\u03A0", "\\Rho", "\u03A1", "\\Sigma", "\u03A3", "\\Tau", "\u03A4", "\\Upsilon", "\u03A5", "\\Phi", "\u03A6", "\\Chi", "\u03A7", "\\Psi", "\u03A8", "\\Omega", "\u03A9",
            "\\alpha", "\u03B1", "\\beta", "\u03B2", "\\gamma", "\u03B3", "\\delta", "\u03B4", "\\epsilon", "\u03B5", "\\zeta", "\u03B6", "\\eta", "\u03B7", "\\theta", "\u03B8", "\\iota", "\u03B9", "\\kappa", "\u03BA", "\\lambda", "\u03BB", "\\mu", "\u03BC", "\\nu", "\u03BD", "\\xi", "\u03BE", "\\omicron", "\u03BF", "\\pi", "\u03C0", "\\rho", "\u03C1", "\\sigma", "\u03C3", "\\tau", "\u03C4", "\\ypsilon", "\u03C5", "\\phi", "\u03C6", "\\chi", "\u03C7", "\\psi", "\u03C8", "\\omega", "\u03C9",
            "\\C", "\u2102", "\\N", "\u2115", "\\P", "\u2119", "\\Q", "\u211A", "\\R", "\u211D", "\\Z", "\u2124", "\\L", "\u2124"];
        return MathePadConverter;
    }());
    fe.MathePadConverter = MathePadConverter;
})(fe || (fe = {}));
/// <reference path="IToolbar.ts" />
var fe;
(function (fe) {
    var MenuField = /** @class */ (function () {
        // subMenu == -1 => Item
        function MenuField(tb, w, h, actionCommand, subMenu) {
            var _this = this;
            this.tb = tb;
            this.actionCommand = actionCommand;
            this.subMenu = subMenu;
            this.active = false;
            this.tb = tb;
            this.actionCommand = actionCommand;
            this.subMenu = subMenu;
            this.button = document.createElement('button');
            // this.button.style.padding = "1px";
            this.button.style.width = (w + 4) + "px";
            this.button.style.height = (h + 4) + "px";
            if (subMenu && subMenu != -1)
                this.button.id = "fe_menu_" + subMenu;
            //this.button.classList.add("menutoggle");
            this.button.addEventListener('click', function () {
                if (_this.subMenu != -1)
                    tb.openSubMenu(_this.subMenu);
                else {
                    tb.choosen(actionCommand);
                }
            });
        }
        MenuField.border = 1;
        return MenuField;
    }());
    fe.MenuField = MenuField;
})(fe || (fe = {}));
/// <reference path="MenuField.ts" />
var fe;
(function (fe) {
    var FormulaMenuField = /** @class */ (function (_super) {
        __extends(FormulaMenuField, _super);
        function FormulaMenuField(tb, w, h, actionCommand, subMenu, sTerm) {
            var _this = _super.call(this, tb, w, h, actionCommand, subMenu) || this;
            _this.button.innerHTML = '<canvas width="' + w + '" heiht="' + h + '"></canvas/>';
            _this.panel = new fe.FormulaPanel(_this.button.getElementsByTagName('canvas')[0], sTerm, 1);
            return _this;
        }
        return FormulaMenuField;
    }(fe.MenuField));
    fe.FormulaMenuField = FormulaMenuField;
})(fe || (fe = {}));
/// <reference path="MenuField.ts" />
var fe;
(function (fe) {
    var ImageMenuField = /** @class */ (function (_super) {
        __extends(ImageMenuField, _super);
        function ImageMenuField(tb, w, h, actionCommand, subMenu, image) {
            var _this = _super.call(this, tb, w, h, actionCommand, subMenu) || this;
            _this.button.innerHTML = '<img src="' + image + '" valign="middle"/>';
            return _this;
        }
        return ImageMenuField;
    }(fe.MenuField));
    fe.ImageMenuField = ImageMenuField;
})(fe || (fe = {}));
/// <reference path="MenuField.ts" />
var fe;
(function (fe) {
    var PopupMenu = /** @class */ (function () {
        function PopupMenu(tb, width, oldStyle) {
            if (oldStyle === void 0) { oldStyle = false; }
            this.tb = tb;
            this.width = width;
            //setBackground(SystemColor.control);
            this.div = document.createElement('div');
            this.div.classList.add('fe-toolbar-popup');
            this.div.style.width = width + "px";
        }
        PopupMenu.prototype.setVisible = function (b, buttonPos) {
            // console.log("sho %o", buttonPos);
            if (this.div.parentElement == null)
                document.body.appendChild(this.div);
            this.div.style.display = b ? 'block' : 'none';
            if (buttonPos != undefined)
                this.setPosition(buttonPos);
        };
        PopupMenu.prototype.setPosition = function (buttonPos) {
            this.div.style.top = (buttonPos.top + buttonPos.height) + "px";
            this.div.style.left = (buttonPos.left) + "px";
        };
        PopupMenu.prototype.add = function (menu) {
            this.div.appendChild(menu.button);
        };
        PopupMenu.border = 1;
        return PopupMenu;
    }());
    fe.PopupMenu = PopupMenu;
})(fe || (fe = {}));
/// <reference path="MenuField.ts" />
var fe;
(function (fe) {
    var TextMenuField = /** @class */ (function (_super) {
        __extends(TextMenuField, _super);
        function TextMenuField(tb, w, h, actionCommand, subMenu, label) {
            var _this = _super.call(this, tb, w, h, actionCommand, subMenu) || this;
            _this.button.innerHTML = label;
            return _this;
        }
        return TextMenuField;
    }(fe.MenuField));
    fe.TextMenuField = TextMenuField;
})(fe || (fe = {}));
/// <reference path="MenuField.ts" />
/// <reference path="PopupMenu.ts" />
var fe;
(function (fe) {
    var Toolbar = /** @class */ (function () {
        function Toolbar(fp, assetPath, oldStyle, para) {
            if (para === void 0) { para = null; }
            this.fp = fp;
            this.assetPath = assetPath;
            this.oldStyle = oldStyle;
            this.nMenu = 0;
            this.menu = [];
            this.popup = [];
            this.lastFocusedMenuField = null;
            this.subMenu = -1;
            this.noticesFocus = false;
            this.movingDx = -1;
            this.movingDy = -1;
            fp.toolbar = this;
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", assetPath + 'fe.css');
            document.getElementsByTagName("head")[0].appendChild(fileref);
            this.div = document.createElement('div');
            this.div.classList.add('fe-toolbar');
            // this.div.style.position = "absolute";
            // this.div.style.top = "20px";
            // this.div.style.left = "120px";
            // this.div.style.zIndex = "999";
            this.div.innerHTML = '<div class="fe-title">Werkzeuge</div>';
            this.menuFieldArea = document.createElement('div');
            this.div.appendChild(this.menuFieldArea);
            if (para == null || para.length == 0) {
                para = ["standard"];
            }
            for (var i = 0; i < para.length; i++) {
                if (para[i] == "frac" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new fe.ImageMenuField(this, 36, 24, "", this.nMenu, assetPath + "fracroot.gif"));
                    var p = this.popup[this.nMenu++] = this.newPopup(68);
                    p.add(new fe.ImageMenuField(this, 30, 20, "new \\frac#", -1, assetPath + "frac.gif"));
                    p.add(new fe.ImageMenuField(this, 30, 20, "new \\above#", -1, assetPath + "above.gif"));
                    p.add(new fe.ImageMenuField(this, 30, 20, "new \\root#", -1, assetPath + "root2.gif"));
                    p.add(new fe.ImageMenuField(this, 30, 20, "new \\rootn#", -1, assetPath + "rootn.gif"));
                }
                if (para[i] == "index" || para[i] == "standard")
                    this.addMenu("72 'powind.gif' 36 24 'ind.gif' 'new \\index#' 20 20 'pow.gif' 'new \\power#' 'powind.gif' 'new \\powind#' " + "'lind.gif' 'new \\lindex#' 'lpow.gif' 'new \\lpower#' 'lpowind.gif' 'new \\lpowind#' " + "'top.gif' 'new \\over#' 'bot.gif' 'new \\under#' 'topbot.gif' 'new \\overunder#'");
                if (para[i] == "brackets" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new fe.ImageMenuField(this, 36, 24, "", this.nMenu, assetPath + "brackets.gif"));
                    var p = this.popup[this.nMenu++] = this.newPopup(96);
                    for (var j = 0; j < 8; j++)
                        p.add(new fe.ImageMenuField(this, 20, 20, "new \\bracket" + j + "#", -1, assetPath + "br" + j + ".gif"));
                }
                // griechisch klein
                if (para[i] == "greek" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new fe.TextMenuField(this, 36, 24, "", this.nMenu, "\u03B1 \u03C9"));
                    var p = this.popup[this.nMenu++] = this.newPopup(96);
                    for (var c = 0x03B1; c <= 0x03C9; c++)
                        p.add(new fe.TextMenuField(this, 20, 20, "new " + String.fromCharCode(c), -1, String.fromCharCode(c)));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u03D1", -1, "\u03D1"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u03D2", -1, "\u03D2"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u03D6", -1, "\u03D6"));
                }
                // griechisch groß
                if (para[i] == "GREEK" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new fe.TextMenuField(this, 36, 24, "", this.nMenu, "\u0391 \u03A9"));
                    var p = this.popup[this.nMenu++] = this.newPopup(96);
                    for (var c = 0x0391; c <= 0x03A9; c++)
                        if (c != 0x03A2)
                            p.add(new fe.TextMenuField(this, 20, 20, "new " + String.fromCharCode(c), -1, String.fromCharCode(c)));
                }
                // Sonderzeichen
                if (para[i] == "special" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new fe.TextMenuField(this, 36, 24, "", this.nMenu, "\u2264 \u2260"));
                    var p = this.popup[this.nMenu++] = this.newPopup(96);
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u2264", -1, "\u2264"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u2265", -1, "\u2265"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u227A", -1, "\u227A"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u227B", -1, "\u227B"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u2260", -1, "\u2260"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u2261", -1, "\u2261"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u2248", -1, "\u2248"));
                    p.add(new fe.TextMenuField(this, 20, 20, "new \u2245", -1, "\u2245"));
                }
                // Pfeile
                if (para[i] == "arrows" || para[i] == "standard")
                    this.addMenu("72 '\u2192\u21D4\u2193' 36 24 '\u2192' 'new \u2192' 20 20 '\u2190' 'new \u2190' '\u2194' 'new \u2194' " +
                        "'\u2191' 'new \u2191' '\u2193' 'new \u2193' '\u2195' 'new \u2195' " +
                        "'\u21D2' 'new \u21D2' '\u21D0' 'new \u21D0' '\u21D4' 'new \u21D4' " +
                        "'\u21D1' 'new \u21D1' '\u21D3' 'new \u21D3' '\u21D5' 'new \u21D5' " +
                        "'\u21A6' 'new \u21A6' '\u21B2' 'new \u21B2'");
                if (fe.StrUtil.startsWith(para[i], "menu "))
                    this.addMenu(para[i].substring(5));
            }
            // Initialize this dialog to its preferred size.
            this.div.addEventListener("mousedown", this.onMouseDown.bind(this));
            this.div.addEventListener("mouseup", this.onMouseUp.bind(this));
            this.div.addEventListener("mousemove", this.onMouseMove.bind(this));
            // addKeyListener(fp);
        }
        Toolbar.prototype.newPopup = function (width) {
            return this.oldStyle ? new fe.PopupMenu(this, width, true) : new fe.PopupMenu(this, width);
        };
        Toolbar.prototype.add = function (menu) {
            this.menuFieldArea.appendChild(menu.button);
        };
        Toolbar.prototype.addMenu = function (s) {
            var s1 = s;
            var w = 60;
            var h = 20;
            if (/^(\d+)\s+(.*)$/.test(s1)) {
                w = parseInt(RegExp.$1);
                s1 = RegExp.$2;
            }
            else {
                throw new Error("Can not interpret menu string '" + s1 + "'.");
            }
            var p = this.newPopup(w);
            var first = true;
            // einzelne Items lesen
            while (s1 != "") {
                if ((first ? /^('[^']+'|\S+)()\s+(\d+|)\s*(\d+|)\s*(.*)$/ : /^('[^']+'|\S+)\s+('[^']+'|\S+)\s*(\d+|)\s*(\d+|)\s*(.*)$/).test(s1)) {
                    var name_1 = RegExp.$1;
                    var action = RegExp.$2;
                    if (RegExp.$3)
                        w = parseInt(RegExp.$3);
                    if (RegExp.$4)
                        h = parseInt(RegExp.$4);
                    s1 = RegExp.$5;
                    if (name_1.length > 2 && name_1.charAt(0) == "'" && name_1.charAt(name_1.length - 1) == "'")
                        name_1 = name_1.substr(1, name_1.length - 2);
                    if (action.length > 2 && action.charAt(0) == "'" && action.charAt(action.length - 1) == "'")
                        action = action.substr(1, action.length - 2);
                    /*console.log("1: ", name);
                    console.log("2: ", action);
                    console.log("3: ", w);
                    console.log("4: ", h);
                    console.log("5: ", s1);*/
                    var m = void 0;
                    if (fe.StrUtil.endsWith(name_1, ".gif"))
                        m = new fe.ImageMenuField(this, w, h, action, -1, this.assetPath + name_1);
                    else if (fe.StrUtil.startsWith(name_1, "fe:"))
                        m = new fe.FormulaMenuField(this, w, h, action, -1, name_1.substr(3));
                    else
                        m = new fe.TextMenuField(this, w, h, action, -1, name_1);
                    if (first) {
                        m.subMenu = this.nMenu;
                        this.add(this.menu[this.nMenu] = m);
                        this.popup[this.nMenu++] = p;
                        first = false;
                    }
                    else
                        p.add(m);
                    //console.log("Menu: %o", m);
                }
                else {
                    throw new Error("Can not interpret menu string part '" + s1 + "'.");
                }
            }
            //console.log("popupMenu: %o", p);
        };
        Toolbar.prototype.openSubMenu = function (subMenu) {
            console.log("openSubMenu " + subMenu);
            this.fp.requestFocus();
            var oldSubMenu = this.subMenu;
            this.closeSubMenu();
            if (oldSubMenu == subMenu)
                return;
            // fp.menuAction = true;
            this.menu[subMenu].active = true;
            this.menu[subMenu].button.classList.add('pressed');
            this.setVisible(true);
            // menu[subMenu].repaint();
            // Point p1 = menu[subMenu].getLocationOnScreen();
            // // fp.focusAction = true;
            this.popup[this.subMenu = subMenu].setVisible(true, this.menu[subMenu].button.getBoundingClientRect());
            // // p[this.subMenu = subMenu].show();
            // Rectangle r = menu[subMenu].getBounds();
            // p1.y += r.height;
            // Dimension d = popup[subMenu].getPreferredSize();
            // // p[subMenu].toFront();
            // popup[subMenu].setBounds(p1.x, p1.y, d.width, d.height);
            // // p[subMenu].show();
            // if (oldStyle) {
            //     popup[subMenu].repaint();
            //     fp.focusAction = true;
            //     popup[subMenu].toFront();
            //     fp.requestFocus();
            // }
            // fp.closeToolbarThread = null;
            // fp.menuAction = false;
        };
        Toolbar.prototype.closeSubMenu = function () {
            if (this.subMenu != -1) {
                this.menu[this.subMenu].button.classList.remove('pressed');
                // fp.focusAction = true;
                // fp.menuAction = true;
                this.popup[this.subMenu].setVisible(false);
                // fp.closeToolbarThread = null;
                // fp.menuAction = false;
                this.menu[this.subMenu].active = false;
                // menu[subMenu].repaint();
                this.subMenu = -1;
            }
        };
        Toolbar.prototype.choosen = function (actionCommand) {
            this.fp.requestFocus();
            this.closeSubMenu();
            this.lastFocusedMenuField = null;
            this.fp.exec(actionCommand);
        };
        Toolbar.prototype.setVisible = function (b) {
            if (this.div.parentElement == null)
                document.body.appendChild(this.div);
            this.div.style.display = b ? 'block' : 'none';
            if (!b && this.subMenu != -1) {
                this.closeSubMenu();
            }
        };
        ;
        Toolbar.prototype.isVisible = function () {
            return this.div.parentElement != null && this.div.style.display != 'none';
        };
        //     public void windowActivated(WindowEvent e) {
        //         if (!noticesFocus) { // z.B. version 1.3.1_18
        //             fp.ensureKeyFocus = 4;
        //             fp.requestFocus();
        //             fp.hasFocus = true;
        //         } else if (oldStyle) {
        //             fp.ensureKeyFocus = 2;
        //         }
        //     }
        Toolbar.prototype.onMouseDown = function (e) {
            e.preventDefault();
            console.log("e %o", e);
            var r = this.div.getBoundingClientRect();
            this.movingDx = e.clientX - r.left;
            this.movingDy = e.clientY - r.top;
            this.fp.requestFocus();
        };
        Toolbar.prototype.onMouseMove = function (e) {
            e.preventDefault();
            if (this.movingDx != -1) {
                this.div.style.left = (-this.movingDx + e.clientX) + "px";
                this.div.style.top = (-this.movingDy + e.clientY) + "px";
                if (this.subMenu != -1)
                    this.popup[this.subMenu].setPosition(this.menu[this.subMenu].button.getBoundingClientRect());
            }
        };
        Toolbar.prototype.onMouseUp = function (e) {
            e.preventDefault();
            this.movingDx = -1;
        };
        return Toolbar;
    }());
    fe.Toolbar = Toolbar;
})(fe || (fe = {}));
/// <reference path="Term.ts" />
var fe;
(function (fe) {
    var EmptyTerm = /** @class */ (function (_super) {
        __extends(EmptyTerm, _super);
        function EmptyTerm(fp, parent) {
            return _super.call(this, fp, parent) || this;
        }
        EmptyTerm.prototype.calcDim = function (iFontSize, g) {
            var fm = this.fp.getFontMetrics(0, this.iFontSize);
            this.dim.h1 = fe.Term.correctAscent(fm.getAscent());
            this.dim.h2 = fm.getDescent(); // fm.getDescent();
            this.dim.w = 0; // TEST fm.getAscent() / 4; // tm.width / 2;
        };
        EmptyTerm.prototype.paint = function (g, x, y) {
            if (this.next == null) {
                var ctx = g.getContext("2d");
                ctx.save();
                ctx.fillStyle = "#C0C0C0";
                ctx.fillRect(x, y - this.dim.h1, this.dim.w, this.dim.h1 + this.dim.h2);
                ctx.restore();
            }
        };
        EmptyTerm.prototype.toString = function () {
            return "EmtyTerm()";
        };
        EmptyTerm.prototype.toMPad = function () {
            return "";
        };
        return EmptyTerm;
    }(fe.Term));
    fe.EmptyTerm = EmptyTerm;
})(fe || (fe = {}));
/// <reference path="Term.ts" />
/// <reference path="EmptyTerm.ts" />
var fe;
(function (fe) {
    var DoubleContainerTerm = /** @class */ (function (_super) {
        __extends(DoubleContainerTerm, _super);
        function DoubleContainerTerm(fp, parent, mainIsTop) {
            var _this = _super.call(this, fp, parent) || this;
            /** wether main term is on top of subterm */
            _this.mainIsTop = true;
            _this.con1 = new fe.EmptyTerm(fp, _this);
            _this.con2 = new fe.EmptyTerm(fp, _this);
            _this.d1 = new fe.Dim();
            _this.d2 = new fe.Dim();
            _this.mainIsTop = mainIsTop;
            return _this;
        }
        // conTermbelegung
        DoubleContainerTerm.prototype.getNCon = function () {
            return 2;
        };
        DoubleContainerTerm.prototype.setCon = function (t, iCon) {
            if (iCon == 0) {
                this.con1 = t;
                this.con1.setParentAll(this);
            }
            else if (iCon == 1) {
                this.con2 = t;
                this.con2.setParentAll(this);
            }
        };
        DoubleContainerTerm.prototype.getCon = function (iCon) {
            if (iCon == 0)
                return this.con1;
            else if (iCon == 1)
                return this.con2;
            else
                return null;
        };
        DoubleContainerTerm.prototype.getBehavior = function () {
            return fe.Term.ENTER_UPDOWN;
        };
        DoubleContainerTerm.prototype.getUpper = function () {
            return this.mainIsTop ? this.con1 : this.con2;
        };
        DoubleContainerTerm.prototype.getLower = function () {
            return this.mainIsTop ? this.con2 : this.con1;
        };
        DoubleContainerTerm.prototype.getLowestMiddle = function () {
            return this.mainIsTop ? this.con2.getLowestMiddleAll() - this.dy2 : this.con1.getLowestMiddleAll() - this.dy1;
        };
        DoubleContainerTerm.prototype.getHighestMiddle = function () {
            return this.mainIsTop ? this.con1.getHighestMiddleAll() - this.dy1 : this.con2.getHighestMiddleAll() - this.dy2;
        };
        DoubleContainerTerm.prototype.paint = function (g, x, y) {
            this.con1.paintAll(g, x + this.dx1, y + this.dy1);
            this.con2.paintAll(g, x + this.dx2, y + this.dy2);
        };
        DoubleContainerTerm.prototype.left = function (marking) {
            return marking ? this.prev : this.con1.last().cursorByLeft(marking);
        };
        DoubleContainerTerm.prototype.cursorByLeft = function (marking) {
            return this; // con1.last().cursorByLeft();
        };
        DoubleContainerTerm.prototype.cursorByRight = function (marking) {
            return marking ? this : this.con1.cursorByRight(marking);
        };
        DoubleContainerTerm.prototype.cursorByLeftFromChild = function (child, marking) {
            return this.prev;
        };
        DoubleContainerTerm.prototype.down = function (marking, markBegin) {
            return marking ? this : this.getLower().last().cursorByLeft(marking);
        };
        DoubleContainerTerm.prototype.up = function (marking, markBegin) {
            return marking ? this : this.getUpper().last().cursorByLeft(marking);
        };
        DoubleContainerTerm.prototype.cursorByDown = function (marking, x) {
            return this.getUpper().cursorByDown(marking, x);
        };
        DoubleContainerTerm.prototype.cursorByUp = function (marking, x) {
            return this.getLower().cursorByUp(marking, x);
        };
        DoubleContainerTerm.prototype.cursorByDownFromChild = function (child, marking, x) {
            if (child.first() == this.getUpper())
                return marking ? this : this.getLower().cursorByDown(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByDownFromChild(this, marking, x);
            else
                return null;
        };
        DoubleContainerTerm.prototype.cursorByUpFromChild = function (child, marking, x) {
            if (child.first() == this.getLower())
                return marking ? this : this.getUpper().cursorByUp(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByUpFromChild(this, marking, x);
            else
                return null;
        };
        DoubleContainerTerm.prototype.cursorEnterUp = function () {
            return this.getUpper();
        };
        DoubleContainerTerm.prototype.cursorEnterDown = function () {
            return this.getLower();
        };
        // Mauspositionierung
        DoubleContainerTerm.prototype.fromXY = function (x, y) {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            // direkter Treffer?
            if (this.d1.isIn(x - this.x - this.dx1, y - this.y - this.dy1))
                return this.con1.fromXY(x, y);
            if (this.d2.isIn(x - this.x - this.dx2, y - this.y - this.dy2))
                return this.con2.fromXY(x, y);
            // oben oder unten
            if (y < this.y + (this.dy1 + this.dy2 + (this.mainIsTop ? this.d1.h2 - this.d2.h1 : this.d2.h2 - this.d1.h1)) / 2)
                return this.getUpper().fromXY(x, y);
            return this.getLower().fromXY(x, y);
        };
        return DoubleContainerTerm;
    }(fe.Term));
    fe.DoubleContainerTerm = DoubleContainerTerm;
})(fe || (fe = {}));
/// <reference path="DoubleContainerTerm.ts" />
var fe;
(function (fe) {
    var AboveTerm = /** @class */ (function (_super) {
        __extends(AboveTerm, _super);
        function AboveTerm(fp, parent) {
            return _super.call(this, fp, parent, true) || this;
        }
        AboveTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize, this.d2, g);
            // FontMetrics fm = fp.getFontMetrics(0, iFontSize);
            var m = this.fp.getMiddleDelta(iFontSize);
            var lh = this.fp.getLineThickness(iFontSize);
            var wb = (this.d1.w > this.d2.w ? this.d1.w : this.d2.w);
            this.dx1 = 2 * lh + (wb - this.d1.w) / 2;
            this.dx2 = 2 * lh + (wb - this.d2.w) / 2;
            this.dy1 = -m - lh * 3 / 2 - this.d1.h2;
            this.dy2 = -m + (lh * 3 - lh * 3 / 2) + this.d2.h1;
            this.dim.w = wb + 4 * lh;
            this.dim.h1 = -this.dy1 + this.d1.h1;
            this.dim.h2 = this.dy2 + this.d2.h2;
        };
        AboveTerm.prototype.paint = function (g, x, y) {
            this.con1.paintAll(g, x + this.dx1, y + this.dy1);
            this.con2.paintAll(g, x + this.dx2, y + this.dy2);
            /*
            * int m = fp.getMiddleDelta(iFontSize); int lh =
            * fp.getLineThickness(iFontSize); g.fillRect(x+lh, y-m-lh/2,
            * dim.w-2*lh, lh);
            */
        };
        AboveTerm.prototype.toString = function () {
            return "\\above{" + this.con1 + "}{" + this.con2 + "}";
        };
        AboveTerm.prototype.toMPad = function () {
            return "{" + this.con1.toMPadAll() + "}\\over{" + this.con2.toMPadAll() + "}";
        };
        return AboveTerm;
    }(fe.DoubleContainerTerm));
    fe.AboveTerm = AboveTerm;
})(fe || (fe = {}));
/// <reference path="Term.ts" />
/// <reference path="EmptyTerm.ts" />
var fe;
(function (fe) {
    var SingleContainerTerm = /** @class */ (function (_super) {
        __extends(SingleContainerTerm, _super);
        function SingleContainerTerm(fp, parent) {
            var _this = _super.call(this, fp, parent) || this;
            _this.con = new fe.EmptyTerm(fp, _this);
            _this.d = new fe.Dim();
            return _this;
        }
        // conTermbelegung
        SingleContainerTerm.prototype.getNCon = function () {
            return 1;
        };
        SingleContainerTerm.prototype.setCon = function (t, iCon) {
            if (iCon == 0) {
                this.con = t;
                this.con.setParentAll(this);
            }
        };
        SingleContainerTerm.prototype.getCon = function (iCon) {
            if (iCon == 0)
                return this.con;
            return null;
        };
        SingleContainerTerm.prototype.getLowestMiddle = function () {
            return this.con.getLowestMiddleAll() - this.dy;
        };
        SingleContainerTerm.prototype.getHighestMiddle = function () {
            return this.con.getHighestMiddleAll() - this.dy;
        };
        SingleContainerTerm.prototype.paint = function (g, x, y) {
            this.con.paintAll(g, x + this.dx, y + this.dy);
        };
        SingleContainerTerm.prototype.left = function (marking) {
            return marking ? this.prev : this.con.last().cursorByLeft(marking);
        };
        SingleContainerTerm.prototype.cursorByLeft = function (marking) {
            return this;
        };
        SingleContainerTerm.prototype.cursorByRight = function (marking) {
            return marking ? this : this.con.cursorByRight(marking);
        };
        SingleContainerTerm.prototype.cursorByLeftFromChild = function (child, marking) {
            return this.prev;
        };
        SingleContainerTerm.prototype.cursorByDown = function (marking, x) {
            return this.con.cursorByDown(marking, x);
        };
        SingleContainerTerm.prototype.cursorByUp = function (marking, x) {
            return this.con.cursorByUp(marking, x);
        };
        SingleContainerTerm.prototype.cursorByDownFromChild = function (child, marking, x) {
            if (marking)
                return this;
            else if (this.parent != null)
                return this.parent.cursorByDownFromChild(this, marking, x);
            else
                return null;
        };
        SingleContainerTerm.prototype.cursorByUpFromChild = function (child, marking, x) {
            if (marking)
                return this;
            else if (this.parent != null)
                return this.parent.cursorByUpFromChild(this, marking, x);
            else
                return null;
        };
        // Mauspositionierung
        SingleContainerTerm.prototype.fromXY = function (x, y) {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            if (x > this.x + (this.dx + this.d.w + this.dim.w) / 2)
                return this;
            return this.con.fromXY(x, y);
        };
        SingleContainerTerm.prototype.toString = function () {
            return "SingleTerm(" + this.con + ")";
        };
        return SingleContainerTerm;
    }(fe.Term));
    fe.SingleContainerTerm = SingleContainerTerm;
})(fe || (fe = {}));
/// <reference path="SingleContainerTerm.ts" />
var fe;
(function (fe) {
    var BracketTerm = /** @class */ (function (_super) {
        __extends(BracketTerm, _super);
        function BracketTerm(fp, parent, type) {
            var _this = _super.call(this, fp, parent) || this;
            _this.centerBr = false;
            _this.canUseFont = true;
            _this.type = type;
            return _this;
        }
        BracketTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize, this.d, g);
            // Höhe der Klammer berechnen (Symmetrie beachten)
            var m = this.fp.getMiddleDelta(iFontSize);
            var h = this.d.h1 - m > this.d.h2 + m ? this.d.h1 - m : this.d.h2 + m; // Flügelhöhe
            // Dim dFont = fp.getFontDim(0, iFontSize);
            var lh = this.fp.getLineThickness(iFontSize);
            this.addBorder = BracketTerm.borderFactor[this.type] * lh; // dFont.w*h/dFont.h1;
            this.dx = this.addBorder;
            this.dy = 0;
            this.dim.w = 2 * (this.addBorder) + this.d.w;
            this.canUseFont = true;
            if (this.centerBr) {
                this.dim.h1 = h + 2 * lh + m;
                this.dim.h2 = h + 2 * lh - m;
            }
            else {
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
        };
        BracketTerm.prototype.paint = function (g, x, y) {
            this.con.paintAll(g, x + this.dx, y + this.dy);
            // int m = fp.getMiddleDelta(iFontSize);
            var dFont = this.fp.getFontDim(0, this.iFontSize);
            var lh = this.fp.getLineThickness(this.iFontSize);
            // calc size of "ordinary" brackets
            /*
            * FontMetrics fm = fp.getFontMetrics(iFontIndex, iFontSize); dim.h1 =
            * fm.getAscent()-fm.getLeading(); dim.h2 = fm.getDescent();
            */
            var ctx = g.getContext("2d");
            ctx.save();
            if (this.type == 0) {
                if (this.d.h1 <= dFont.h1 && this.d.h2 <= dFont.h2 && this.canUseFont) {
                    ctx.font = this.fp.getFont(0, this.iFontSize);
                    ctx.fillText("(", x, y - lh);
                    ctx.fillText(")", x + this.addBorder + this.d.w + lh + lh + lh - ctx.measureText(")").width, y - lh);
                }
                else {
                    // ctx.fillRect(x+lh, y-dim.h1, lh, dim.h1+dim.h2);
                    // ctx.fillRect(x+addBorder+d.w+lh, y-dim.h1, lh, dim.h1+dim.h2);
                    var h2 = (this.dim.h1 + this.dim.h2) / 2;
                    var d1 = lh + lh;
                    var r = ((d1 * d1 + h2 * h2) / 2) / d1;
                    var beta = Math.atan((2 * d1 * h2) / (h2 * h2 - d1 * d1));
                    ctx.beginPath();
                    ctx.arc(x + lh / 2 + r, y - this.dim.h1 + h2, r, Math.PI - beta, Math.PI + beta);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x + this.addBorder + this.d.w + 3 * lh / 2 - r, y - this.dim.h1 + h2, r, -beta, beta);
                    ctx.stroke();
                    d1 = lh + lh - 1;
                    r = ((d1 * d1 + h2 * h2) / 2) / d1;
                    beta = Math.atan((2 * d1 * h2) / (h2 * h2 - d1 * d1));
                    ctx.beginPath();
                    ctx.arc(x + lh / 2 + 1 + r, y - this.dim.h1 + h2, r, Math.PI - beta, Math.PI + beta);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x + this.addBorder + this.d.w + 3 * lh / 2 - r - 1, y - this.dim.h1 + h2, r, -beta, beta);
                    ctx.stroke();
                }
            }
            else if (this.type == 1) {
                if (this.d.h1 <= dFont.h1 && this.d.h2 <= dFont.h2 && this.canUseFont) {
                    ctx.font = this.fp.getFont(0, this.iFontSize);
                    ctx.fillText("[", x, y - lh);
                    ctx.fillText("]", x + this.addBorder + this.d.w + lh + lh + lh - ctx.measureText(")").width, y - lh);
                }
                else {
                    ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                    ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                    ctx.fillRect(x + 2 * lh, y - this.dim.h1, 2 * lh, lh);
                    ctx.fillRect(x + 2 * lh, y + this.dim.h2 - lh, 2 * lh, lh);
                    ctx.fillRect(x + this.addBorder + this.d.w - lh, y - this.dim.h1, 2 * lh, lh);
                    ctx.fillRect(x + this.addBorder + this.d.w - lh, y + this.dim.h2 - lh, 2 * lh, lh);
                }
            }
            else if (this.type == 2) {
                if (this.d.h1 <= dFont.h1 && this.d.h2 <= dFont.h2 && this.canUseFont) {
                    ctx.font = this.fp.getFont(0, this.iFontSize);
                    ctx.fillText("{", x, y - lh);
                    ctx.fillText("}", x + this.addBorder + this.d.w + lh + lh + lh - ctx.measureText(")").width, y - lh);
                }
                else {
                    var h = this.dim.h1 + this.dim.h2;
                    var h2 = h / 2;
                    var y1 = y - this.dim.h1 + h2;
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
            }
            else if (this.type == 3) {
                var ym = y + (this.dim.h2 - this.dim.h1) / 2;
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
            }
            else if (this.type == 4) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
            }
            else if (this.type == 5) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + 3 * lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + 3 * lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
            }
            else if (this.type == 6) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + 2 * lh, y + this.dim.h2 - lh, 2 * lh, lh);
                ctx.fillRect(x + this.addBorder + this.d.w - lh, y + this.dim.h2 - lh, 2 * lh, lh);
            }
            else if (this.type == 7) {
                ctx.fillRect(x + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + this.addBorder + this.d.w + lh, y - this.dim.h1, lh, this.dim.h1 + this.dim.h2);
                ctx.fillRect(x + 2 * lh, y - this.dim.h1, 2 * lh, lh);
                ctx.fillRect(x + this.addBorder + this.d.w - lh, y - this.dim.h1, 2 * lh, lh);
            }
            ctx.restore();
        };
        BracketTerm.prototype.toString = function () {
            return "\\bracket" + this.type + "{" + this.con + "}";
        };
        BracketTerm.prototype.toMPad = function () {
            if (this.type == 0)
                return "(" + this.con.toMPadAll() + ")";
            else if (this.type == 1)
                return "[" + this.con.toMPadAll() + "]";
            else if (this.type == 2)
                return "\\{" + this.con.toMPadAll() + "\\}";
            // hier fehlen noch die anderen Klammetypen
            return "(" + this.con.toMPadAll() + ")";
        };
        BracketTerm.prototype.containsBrackets = function () {
            return _super.prototype.containsBrackets.call(this, this.dim.h1 + this.dim.h2);
        };
        BracketTerm.borderFactor = [3, 3, 3, 3, 3, 5, 3, 3];
        return BracketTerm;
    }(fe.SingleContainerTerm));
    fe.BracketTerm = BracketTerm;
})(fe || (fe = {}));
/// <reference path="AboveTerm.ts" />
var fe;
(function (fe) {
    var FracTerm = /** @class */ (function (_super) {
        __extends(FracTerm, _super);
        function FracTerm(fp, parent) {
            return _super.call(this, fp, parent) || this;
        }
        FracTerm.prototype.paint = function (g, x, y) {
            _super.prototype.paint.call(this, g, x, y);
            var m = this.fp.getMiddleDelta(this.iFontSize);
            var lh = this.fp.getLineThickness(this.iFontSize);
            var ctx = g.getContext("2d");
            ctx.fillRect(x + lh, y - m - lh / 2, this.dim.w - 2 * lh, lh);
        };
        FracTerm.prototype.toString = function () {
            return "\frac{" + this.con1 + "}{" + this.con2 + "}";
        };
        FracTerm.prototype.toMPad = function () {
            return "{" + this.con1.toMPadAll() + "}/{" + this.con2.toMPadAll() + "}";
        };
        return FracTerm;
    }(fe.AboveTerm));
    fe.FracTerm = FracTerm;
})(fe || (fe = {}));
/// <reference path="SingleContainerTerm.ts" />
var fe;
(function (fe) {
    var IndexTerm = /** @class */ (function (_super) {
        __extends(IndexTerm, _super);
        function IndexTerm(fp, parent) {
            return _super.call(this, fp, parent) || this;
        }
        IndexTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize + 1, this.d, g);
            var m = this.prev.getLowestMiddle();
            var lh = 1; // fp.getLineThickness(iFontSize);
            this.dx = 0;
            this.dy = this.d.h1 - m + lh;
            this.dim.w = this.d.w;
            this.dim.h1 = -this.dy + this.d.h1;
            this.dim.h2 = this.dy + this.d.h2;
        };
        IndexTerm.prototype.getCursorDim = function () {
            var dc = this.fp.getFontDim(0, this.iFontSize);
            dc.w = this.dim.w;
            return dc;
        };
        IndexTerm.prototype.toString = function () {
            return "_{" + this.con + "}";
        };
        IndexTerm.prototype.toMPad = function () {
            return "_{" + this.con.toMPadAll() + "}";
        };
        return IndexTerm;
    }(fe.SingleContainerTerm));
    fe.IndexTerm = IndexTerm;
})(fe || (fe = {}));
/// <reference path="Term.ts" />
/// <reference path="EmptyTerm.ts" />
var fe;
(function (fe) {
    /**
    * Term whith 3 subterms
    *
    * @author krausze
    *
    */
    var MultiContainerTerm = /** @class */ (function (_super) {
        __extends(MultiContainerTerm, _super);
        function MultiContainerTerm(fp, parent, nTerm, mainTermNr) {
            var _this = _super.call(this, fp, parent) || this;
            _this.nTerm = nTerm;
            _this.mainTermNr = mainTermNr;
            _this.con = [];
            _this.d = [];
            _this.dx = [];
            _this.dy = [];
            for (var i = 0; i < _this.nTerm; i++) {
                _this.con[i] = new fe.EmptyTerm(fp, _this);
                _this.d[i] = new fe.Dim();
            }
            return _this;
        }
        // conTermbelegung
        MultiContainerTerm.prototype.getNCon = function () {
            return this.nTerm;
        };
        // Umrechnung, so dass Term 0 immer der mainTerm ist
        MultiContainerTerm.prototype.setCon = function (t, iCon) {
            var nr = iCon;
            if (iCon == 0)
                nr = this.mainTermNr;
            else if (iCon <= this.mainTermNr)
                nr--;
            if (nr < this.nTerm) {
                this.con[nr] = t;
                this.con[nr].setParentAll(this);
            }
        };
        MultiContainerTerm.prototype.getCon = function (iCon) {
            var nr = iCon;
            if (iCon == 0)
                nr = this.mainTermNr;
            else if (iCon <= this.mainTermNr)
                nr--;
            return (nr < this.nTerm) ? this.con[iCon] : null;
        };
        MultiContainerTerm.prototype.getBehavior = function () {
            return fe.Term.ENTER_UPDOWN;
        };
        MultiContainerTerm.prototype.getLowestMiddle = function () {
            var m = this.con[0].getLowestMiddleAll() - this.dy[0];
            for (var i = 1; i < this.nTerm; i++) {
                var m1 = this.con[i].getLowestMiddleAll() - this.dy[i];
                if (m1 > m)
                    m = m1;
            }
            return m;
        };
        MultiContainerTerm.prototype.getHighestMiddle = function () {
            var m = this.con[0].getHighestMiddleAll() - this.dy[0];
            for (var i = 1; i < this.nTerm; i++) {
                var m1 = this.con[i].getHighestMiddleAll() - this.dy[i];
                if (m1 < m)
                    m = m1;
            }
            return m;
        };
        MultiContainerTerm.prototype.getTermNr = function (child) {
            for (var i = 0; i < this.nTerm; i++)
                if (this.con[i] == child)
                    return i;
            return -1;
        };
        MultiContainerTerm.prototype.paint = function (g, x, y) {
            for (var i = 0; i < this.nTerm; i++)
                this.con[i].paintAll(g, x + this.dx[i], y + this.dy[i]);
        };
        MultiContainerTerm.prototype.left = function (marking) {
            return marking ? this.prev : this.con[this.mainTermNr].last().cursorByLeft(marking);
        };
        MultiContainerTerm.prototype.cursorByLeft = function (marking) {
            return this;
        };
        MultiContainerTerm.prototype.cursorByRight = function (marking) {
            return marking ? this : this.con[this.mainTermNr].cursorByRight(marking);
        };
        MultiContainerTerm.prototype.cursorByLeftFromChild = function (child, marking) {
            return this.prev;
        };
        MultiContainerTerm.prototype.down = function (marking, markBegin) {
            return marking ? this : this.con[this.nTerm - 1].last().cursorByLeft(marking);
        };
        MultiContainerTerm.prototype.up = function (marking, markBegin) {
            return marking ? this : this.con[0].last().cursorByLeft(marking);
        };
        MultiContainerTerm.prototype.cursorByDown = function (marking, x) {
            return this.con[0].cursorByDown(marking, x);
        };
        MultiContainerTerm.prototype.cursorByUp = function (marking, x) {
            return this.con[this.nTerm - 1].cursorByUp(marking, x);
        };
        MultiContainerTerm.prototype.cursorByDownFromChild = function (child, marking, x) {
            if (child.first() != this.con[this.nTerm - 1])
                // Child
                return marking ? this : this.con[this.getTermNr(child.first()) + 1].cursorByDown(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByDownFromChild(this, marking, x);
            else
                return null;
        };
        MultiContainerTerm.prototype.cursorByUpFromChild = function (child, marking, x) {
            if (child.first() != this.con[0])
                return marking ? this : this.con[this.getTermNr(child.first()) - 1].cursorByUp(marking, x);
            else if (this.parent != null)
                return this.parent.cursorByUpFromChild(this, marking, x);
            else
                return null;
        };
        MultiContainerTerm.prototype.cursorEnterUp = function () {
            return this.con[0];
        };
        MultiContainerTerm.prototype.cursorEnterDown = function () {
            return this.con[this.nTerm - 1];
        };
        // Mauspositionierung
        MultiContainerTerm.prototype.fromXY = function (x, y) {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            // oben oder unten
            for (var i = 0; i < this.nTerm; i++)
                if (this.d[i].isIn(x - this.x - this.dx[i], y - this.y - this.dy[i]))
                    return this.con[i].fromXY(x, y);
            return this.con[this.mainTermNr];
        };
        MultiContainerTerm.prototype.toString = function () {
            var s = "";
            for (var i = 0; i < this.nTerm; i++)
                s += "{" + this.getCon(i).toString() + "}";
            return s;
        };
        return MultiContainerTerm;
    }(fe.Term));
    fe.MultiContainerTerm = MultiContainerTerm;
})(fe || (fe = {}));
/// <reference path="DoubleContainerTerm.ts" />
var fe;
(function (fe) {
    var OverTerm = /** @class */ (function (_super) {
        __extends(OverTerm, _super);
        function OverTerm(fp, parent) {
            return _super.call(this, fp, parent, false) || this;
        }
        OverTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            var lh = this.fp.getLineThickness(iFontSize);
            // gesamt
            this.dim.w = this.d1.w > this.d2.w ? this.d1.w : this.d2.w;
            // normal
            this.dx1 = (this.dim.w - this.d1.w) / 2;
            this.dy1 = 0;
            // oben
            this.dx2 = (this.dim.w - this.d2.w) / 2;
            this.dy2 = -this.d2.h1 - lh - this.d1.h2;
            // gesamt
            this.dim.h1 = this.d2.h1 - this.dy2;
            this.dim.h2 = this.d1.h2;
        };
        OverTerm.prototype.toString = function () {
            return "\\over{" + this.con1 + "}{" + this.con2 + "}";
        };
        OverTerm.prototype.toMPad = function () {
            return "{" + this.con1.toMPadAll() + "}\\ontop{" + this.con2.toMPadAll() + "}";
        };
        return OverTerm;
    }(fe.DoubleContainerTerm));
    fe.OverTerm = OverTerm;
})(fe || (fe = {}));
/// <reference path="MultiContainerTerm.ts" />
var fe;
(function (fe) {
    var OverUnderTerm = /** @class */ (function (_super) {
        __extends(OverUnderTerm, _super);
        function OverUnderTerm(fp, parent) {
            return _super.call(this, fp, parent, 3, 1) || this;
        }
        /*
        * (non-Javadoc)
        *
        * @see Term#calcDim(int)
        */
        OverUnderTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d[0].copy(0, 0, 0);
            this.con[0].calcDimAll(iFontSize + 1, this.d[0], g);
            this.d[1].copy(0, 0, 0);
            this.con[1].calcDimAll(iFontSize, this.d[1], g);
            this.d[2].copy(0, 0, 0);
            this.con[2].calcDimAll(iFontSize + 1, this.d[2], g);
            var lh = this.fp.getLineThickness(iFontSize);
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
        };
        /*
        * (non-Javadoc)
        *
        * @see Term#toString()
        */
        OverUnderTerm.prototype.toString = function () {
            return "\\overunder" + _super.prototype.toString.call(this);
        };
        OverUnderTerm.prototype.toMPad = function () {
            return "{" + this.con[0].toMPadAll() + "}\\ontop{" + this.con[1].toMPadAll() + "}\\below{" + this.con[2].toMPadAll() + "}";
        };
        return OverUnderTerm;
    }(fe.MultiContainerTerm));
    fe.OverUnderTerm = OverUnderTerm;
})(fe || (fe = {}));
/// <reference path="SingleContainerTerm.ts" />
var fe;
(function (fe) {
    var PowerTerm = /** @class */ (function (_super) {
        __extends(PowerTerm, _super);
        function PowerTerm(fp, parent) {
            return _super.call(this, fp, parent) || this;
        }
        PowerTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize + 1, this.d, g);
            var m = this.prev.getHighestMiddle();
            var lh = 1; // fp.getLineThickness(iFontSize);
            this.dx = 0;
            this.dy = -this.d.h2 - m - lh;
            this.dim.w = this.d.w;
            this.dim.h1 = -this.dy + this.d.h1;
            this.dim.h2 = this.dy + this.d.h2;
        };
        PowerTerm.prototype.getCursorDim = function () {
            var dc = this.fp.getFontDim(0, this.iFontSize);
            dc.w = this.dim.w;
            return dc;
        };
        PowerTerm.prototype.toString = function () {
            return "^{" + this.con + "}";
        };
        PowerTerm.prototype.toMPad = function () {
            return "^{" + this.con.toMPadAll() + "}";
        };
        return PowerTerm;
    }(fe.SingleContainerTerm));
    fe.PowerTerm = PowerTerm;
})(fe || (fe = {}));
/// <reference path="DoubleContainerTerm.ts" />
var fe;
(function (fe) {
    var PowIndTerm = /** @class */ (function (_super) {
        __extends(PowIndTerm, _super);
        function PowIndTerm(fp, parent, _left) {
            if (_left === void 0) { _left = true; }
            var _this = _super.call(this, fp, parent, true) || this;
            _this._left = false;
            _this._left = _left;
            return _this;
        }
        PowIndTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize + 1, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            // gesamt
            this.dim.w = (this.d1.w > this.d2.w ? this.d1.w : this.d2.w);
            // Power
            var m = this.prev.getHighestMiddle();
            var lh = 1; // fp.getLineThickness(iFontSize);
            this.dx1 = this._left ? this.dim.w - this.d1.w : 0;
            this.dy1 = -this.d1.h2 - m - lh;
            // Index
            m = this.prev.getLowestMiddle();
            this.dx2 = this._left ? this.dim.w - this.d2.w : 0;
            this.dy2 = this.d2.h1 - m + lh;
            // gesamt
            this.dim.h1 = -this.dy1 + this.d1.h1;
            this.dim.h2 = this.dy2 + this.d2.h2;
        };
        PowIndTerm.prototype.toString = function () {
            return "^{" + this.con1 + "}_{" + this.con2 + "}";
        };
        PowIndTerm.prototype.toMPad = function () {
            return "^{" + this.con1.toMPadAll() + "}_{" + this.con2.toMPadAll() + "}";
        };
        return PowIndTerm;
    }(fe.DoubleContainerTerm));
    fe.PowIndTerm = PowIndTerm;
})(fe || (fe = {}));
/// <reference path="DoubleContainerTerm.ts" />
var fe;
(function (fe) {
    var RootNTerm = /** @class */ (function (_super) {
        __extends(RootNTerm, _super);
        function RootNTerm(fp, parent) {
            return _super.call(this, fp, parent, false) || this;
        }
        RootNTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            var m = this.fp.getMiddleDelta(iFontSize);
            var lh = this.fp.getLineThickness(iFontSize);
            // Wert
            this.dx1 = this.d2.w + 4 * lh;
            this.dy1 = 0;
            // Radikant
            this.dx2 = lh;
            this.dy2 = -this.d2.h2 - m - lh;
            // gesamt
            this.dim.w = this.dx1 + this.d1.w + 2 * lh;
            var h11 = this.d1.h1 + 2 * lh, h12 = this.d2.h1 - this.dy2;
            this.dim.h1 = h11 > h12 ? h11 : h12;
            this.dim.h2 = this.d1.h2;
        };
        RootNTerm.prototype.paint = function (g, x, y) {
            _super.prototype.paint.call(this, g, x, y);
            var lh = this.fp.getLineThickness(this.iFontSize);
            var m = this.fp.getMiddleDelta(this.iFontSize) + lh / 2;
            var ctx = g.getContext("2d");
            ctx.fillRect(x + lh, y - m, this.d2.w, lh);
            ctx.beginPath();
            ctx.moveTo(x + lh + this.d2.w, y - m);
            ctx.lineTo(x + 2 * lh + this.d2.w, y + this.d1.h2);
            //ctx.stroke();
            ctx.moveTo(x + 2 * lh + this.d2.w, y + this.d1.h2);
            ctx.lineTo(x + this.dx1, y - this.d1.h1 - lh);
            ctx.stroke();
            ctx.fillRect(x + this.dx1, y - this.d1.h1 - 2 * lh, 2 * lh + this.d1.w - 1, lh);
        };
        // Mauspositionierung
        RootNTerm.prototype.fromXY = function (x, y) {
            if (x > this.x + this.dim.w && this.next != null)
                return this.next.fromXY(x, y);
            // links, rechts
            if (x <= this.x + this.d2.w)
                return this.con2.fromXY(x, y);
            return this.con1.fromXY(x, y);
        };
        RootNTerm.prototype.toString = function () {
            return "\rootn{" + this.con1 + "}{" + this.con2 + "}";
        };
        RootNTerm.prototype.toMPad = function () {
            return "{" + this.con2.toMPadAll() + "}\\nroot{" + this.con1.toMPadAll() + "}";
        };
        return RootNTerm;
    }(fe.DoubleContainerTerm));
    fe.RootNTerm = RootNTerm;
})(fe || (fe = {}));
/// <reference path="SingleContainerTerm.ts" />
var fe;
(function (fe) {
    var RootTerm = /** @class */ (function (_super) {
        __extends(RootTerm, _super);
        function RootTerm(fp, parent) {
            return _super.call(this, fp, parent) || this;
        }
        RootTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d.copy(0, 0, 0);
            this.con.calcDimAll(iFontSize, this.d, g);
            var lh = this.fp.getLineThickness(iFontSize);
            this.dx = 5 * lh;
            this.dy = 0;
            this.dim.w = 6 * lh + this.d.w;
            this.dim.h1 = this.d.h1 + 2 * lh;
            this.dim.h2 = this.d.h2;
        };
        RootTerm.prototype.paint = function (g, x, y) {
            this.con.paintAll(g, x + this.dx, y + this.dy);
            var lh = this.fp.getLineThickness(this.iFontSize);
            var m = this.fp.getMiddleDelta(this.iFontSize) + lh / 2;
            var ctx = g.getContext("2d");
            ctx.fillRect(x + lh, y - m, lh, lh);
            ctx.beginPath();
            ctx.moveTo(x + 2 * lh, y - m);
            ctx.lineTo(x + 3 * lh, y + this.d.h2);
            //ctx.stroke();
            ctx.moveTo(x + 3 * lh, y + this.d.h2);
            ctx.lineTo(x + 4 * lh, y - this.d.h1 - lh);
            ctx.stroke();
            ctx.fillRect(x + 4 * lh, y - this.d.h1 - 2 * lh, 2 * lh + this.d.w - 1, lh);
        };
        RootTerm.prototype.toString = function () {
            return "\root2{" + this.con + "}";
        };
        RootTerm.prototype.toMPad = function () {
            return "\\root{" + this.con.toMPadAll() + "}";
        };
        return RootTerm;
    }(fe.SingleContainerTerm));
    fe.RootTerm = RootTerm;
})(fe || (fe = {}));
/// <reference path="Term.ts" />
var fe;
(function (fe) {
    var SimpleTerm = /** @class */ (function (_super) {
        __extends(SimpleTerm, _super);
        function SimpleTerm(fp, parent, s, iFontIndex) {
            var _this = _super.call(this, fp, parent) || this;
            _this.s = s;
            _this.iFontIndex = iFontIndex;
            return _this;
        }
        SimpleTerm.prototype.calcDim = function (iFontSize, g) {
            var ctx = g.getContext("2d");
            ctx.font = this.fp.getFont(this.iFontIndex, this.iFontSize);
            var tm = ctx.measureText(this.s);
            var fm = this.fp.getFontMetrics(this.iFontIndex, this.iFontSize);
            this.dim.h1 = fe.Term.correctAscent(fm.getAscent());
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
        };
        SimpleTerm.prototype.paint = function (g, x, y) {
            var ctx = g.getContext("2d");
            ctx.save();
            ctx.font = this.fp.getFont(this.iFontIndex, this.iFontSize); //"30px Arial";
            ctx.fillText(this.s, x, y);
            ctx.restore();
        };
        SimpleTerm.prototype.toString = function () {
            return this.s;
        };
        SimpleTerm.prototype.toMPad = function () {
            return this.s; // s.equals("\\") ? "\\\\" : s;
        };
        return SimpleTerm;
    }(fe.Term));
    fe.SimpleTerm = SimpleTerm;
})(fe || (fe = {}));
/// <reference path="Term.ts" />
var fe;
(function (fe) {
    var TermChainer = /** @class */ (function () {
        function TermChainer(term, next) {
            this.next = next;
            this.prev = null;
            if (next != null)
                next.prev = this;
            this.term = term;
        }
        TermChainer.MakeTermChainer = function (t) {
            var tc = new TermChainer(t, null);
            while (tc.term.parent != null)
                tc = new TermChainer(tc.term.parent, tc);
            return tc;
        };
        return TermChainer;
    }());
    fe.TermChainer = TermChainer;
})(fe || (fe = {}));
var fe;
(function (fe) {
    var StrPtr = /** @class */ (function () {
        function StrPtr(s) {
            this.s = s;
            this.i = 0;
        }
        StrPtr.prototype.back = function () {
            if (this.i > 0)
                this.i--;
        };
        StrPtr.prototype.eof = function () {
            return this.i >= this.s.length;
        };
        StrPtr.prototype.nextChar = function () {
            return this.eof() ? null : this.s.charAt(this.i++);
        };
        StrPtr.prototype.nextCharCode = function () {
            return this.eof() ? null : this.s.charCodeAt(this.i++);
        };
        StrPtr.prototype.checkNextChar = function () {
            return this.eof() ? null : this.s.charAt(this.i);
        };
        StrPtr.prototype.check = function (sCheck) {
            return this.s.indexOf(sCheck, this.i) == this.i;
        };
        StrPtr.prototype.skip = function (n) {
            this.i += n;
            if (this.i > this.s.length)
                this.i = this.s.length;
        };
        return StrPtr;
    }());
    fe.StrPtr = StrPtr;
})(fe || (fe = {}));
/// <reference path="../Utils/Dim.ts" />
/// <reference path="../Utils/StrPtr.ts" />
/// <reference path="Term.ts" />
/// <reference path="SimpleTerm.ts" />
/// <reference path="EmptyTerm.ts" />
/// <reference path="RootTerm.ts" />
/// <reference path="IndexTerm.ts" />
var fe;
(function (fe) {
    var TermFactory = /** @class */ (function () {
        function TermFactory() {
        }
        /**
         * @param name
         * @param fp
         * @param parent
         * @return
         */
        TermFactory.createTerm = function (name, fp, parent) {
            if (name == "frac")
                return new fe.FracTerm(fp, parent);
            if (name == "above")
                return new fe.AboveTerm(fp, parent);
            else if (name == "root")
                return new fe.RootTerm(fp, parent);
            else if (name == "rootn")
                return new fe.RootNTerm(fp, parent);
            else if (name.substr(0, 7) == "bracket")
                return new fe.BracketTerm(fp, parent, parseInt(name.substr(7)));
            else if (name == "index")
                return new fe.IndexTerm(fp, parent);
            else if (name == "power")
                return new fe.PowerTerm(fp, parent);
            else if (name == "powind")
                return new fe.PowIndTerm(fp, parent, false);
            else if (name == "lindex")
                return new fe.IndexTerm(fp, parent);
            else if (name == "lpower")
                return new fe.PowerTerm(fp, parent);
            else if (name == "lpowind")
                return new fe.PowIndTerm(fp, parent, true);
            else if (name == "under")
                return new fe.UnderTerm(fp, parent);
            else if (name == "over")
                return new fe.OverTerm(fp, parent);
            else if (name == "overunder")
                return new fe.OverUnderTerm(fp, parent);
            else
                return null;
        };
        /**
         * @param s
         * @param fp
         * @param insert
         *            term chain to insert for '#' (without leading EmptyTerm) to
         *            insert, can be null
         * @return
         */
        TermFactory.readStringS1 = function (s, fp, insert) {
            return TermFactory.readString(new fe.StrPtr(s), fp, null, true, insert);
        };
        TermFactory.readStringS2 = function (s, fp, parent, insert) {
            return TermFactory.readString(new fe.StrPtr(s), fp, parent, true, insert);
        };
        TermFactory.readString = function (sp, fp, parent, chain, insert) {
            var base = new fe.EmptyTerm(fp, parent);
            var t = base;
            var sct;
            var dct;
            var curFontIndex = 0;
            while (!sp.eof()) {
                if (sp.check("FONT")) {
                    sp.skip(4);
                    curFontIndex = sp.nextCharCode() - '0'.charCodeAt(0);
                    continue;
                }
                var c = sp.nextChar();
                if (c == '}')
                    return base;
                else if (c == '#') {
                    if (insert != null) {
                        insert.setParentAll(parent);
                        t.insertChainAsNext(insert);
                        t = t.next;
                    }
                }
                else if (c == '_') {
                    var con = TermFactory.readStringPara(sp, fp, null, insert);
                    if (sp.checkNextChar() == '^') {
                        t.insertAsNext(dct = new fe.PowIndTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        dct.con2 = con;
                        sp.nextChar();
                        dct.con1 = TermFactory.readStringPara(sp, fp, dct, insert);
                    }
                    else {
                        t.insertAsNext(sct = new fe.IndexTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        sct.con = con;
                    }
                }
                else if (c == '^') {
                    var con = TermFactory.readStringPara(sp, fp, null, insert);
                    if (sp.checkNextChar() == '_') {
                        t.insertAsNext(dct = new fe.PowIndTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        dct.con1 = con;
                        sp.nextChar();
                        dct.con2 = TermFactory.readStringPara(sp, fp, dct, insert);
                    }
                    else {
                        t.insertAsNext(sct = new fe.PowerTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        sct.con = con;
                    }
                }
                else if (c != '\\') {
                    t.insertAsNext(new fe.SimpleTerm(fp, parent, "" + c, curFontIndex));
                    t = t.next;
                }
                else if (sp.checkNextChar() == '\\') {
                    t.insertAsNext(new fe.SimpleTerm(fp, parent, "\\", curFontIndex));
                    t = t.next;
                    sp.nextChar();
                }
                else {
                    // Termnamen lesen
                    var sbName = "";
                    while (!sp.eof()) {
                        c = sp.nextChar();
                        if (c == ';')
                            break;
                        if (c == '{' || c == '\\' || c == '#') {
                            sp.back();
                            break;
                        }
                        sbName += c;
                    }
                    // Terme auswerten, dabei evtl. Parameter lesen
                    var t1 = TermFactory.createTerm(sbName, fp, parent);
                    if (t1 != null) {
                        t.insertAsNext(t1);
                        t = t.next;
                        for (var i = 0; i < t.getNCon(); i++)
                            t.setCon(TermFactory.readStringPara(sp, fp, t, insert), i);
                    }
                }
                curFontIndex = 0;
                if (!chain)
                    break;
            }
            return base;
        };
        /*
         * static Term readSingleContainerTerm(StrPtr sp, Term chain,
         * SingleContainerTerm sct) { chain.insertAsNext(sct); sct.con =
         * Term.readStringPara(sp, chain.fp, sct); return chain.next; }
         *
         * static Term readDoubleContainerTerm(StrPtr sp, Term chain,
         * DoubleContainerTerm dct) { chain.insertAsNext(dct); dct.con1 =
         * Term.readStringPara(sp, chain.fp, dct); dct.con2 =
         * Term.readStringPara(sp, chain.fp, dct); return chain.next; }
         */
        TermFactory.readStringPara = function (sp, fp, parent, insert) {
            if (sp.eof())
                return new fe.EmptyTerm(fp, parent);
            else if (sp.nextChar() == '{')
                return TermFactory.readString(sp, fp, parent, true, insert);
            sp.back();
            return TermFactory.readString(sp, fp, parent, false, insert);
        };
        return TermFactory;
    }());
    fe.TermFactory = TermFactory;
})(fe || (fe = {}));
/// <reference path="DoubleContainerTerm.ts" />
var fe;
(function (fe) {
    var UnderTerm = /** @class */ (function (_super) {
        __extends(UnderTerm, _super);
        function UnderTerm(fp, parent) {
            return _super.call(this, fp, parent, true) || this;
        }
        UnderTerm.prototype.calcDim = function (iFontSize, g) {
            // Dim der Teilterme
            this.d1.copy(0, 0, 0);
            this.con1.calcDimAll(iFontSize, this.d1, g);
            this.d2.copy(0, 0, 0);
            this.con2.calcDimAll(iFontSize + 1, this.d2, g);
            var lh = this.fp.getLineThickness(iFontSize);
            // gesamt
            this.dim.w = this.d1.w > this.d2.w ? this.d1.w : this.d2.w;
            // normal
            this.dx1 = (this.dim.w - this.d1.w) / 2;
            this.dy1 = 0;
            // normal
            this.dx2 = (this.dim.w - this.d2.w) / 2;
            this.dy2 = this.d1.h2 + lh + this.d2.h1;
            // gesamt
            this.dim.h1 = this.d1.h1;
            this.dim.h2 = this.d2.h2 + this.dy2;
        };
        UnderTerm.prototype.toString = function () {
            return "\\over{" + this.con1 + "}{" + this.con2 + "}";
        };
        UnderTerm.prototype.toMPad = function () {
            return "{" + this.con1.toMPadAll() + "}\\below{" + this.con2.toMPadAll() + "}";
        };
        return UnderTerm;
    }(fe.DoubleContainerTerm));
    fe.UnderTerm = UnderTerm;
})(fe || (fe = {}));
var fe;
(function (fe) {
    var ColorArea = /** @class */ (function () {
        // constructor(public c: string, public x1: number, public y1: number, public x2: number, public y2: number) {
        //     this.c = c;
        //     this.x1 = x1;
        //     this.y1 = y1;
        //     this.x2 = x2;
        //     this.y2 = y2;
        //     this.next = null;
        // }
        function ColorArea() {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
            this.x1 = -1;
            this.y1 = -1;
            this.x2 = -1;
            this.y2 = -1;
            this.c = a[0];
            this.x1 = a[1];
            this.y1 = a[2];
            this.x2 = a[3];
            this.y2 = a[4];
        }
        return ColorArea;
    }());
    fe.ColorArea = ColorArea;
})(fe || (fe = {}));
//# sourceMappingURL=fe.js.map