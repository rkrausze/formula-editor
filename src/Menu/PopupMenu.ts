/// <reference path="MenuField.ts" />
namespace fe {
    export class PopupMenu {
        public static border = 1;

        div: HTMLDivElement;

        constructor(public tb: IToolbar, public width: number, oldStyle: boolean = false) {
            //setBackground(SystemColor.control);
            this.div = document.createElement('div');
            this.div.classList.add('fe-toolbar-popup');
            this.div.style.width = width+"px";
        }

        setVisible(b: boolean, buttonPos?: DOMRect | ClientRect) {
            // console.log("sho %o", buttonPos);
            if (this.div.parentElement == null )
                document.body.appendChild(this.div);
            this.div.style.display = b ? 'block' : 'none';
            if ( buttonPos != undefined )
                this.setPosition(buttonPos);
        }

        setPosition(buttonPos: DOMRect | ClientRect) {
            this.div.style.top = (buttonPos.top + buttonPos.height + (document.body.scrollTop || document.documentElement.scrollTop))+"px";
            this.div.style.left = (buttonPos.left + (document.body.scrollLeft || document.documentElement.scrollLeft))+"px";
        }

        add(menu: MenuField): any {
            this.div.appendChild(menu.button);
        }

    }
}