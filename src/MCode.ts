namespace fe {
    export class MCode {
        name: string;

        priority: number;

        private trans: string;

        private symbol: string; // noch mal mit Symbol-Font, wenn "" dann nix

        constructor(name: string, priority: number, trans: string, symbol: string = "") {
            this.name = name;
            this.priority = priority;
            this.trans = trans;
            this.symbol = symbol;
        }

        getTrans(oldStyle: boolean): string {
            return oldStyle && this.symbol != "" ? ("FONT1" + this.symbol) : this.trans;

        }
    }
}