/// <reference path="MenuField.ts" />
namespace fe {
    export class FormulaMenuField extends MenuField {
       panel: FormulaPanel;

        constructor(tb: IToolbar, w: number, h: number, actionCommand: string, subMenu: number, sTerm: string) {
            super(tb, w, h, actionCommand, subMenu);
            this.button.innerHTML = '<canvas width="'+w+'" heiht="'+h+'"></canvas/>';
            this.panel = new FormulaPanel(this.button.getElementsByTagName('canvas')[0], sTerm, 1);
        }

    }
}