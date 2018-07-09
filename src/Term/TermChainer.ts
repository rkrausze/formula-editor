/// <reference path="Term.ts" />
namespace fe {
    export class TermChainer {
        prev: TermChainer;
        next: TermChainer;

        term: Term;

        constructor(term: Term, next: TermChainer) {
            this.next = next;
            this.prev = null;
            if (next != null)
                next.prev = this;
            this.term = term;
        }

        static MakeTermChainer(t: Term): TermChainer {
            let tc: TermChainer = new TermChainer(t, null);
            while (tc.term.parent != null)
                tc = new TermChainer(tc.term.parent, tc);
            return tc;
        }
    }
}