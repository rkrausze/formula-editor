namespace fe {
    /**
     * @author krausze
     *
     */
    export class Dim {
        /** Ascent (baseline to top) */
        h1: number;

        /** Descent (baseline to bottom) */
        h2: number;

        /** Width */
        w: number;

        /**
         * Constructor with single initial values.
         *
         * @param h1
         *            Ascent of area
         * @param h2
         *            Descent of area
         * @param w
         *            Width of area
         */
        constructor (h1?:number, h2?:number, w?:number) {
            if ( h1 )
                this.h1 = h1;
            if ( h2 )
                this.h2 = h2;
            if ( w )
                this.w = w;
        }

        /**
         * Constructor with initial values.
         *
         * @param d
         *            Dim to copy values from
         */
        public clone():Dim {
            return new Dim(this.h1, this.h2, this.w);
        }

        /**
         * Add size of d. Areas are aligned at the same baseline besides.
         *
         * @param d
         *            Dim to add
         * @return the Dim itself
         */
        public add(d: Dim): Dim {
            this.h1 = this.h1 > d.h1 ? this.h1 : d.h1;
            this.h2 = this.h2 > d.h2 ? this.h2 : d.h2;
            this.w += d.w;
            return this;
        }

        /**
         * Copy values from another Dim.
         *
         * @param d
         *            Dim to copy from.
         * @return the Dim itself
         */
        public copyDim(d: Dim): Dim {
            this.h1 = d.h1;
            this.h2 = d.h2;
            this.w = d.w;
            return this;
        }

        /**
         * Set the values of a Dim.
         *
         * @param h1
         *            Ascent of the area.
         * @param h2
         *            Descent of the area.
         * @param w
         *            Width of the area.
         * @return the Dim itself
         */
        public copy(h1: number, h2: number, w: number): Dim {
            this.h1 = h1;
            this.h2 = h2;
            this.w = w;
            return this;
        }

        /**
         * Checks wether the point (x,y) is in te area.
         *
         * @param x
         * @param y
         * @return true, if the point is in the area.
         */
        public isIn(x: number, y: number): boolean {
            return (-this.h1 <= y && y <= this.h2 && 0 <= x && x <= this.w);
        }

        /*
        * (non-Javadoc)
        *
        * @see java.lang.Object#toString()
        */
        public toString(): string {
            return "(" + this.h1 + ", " + this.h2 + "; " + this.w + ")";
        }
    }
}