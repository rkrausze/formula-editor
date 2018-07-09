/// <reference path="MenuField.ts" />
namespace fe {
    export class ImageMenuField extends MenuField {

        constructor(tb: IToolbar, w: number, h: number, actionCommand: string, subMenu: number, image: string) {
            super(tb, w, h, actionCommand, subMenu);
            this.button.innerHTML = '<img src="'+image+'" valign="middle"/>';
        }
    }
}