/// <reference path="IToolbar.ts" />
namespace fe {
    export class MenuField {
        public static border = 1;

        dim: Dim;

        state: number; // 0 .. nix, 1 .. erhaben, 2 .. eingedrückt

        active = false;

        button: HTMLButtonElement;

        // subMenu == -1 => Item
        constructor(public tb: IToolbar, w: number, h: number, public actionCommand: string, public subMenu: number) {
            this.tb = tb;
            this.actionCommand = actionCommand;
            this.subMenu = subMenu;
            this.button = document.createElement('button');
            // this.button.style.padding = "1px";
            this.button.style.width = (w+4)+"px";
            this.button.style.height = (h+4)+"px";
            if ( subMenu && subMenu != -1 )
                this.button.id="fe_menu_"+subMenu;
            //this.button.classList.add("menutoggle");
            this.button.addEventListener('click', () => {
                if (this.subMenu != -1)
                    tb.openSubMenu(this.subMenu);
                else {
                    tb.choosen(actionCommand);
                }
            });
        }

    }
}