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

        div: HTMLDivElement;
        menuFieldArea: HTMLDivElement;

        constructor(public fp: FormulaField, public assetPath: string, public oldStyle: boolean, para: string[] = null) {
            fp.toolbar = this;

            // insert the css-file
            var fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", assetPath+'fe.css');
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
            // addKeyListener(fp);
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
            if (this.div.parentElement == null )
                document.body.appendChild(this.div);
            this.div.style.display = b ? 'block' : 'none';
            if ( !b && this.subMenu != -1) {
                this.closeSubMenu();
            }
        };

        isVisible(): boolean {
            return this.div.parentElement != null && this.div.style.display != 'none';
        }

    //     public void windowActivated(WindowEvent e) {
    //         if (!noticesFocus) { // z.B. version 1.3.1_18
    //             fp.ensureKeyFocus = 4;
    //             fp.requestFocus();
    //             fp.hasFocus = true;
    //         } else if (oldStyle) {
    //             fp.ensureKeyFocus = 2;
    //         }
    //     }

        onMouseDown(e: MouseEvent): void {
            e.preventDefault();
            console.log("e %o", e);
            let r = this.div.getBoundingClientRect();
            this.movingDx = e.clientX-r.left;
            this.movingDy = e.clientY-r.top;
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
    }
}

