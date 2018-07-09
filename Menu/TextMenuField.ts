/// <reference path="MenuField.ts" />
namespace fe {
    export class TextMenuField extends MenuField {

        constructor(tb: IToolbar, w: number, h: number, actionCommand: string, subMenu: number, label: string) {
            super(tb, w, h, actionCommand, subMenu);
            this.button.innerHTML = label;
        }

    }
}
