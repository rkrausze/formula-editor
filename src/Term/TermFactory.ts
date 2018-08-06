/// <reference path="../Utils/Dim.ts" />
/// <reference path="../Utils/StrPtr.ts" />
/// <reference path="Term.ts" />
/// <reference path="SimpleTerm.ts" />
/// <reference path="EmptyTerm.ts" />
/// <reference path="RootTerm.ts" />
/// <reference path="IndexTerm.ts" />

namespace fe {
    export abstract class TermFactory {

        /**
         * @param name
         * @param fp
         * @param parent
         * @return
         */
        static createTerm(name: string, fp: IFormulaPanel, parent: Term): Term {
            if (name == "frac")
                return new FracTerm(fp, parent);
            if (name == "above")
                return new AboveTerm(fp, parent);
            else if (name == "root")
                return new RootTerm(fp, parent);
            else if (name == "rootn")
                return new RootNTerm(fp, parent);
            else if (name.substr(0, 7) == "bracket")
                return new BracketTerm(fp, parent, parseInt(name.substr(7)));
            else if (name == "index")
                return new IndexTerm(fp, parent);
            else if (name == "power")
                return new PowerTerm(fp, parent);
            else if (name == "powind")
                return new PowIndTerm(fp, parent, false);
            else if (name == "lindex")
                return new IndexTerm(fp, parent);
            else if (name == "lpower")
                return new PowerTerm(fp, parent);
            else if (name == "lpowind")
                return new PowIndTerm(fp, parent, true);
            else if (name == "under")
                return new UnderTerm(fp, parent);
            else if (name == "over")
                return new OverTerm(fp, parent);
            else if (name == "overunder")
                return new OverUnderTerm(fp, parent);
            else
                return null;
        }

        /**
         * @param s
         * @param fp
         * @param insert
         *            term chain to insert for '#' (without leading EmptyTerm) to
         *            insert, can be null
         * @return
         */
        static readStringS1(s: string, fp: IFormulaPanel, insert: Term): Term {
            return TermFactory.readString(new StrPtr(s), fp, null, true, insert);
        }

        static readStringS2(s: string, fp: IFormulaPanel, parent: Term, insert: Term): Term {
            return TermFactory.readString(new StrPtr(s), fp, parent, true, insert);
        }

        static readString(sp: StrPtr, fp: IFormulaPanel, parent: Term, chain: boolean, insert: Term): Term {
            let base: Term = new EmptyTerm(fp, parent);
            let t: Term = base;
            let sct: SingleContainerTerm;
            let dct: DoubleContainerTerm;
            let curFontIndex: number = 0;
            let cursorMark = false;
            while (!sp.eof()) {
                if (sp.check("FONT")) {
                    sp.skip(4);
                    curFontIndex = sp.nextCharCode() - '0'.charCodeAt(0);
                    continue;
                }
                if (sp.check("\\CURSOR")) {
                    sp.skip(7)
                    cursorMark = true;
                    continue;
                }
                let c: string = sp.nextChar();
                if (c == '}') // Parameterende
                    return base;
                else if (c == '#') { // insert
                    if (insert != null) {
                        insert.setParentAll(parent);
                        t.insertChainAsNext(insert);
                        t = t.next;
                    }
                } else if (c == '_') { // Index
                    let con: Term = TermFactory.readStringPara(sp, fp, null, insert);
                    if (sp.checkNextChar() == '^') { // PowInd
                        t.insertAsNext(dct = new PowIndTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        dct.con2 = con;
                        sp.nextChar();
                        dct.con1 = TermFactory.readStringPara(sp, fp, dct, insert);
                    } else { // nur Index
                        t.insertAsNext(sct = new IndexTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        sct.con = con;
                    }
                } else if (c == '^') { // Power
                    let con: Term = TermFactory.readStringPara(sp, fp, null, insert);
                    if (sp.checkNextChar() == '_') { // PowInd
                        t.insertAsNext(dct = new PowIndTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        dct.con1 = con;
                        sp.nextChar();
                        dct.con2 = TermFactory.readStringPara(sp, fp, dct, insert);
                    } else { // nur Power
                        t.insertAsNext(sct = new PowerTerm(fp, parent));
                        t = t.next;
                        con.setParentAll(t);
                        sct.con = con;
                    }
                } else if (c != '\\') { // SimpleTerm ?
                    t.insertAsNext(new SimpleTerm(fp, parent, "" + c, curFontIndex));
                    t = t.next;
                } else if (sp.checkNextChar() == '\\') { // SimpleTerm ?
                    t.insertAsNext(new SimpleTerm(fp, parent, "\\", curFontIndex));
                    t = t.next;
                    sp.nextChar();
                } else { // komplexer Term
                    // Termnamen lesen
                    let sbName: string = "";
                    while (!sp.eof()) {
                        c = sp.nextChar();
                        if (c == ';')
                            break;
                        if (c == '{' || c == '\\' || c == '#') {
                            sp.back();
                            break;
                        }
                        sbName += c;
                    }
                    // Terme auswerten, dabei evtl. Parameter lesen
                    let t1: Term = TermFactory.createTerm(sbName, fp, parent);
                    if (t1 != null) {
                        t.insertAsNext(t1);
                        t = t.next;
                        for (let i = 0; i < t.getNCon(); i++)
                            t.setCon(TermFactory.readStringPara(sp, fp, t, insert), i);
                    }
                }
                curFontIndex = 0;
                if ( cursorMark ) {
                    cursorMark = false;
                    fp.setCursor(t);
                }
                if (!chain)
                    break;
            }
            return base;
        }

        /*
         * static Term readSingleContainerTerm(StrPtr sp, Term chain,
         * SingleContainerTerm sct) { chain.insertAsNext(sct); sct.con =
         * Term.readStringPara(sp, chain.fp, sct); return chain.next; }
         *
         * static Term readDoubleContainerTerm(StrPtr sp, Term chain,
         * DoubleContainerTerm dct) { chain.insertAsNext(dct); dct.con1 =
         * Term.readStringPara(sp, chain.fp, dct); dct.con2 =
         * Term.readStringPara(sp, chain.fp, dct); return chain.next; }
         */

        static readStringPara(sp: StrPtr, fp: IFormulaPanel, parent: Term, insert: Term): Term {
            if (sp.eof())
                return new EmptyTerm(fp, parent);
            else if (sp.nextChar() == '{')
                return TermFactory.readString(sp, fp, parent, true, insert);
            sp.back();
            return TermFactory.readString(sp, fp, parent, false, insert);
        }
    }
}