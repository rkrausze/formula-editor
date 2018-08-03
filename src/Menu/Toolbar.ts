/// <reference path="MenuField.ts" />
/// <reference path="PopupMenu.ts" />
namespace fe {
    export class Toolbar implements IToolbar {

        nMenu = 0;

        menu: MenuField[] = [];

        popup: PopupMenu[] = [];

        lastFocusedMenuField: MenuField = null;

        subMenu = -1;

        noticesFocus = false;

        movingDx = -1;
        movingDy = -1;

        private touchId1: number= null;

        div: HTMLDivElement;
        menuFieldArea: HTMLDivElement;

        constructor(public fp: FormulaField, public assetPath: string, public oldStyle: boolean, para: string[] = null, title = "Tools") {
            fp.toolbar = this;

            // insert the css-file
            if ( !window["feCssInserted"] ) {
                var fileref=document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", assetPath+'fe.css');
                document.getElementsByTagName("head")[0].appendChild(fileref);
                window["feCssInserted"] = true; // mark to avoid multiple insertions when using multiple fe's
            }
            this.div = document.createElement('div');
            this.div.classList.add('fe-toolbar');
            this.div.innerHTML = '<div class="fe-title">' + title + '</div>';
            this.menuFieldArea = document.createElement('div');
            this.div.appendChild(this.menuFieldArea);
            if (para == null || para.length == 0 ) {
                para = ["standard"];
            }
            for (let i = 0; i < para.length; i++) {
                if (para[i] == "frac" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new ImageMenuField(this, 36, 24, "", this.nMenu, assetPath+"fracroot.gif"));
                    let p: PopupMenu = this.popup[this.nMenu++] = this.newPopup(68);
                    p.add(new ImageMenuField(this, 30, 20, "new \\frac#", -1, assetPath+"frac.gif"));
                    p.add(new ImageMenuField(this, 30, 20, "new \\above#", -1, assetPath+"above.gif"));
                    p.add(new ImageMenuField(this, 30, 20, "new \\root#", -1, assetPath+"root2.gif"));
                    p.add(new ImageMenuField(this, 30, 20, "new \\rootn#", -1, assetPath+"rootn.gif"));
                }
                if (para[i] == "index" || para[i] == "standard")
                    this.addMenu("72 'powind.gif' 36 24 'ind.gif' 'new \\index#' 20 20 'pow.gif' 'new \\power#' 'powind.gif' 'new \\powind#' " + "'lind.gif' 'new \\lindex#' 'lpow.gif' 'new \\lpower#' 'lpowind.gif' 'new \\lpowind#' " + "'top.gif' 'new \\over#' 'bot.gif' 'new \\under#' 'topbot.gif' 'new \\overunder#'");
                if (para[i] == "brackets" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new ImageMenuField(this, 36, 24, "", this.nMenu, assetPath+"brackets.gif"));
                    let p: PopupMenu = this.popup[this.nMenu++] = this.newPopup(96);
                    for (let j = 0; j < 8; j++)
                        p.add(new ImageMenuField(this, 20, 20, "new \\bracket" + j + "#", -1, assetPath+"br" + j + ".gif"));
                }
                // griechisch klein
                if (para[i] == "greek" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new TextMenuField(this, 36, 24, "", this.nMenu, "\u03B1 \u03C9"));
                    let p: PopupMenu = this.popup[this.nMenu++] = this.newPopup(96);
                    for (let c = 0x03B1; c <= 0x03C9; c++)
                        p.add(new TextMenuField(this, 20, 20, "new " + String.fromCharCode(c), -1, String.fromCharCode(c)));
                    p.add(new TextMenuField(this, 20, 20, "new \u03D1", -1, "\u03D1"));
                    p.add(new TextMenuField(this, 20, 20, "new \u03D2", -1, "\u03D2"));
                    p.add(new TextMenuField(this, 20, 20, "new \u03D6", -1, "\u03D6"));
                }
                // griechisch groß
                if (para[i] == "GREEK" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new TextMenuField(this, 36, 24, "", this.nMenu, "\u0391 \u03A9"));
                    let p: PopupMenu = this.popup[this.nMenu++] = this.newPopup(96);
                    for (let c = 0x0391; c <= 0x03A9; c++)
                        if (c != 0x03A2)
                            p.add(new TextMenuField(this, 20, 20, "new " + String.fromCharCode(c), -1, String.fromCharCode(c)));
                }
                // Sonderzeichen
                if (para[i] == "special" || para[i] == "standard") {
                    this.add(this.menu[this.nMenu] = new TextMenuField(this, 36, 24, "", this.nMenu, "\u2264 \u2260"));
                    let p: PopupMenu = this.popup[this.nMenu++] = this.newPopup(120);
                    p.add(new TextMenuField(this, 20, 20, "new \u2264", -1, "\u2264"));
                    p.add(new TextMenuField(this, 20, 20, "new \u2265", -1, "\u2265"));
                    p.add(new TextMenuField(this, 20, 20, "new \u227A", -1, "\u227A"));
                    p.add(new TextMenuField(this, 20, 20, "new \u227B", -1, "\u227B"));
                    p.add(new TextMenuField(this, 20, 20, "new \u2260", -1, "\u2260"));
                    p.add(new TextMenuField(this, 20, 20, "new \u2261", -1, "\u2261"));
                    p.add(new TextMenuField(this, 20, 20, "new \u2248", -1, "\u2248"));
                    p.add(new TextMenuField(this, 20, 20, "new \u2245", -1, "\u2245"));
                    p.add(new TextMenuField(this, 20, 20, "new \u00B1", -1, "\u00B1"));
                    p.add(new TextMenuField(this, 20, 20, "new \u2213", -1, "\u2213"));
                }
                // Pfeile
                if (para[i] == "arrows" || para[i] == "standard")
                    this.addMenu("72 '\u2192\u21D4\u2193' 36 24 '\u2192' 'new \u2192' 20 20 '\u2190' 'new \u2190' '\u2194' 'new \u2194' " +
                     "'\u2191' 'new \u2191' '\u2193' 'new \u2193' '\u2195' 'new \u2195' " +
                     "'\u21D2' 'new \u21D2' '\u21D0' 'new \u21D0' '\u21D4' 'new \u21D4' " +
                     "'\u21D1' 'new \u21D1' '\u21D3' 'new \u21D3' '\u21D5' 'new \u21D5' " +
                     "'\u21A6' 'new \u21A6' '\u21B2' 'new \u21B2'");
                if (StrUtil.startsWith(para[i], "menu "))
                    this.addMenu(para[i].substring(5));
            }
            // Initialize this dialog to its preferred size.
            this.div.addEventListener("mousedown", this.onMouseDown.bind(this));
            this.div.addEventListener("mouseup", this.onMouseUp.bind(this));
            this.div.addEventListener("mousemove", this.onMouseMove.bind(this));
            this.div.addEventListener("touchstart", this.onTouchStart.bind(this));
            this.div.addEventListener("touchmove", this.onTouchMove.bind(this));
            this.div.addEventListener("touchend", this.onTouchEnd.bind(this));
        }

        newPopup(width: number): PopupMenu {
            return this.oldStyle ? new PopupMenu(this, width, true) : new PopupMenu(this, width);
        }

        add(menu: MenuField): void {
            this.menuFieldArea.appendChild(menu.button);
        }

        addMenu(s: string): void {
            let s1 = s;
            let w = 60;
            let h = 20;
            if ( /^(\d+)\s+(.*)$/.test(s1) ) {
                w = parseInt(RegExp.$1);
                s1 = RegExp.$2;
            }
            else {
                throw new Error("Can not interpret menu string '" + s1 + "'.");
            }
            let p: PopupMenu = this.newPopup(w);
            let first = true;
            // einzelne Items lesen
            while ( s1 != "" ) {
                if ( (first ? /^('[^']+'|\S+)()\s+(\d+|)\s*(\d+|)\s*(.*)$/ : /^('[^']+'|\S+)\s+('[^']+'|\S+)\s*(\d+|)\s*(\d+|)\s*(.*)$/).test(s1) ) {
                    let name = RegExp.$1;
                    let action = RegExp.$2;
                    if ( RegExp.$3 )
                        w =  parseInt(RegExp.$3);
                    if ( RegExp.$4 )
                        h =  parseInt(RegExp.$4);
                    s1 = RegExp.$5;

                    if ( name.length > 2 && name.charAt(0) == "'" && name.charAt(name.length-1) == "'")
                        name = name.substr(1, name.length-2);
                    if ( action.length > 2 && action.charAt(0) == "'" && action.charAt(action.length-1) == "'")
                        action = action.substr(1, action.length-2);
                        /*console.log("1: ", name);
                        console.log("2: ", action);
                        console.log("3: ", w);
                        console.log("4: ", h);
                        console.log("5: ", s1);*/
                    let m : MenuField;
                    if ( StrUtil.endsWith(name, ".gif"))
                        m = new ImageMenuField(this, w, h, action, -1, this.assetPath+name);
                    else if (StrUtil.startsWith(name, "fe:"))
                        m = new FormulaMenuField(this, w, h, action, -1, name.substr(3));
                    else
                        m = new TextMenuField(this, w, h, action, -1, name);
                    if (first) {
                        m.subMenu = this.nMenu;
                        this.add(this.menu[this.nMenu] = m);
                        this.popup[this.nMenu++] = p;
                        first = false;
                    } else
                        p.add(m);
                    //console.log("Menu: %o", m);
                }
                else {
                    throw new Error("Can not interpret menu string part '" + s1 + "'.");
                }
            }
            //console.log("popupMenu: %o", p);
        }

        openSubMenu(subMenu: number): void {
            console.log("openSubMenu "+subMenu);
            this.fp.requestFocus();
            let oldSubMenu = this.subMenu;
            this.closeSubMenu();
            if ( oldSubMenu == subMenu ) // pressed again, so close only
              return;
            this.menu[subMenu].active = true;
            this.menu[subMenu].button.classList.add('pressed');
            this.setVisible(true);
            this.popup[this.subMenu = subMenu].setVisible(true, this.menu[subMenu].button.getBoundingClientRect());
        }

        closeSubMenu(): void {
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
        }

        choosen(actionCommand: string): void {
            this.fp.requestFocus();
            this.closeSubMenu();
            this.lastFocusedMenuField = null;
            this.fp.exec(actionCommand);
        }

        setVisible(b: boolean) {
            if (this.div.parentElement == null ) {
                document.body.appendChild(this.div);
                let canvasDim = ElementUtils.getAbsDim(this.fp.canvas);
                let bodyDim = {w: document.body.clientWidth, h: document.body.clientHeight};
                let tbDim = {w: 280/*this.div.clientWidth*/, h: this.div.clientHeight};
                console.log("fp %o", canvasDim);
                console.log("bd %o", bodyDim);
                console.log("tb %o", tbDim);
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = document.body.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = document.body.scrollTop || document.documentElement.scrollTop;
                console.log("Scroll "+xScroll + ", " + yScroll);
                let dLeft = canvasDim.x-xScroll;
                let dRight = bodyDim.w-(canvasDim.x-xScroll+canvasDim.w)
                let x = canvasDim.x-xScroll+canvasDim.w+8;
                let y = canvasDim.y-yScroll;
                if ( dRight < tbDim.w + 8 ) {
                    if ( dLeft > dRight ) {
                        x = canvasDim.x-xScroll - tbDim.w-8;
                        if ( x < - tbDim.w - 8 ) { // left and right no place; try below
                            let dUnder = yScroll+bodyDim.h-canvasDim.y-canvasDim.h;
                            if ( dUnder > 20 ) {
                                x = canvasDim.x-xScroll + (canvasDim.w - tbDim.w)/2;
                                y = canvasDim.y-yScroll+canvasDim.h+8
                            }
                            else {
                                x = canvasDim.x-xScroll;
                            }
                        }
                    }
                    else if ( dRight < 150 ) { // try under
                        let dUnder = yScroll+bodyDim.h-canvasDim.y-canvasDim.h;
                        if ( dUnder > 20 ) {
                            x = canvasDim.x-xScroll + (canvasDim.w - tbDim.w)/2;
                            y = canvasDim.y-yScroll+canvasDim.h+8
                        }
                    }
            }
                this.div.style.left = (x+xScroll)+"px";
                this.div.style.top = (y+yScroll)+"px";
            }
            this.div.style.display = b ? 'block' : 'none';
            if ( !b && this.subMenu != -1) {
                this.closeSubMenu();
            }
        };

        isVisible(): boolean {
            return this.div.parentElement != null && this.div.style.display != 'none';
        }

        // Mouse Events

        onMouseDown(e: MouseEvent): void {
            e.preventDefault();
            console.log("e %o", e);
            let r = this.div.getBoundingClientRect();
            this.movingDx = e.clientX-r.left - (document.body.scrollLeft || document.documentElement.scrollLeft);
            this.movingDy = e.clientY-r.top - (document.body.scrollTop || document.documentElement.scrollTop);
            this.fp.requestFocus();
        }

        onMouseMove(e: MouseEvent): void {
            e.preventDefault();
            if ( this.movingDx != -1 ) {
                this.div.style.left = (- this.movingDx + e.clientX)+"px";
                this.div.style.top = (- this.movingDy + e.clientY)+"px";
                if ( this.subMenu != -1 )
                    this.popup[this.subMenu].setPosition(this.menu[this.subMenu].button.getBoundingClientRect());
            }
        }

        onMouseUp(e: MouseEvent): void {
            e.preventDefault();
            this.movingDx = -1;
        }

        // Touch Events

        onTouchStart(e: TouchEvent): void {
            let r = this.div.getBoundingClientRect();
            let p = e.changedTouches[0];
            this.movingDx = p.clientX-r.left - (document.body.scrollLeft || document.documentElement.scrollLeft);
            this.movingDy = p.clientY-r.top - (document.body.scrollTop || document.documentElement.scrollTop);
            this.fp.requestFocus();
            this.touchId1 = p.identifier;
        }

        onTouchMove(e: TouchEvent): void {
            if ( this.movingDx != -1 ) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    let p = e.changedTouches.item(i);
                    if ( p.identifier == this.touchId1 ) {
                        this.div.style.left = (- this.movingDx + p.clientX)+"px";
                        this.div.style.top = (- this.movingDy + p.clientY)+"px";
                        if ( this.subMenu != -1 )
                            this.popup[this.subMenu].setPosition(this.menu[this.subMenu].button.getBoundingClientRect());
                    }
                }
                e.preventDefault();
            }
        }

        onTouchEnd(e: TouchEvent): void {
            if ( this.touchId1 != null ) {
                for (let i = 0; i < e.touches.length; i++) {
                    let p = e.touches.item(i);
                    if ( p.identifier == this.touchId1 ) {
                        return;
                    }
                }
                this.movingDx = -1;
                this.touchId1 = null;
            }
        }

    }
}

