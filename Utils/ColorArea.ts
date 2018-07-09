namespace fe {
    export class ColorArea {
        c: string; // ... color
        x1 = -1;
        y1 = -1;
        x2 = -1;
        y2 = -1;

        // constructor(public c: string, public x1: number, public y1: number, public x2: number, public y2: number) {
        //     this.c = c;
        //     this.x1 = x1;
        //     this.y1 = y1;
        //     this.x2 = x2;
        //     this.y2 = y2;
        //     this.next = null;
        // }
        constructor(...a: any[]) {
            this.c = a[0];
            this.x1 = a[1];
            this.y1 = a[2];
            this.x2 = a[3];
            this.y2 = a[4];
        }

    }
}