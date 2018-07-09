namespace fe {
    export class StrPtr {
        s: string;

        i: number;

        constructor (s: string) {
            this.s = s;
            this.i = 0;
        }

        back(): void {
            if (this.i > 0)
                this.i--;
        }

        eof(): boolean {
            return this.i >= this.s.length;
        }

        nextChar(): string {
            return this.eof() ? null : this.s.charAt(this.i++);
        }

        nextCharCode(): number {
            return this.eof() ? null : this.s.charCodeAt(this.i++);
        }

        checkNextChar(): string {
            return this.eof() ? null : this.s.charAt(this.i);
        }

        check(sCheck: string): boolean {
            return this.s.indexOf(sCheck, this.i) == this.i;
        }

        skip(n: number): void {
            this.i += n;
            if (this.i > this.s.length)
                this.i = this.s.length;
        }
    }
}
