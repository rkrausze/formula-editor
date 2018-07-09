namespace fe {
    export interface IToolbar {
        openSubMenu(subMenu: number): void;
        choosen(actionCommand: string): void;

        setVisible(b: boolean): void;
        isVisible(): boolean;
    }
}