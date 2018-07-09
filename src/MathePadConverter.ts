/// <reference path="MCode.ts" />
/// <reference path="Utils/StrUtil.ts" />
namespace fe {
    export class MathePadConverter {
        oldStyle: boolean;

        constructor() {
        }

        // auszugebende "\" werden erstmal als @ dargestellt, damit einzelne "\"
        // verdoppelt werden können

        /*
        * var msTable = "<table cellpadding=0 cellspacing=0 textpadding=0 #h#>";
        *
        * var t1 = msTable + '<tr><td align=center valign=middle nowrap style="white-space:nowrap;">';
        * var t2 = '</td><td align=center valign=middle nowrap style="white-space:nowrap;">
        * &nbsp;'; var t3 = '&nbsp; </td><td align=center valign=middle nowrap style="white-space:nowrap;">';
        * var t4 = '</td></tr></table>';
        *
        * var sym = (top.document.all || top.document.layers) && !window.opera;
        *
        * var mCode = new Array(
        */
        static mCode:MCode[] = [
        // new MCode(" ", 0, ""),
                new MCode("=>", 0, "\u21D2"), new MCode("<=>", 0, "\u21D4"), new MCode(";", 0, "; "), new MCode("\\in", 0, "\u220A"), new MCode("\\notin", 0, "\u2209"), new MCode("\\subset", 2, "\u2282"), new MCode("\\subseteq", 1, "\u2286"), new MCode("\\supset", 2, "\u2283"), new MCode("\\supseteq", 1, "\u2287"), new MCode("\\notsubset", 2, "\u2284"), new MCode("\\all", 2, "\u2200"), new MCode("\\exist", 2, "\u2203"), new MCode("<=", 3, "\u2264"), new MCode(">=", 3, "\u2265"), new MCode("\\asymp", 4, "\u2248"), new MCode("\\to", 4, "\u2192"), new MCode("=", 4, " = "), new MCode("\\ne", 4, "\u2260"), new MCode("<", 4, " < "), new MCode(">", 4, " > "), new MCode("| ", 4, "| "), new MCode("|", 4, "|"), new MCode("\\over", 4, "2@above"), new MCode("\\cup", 5, "\u22C3"), new MCode("\\cap", 6, "\u22C2"), new MCode("+", 7, "+"), new MCode("-", 7, "-"), new MCode("\\pm", 7, "\u00B1"),
                // new MCode("-", 7, '-'),
                new MCode("*", 8, "\u2027"), // 2219
                new MCode(": ", 8, ": "), new MCode(":", 8, ":"), new MCode("/", 8, "2@frac"),
                // new MCode(" ", 8, ''), //msTable+"<tr><td align=center
                // valign=middle nowrap style="white-space:nowrap;">", "</td><td
                // align=center valign=middle nowrap>", "</td></tr></table>",
                // '&nbsp;'),
                new MCode("_", 9, "_"), new MCode("^", 9, "^"), new MCode("\\root", 10, "1@root"), new MCode("\\nroot", 10, "2R@rootn"), new MCode("\\per", 10, "1@overline"), new MCode("\\u", 10, "1@underline"), new MCode("\\du", 10, "1@dunderline") ];

        static mChar:string[] = [ "\\null", "\u2205", "\\sigmaf", "\u03C2", "\\thetasym", "\u03D1", "\\ypsih", "\u03D2", "\\asterisk", "\u22C6",

        "\\Alpha", "\u0391", "\\Beta", "\u0392", "\\Gamma", "\u0393", "\\Delta", "\u0394", "\\Epsilon", "\u0395", "\\Zeta", "\u0396", "\\Eta", "\u0397", "\\Theta", "\u0398", "\\Iota", "\u0399", "\\Kappa", "\u039A", "\\Lambda", "\u039B", "\\Mu", "\u039C", "\\Nu", "\u039D", "\\Xi", "\u039E", "\\Omicron", "\u039F", "\\Pi", "\u03A0", "\\Rho", "\u03A1", "\\Sigma", "\u03A3", "\\Tau", "\u03A4", "\\Upsilon", "\u03A5", "\\Phi", "\u03A6", "\\Chi", "\u03A7", "\\Psi", "\u03A8", "\\Omega", "\u03A9",

        "\\alpha", "\u03B1", "\\beta", "\u03B2", "\\gamma", "\u03B3", "\\delta", "\u03B4", "\\epsilon", "\u03B5", "\\zeta", "\u03B6", "\\eta", "\u03B7", "\\theta", "\u03B8", "\\iota", "\u03B9", "\\kappa", "\u03BA", "\\lambda", "\u03BB", "\\mu", "\u03BC", "\\nu", "\u03BD", "\\xi", "\u03BE", "\\omicron", "\u03BF", "\\pi", "\u03C0", "\\rho", "\u03C1", "\\sigma", "\u03C3", "\\tau", "\u03C4", "\\ypsilon", "\u03C5", "\\phi", "\u03C6", "\\chi", "\u03C7", "\\psi", "\u03C8", "\\omega", "\u03C9",

        "\\C", "\u2102", "\\N", "\u2115", "\\P", "\u2119", "\\Q", "\u211A", "\\R", "\u211D", "\\Z", "\u2124", "\\L", "\u2124" ];

        static Replace(s: string, find: string, replace: string): string {
            let res: string = "";
            let i = 0, j;
            while (i < s.length && (j = s.indexOf(find, i)) != -1) {
                res += s.substring(i, j);
                res += replace;
                i = j + find.length;
            }
            if (i < s.length)
                res += s.substring(i);
            return res;
        }

        static HTML2MetaHTML(s: string): string {
            let res: string = MathePadConverter.Replace(s, "&auml;", "ä");
            res = MathePadConverter.Replace(res, "&ouml;", "ö");
            res = MathePadConverter.Replace(res, "&uuml;", "ü");
            res = MathePadConverter.Replace(res, "&Auml;", "Ä");
            res = MathePadConverter.Replace(res, "&Ouml;", "Ö");
            res = MathePadConverter.Replace(res, "&Uuml;", "Ü");
            res = MathePadConverter.Replace(res, "&szlig;", "ß");
            return res;
        }

        static toFormula(s: string, oldStyle: boolean): string {
            let s1: string = MathePadConverter.Text2mh(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.Replace(MathePadConverter.HTML2MetaHTML(s), "\\upsilon", "\\ypsilon"), "\\upsih", "\\ypsih"), "\\infin", "\\irfin"), "&lt;", "<"), "&gt;", ">"), oldStyle); // 14
            for (let i = 0; i < MathePadConverter.mChar.length; i += 2)
                s1 = MathePadConverter.Replace(s1, MathePadConverter.mChar[i], MathePadConverter.mChar[i + 1]);
            s1 = MathePadConverter.Replace(s1, "\\irfin", "\u221E");
            s1 = MathePadConverter.Replace(s1, "\\", "\\\\");
            s1 = MathePadConverter.Replace(s1, "@", "\\");
            // console.log("CONV: "+s+" ===> "+s1);
            return s1;
        }

        /*
        * function SafeJoin(s1, s2, h) { var res = ""; if ( (IsClean(s1) &&
        * IsClean(s2)) || s1 == "" || s2 == "" ) res = s1+s2; else res =
        * SetH(msTable, h) + '<tr><td style="white-space:nowrap;">' + s1 + '</td><td style="white-space:nowrap;">' +
        * s2 + "</td></tr></table>"; return res; }
        *
        * function SafeJoin3(s1, s2, s3, h) { var res = ""; if ( IsClean(s1) &&
        * IsClean(s2) && IsClean(s3) ) res = s1+s2+s3; else res = SetH(msTable, h) + '<tr><td style="white-space:nowrap;">' +
        * s1 + '</td><td style="white-space:nowrap;">' + s2 + '</td><td style="white-space:nowrap;">' +
        * s3 + "</td></tr></table>"; return res; }
        */

        static GetIndExp(s: string, i1: number, i2: number): number {
            let i = i1;
            if (i2 == 99999)
                i2 = s.length;
            if (i1 >= i2)
                return i;
            let nBracket = 0;
            let nEBracket = 0;
            let nCollect = 0;
            let nVCollect = 0;
            do {
                let ch: string = s.charAt(i);
                if (ch == '(')
                    nBracket++;
                else if (ch == ')') {
                    if (nBracket > 0)
                        nBracket--;
                } else if (ch == '[')
                    nEBracket++;
                else if (ch == ']') {
                    if (nEBracket > 0)
                        nEBracket--;
                } else if (ch == '\\' && i > 0 && s.charAt(i + 1) == '{') {
                    nVCollect++;
                    i++;
                } else if (ch == '\\' && i > 0 && s.charAt(i - 1) == '}') {
                    if (nVCollect > 0)
                        nVCollect--;
                    i++;
                } else if (ch == '{')
                    nCollect++;
                else if (ch == '}') {
                    if (nCollect > 0)
                        nCollect--;
                }
                i++;
            } while (i < i2 && (nBracket != 0 || nEBracket != 0 || nCollect != 0 || nVCollect != 0));
            return i;
        }

        static Text2mh(sVal: string, oldStyle: boolean): string {
            let sOut: string = "";
            let s: string = sVal;
            while (s.length > 0 && s.charAt(0) == ' ')
                s = s.substring(1);
            while (s.length > 0 && s.charAt(s.length - 1) == ' ')
                s = s.substring(0, s.length - 1);
            if (s == "")
                return sOut;
            let i = s.length - 1;
            let iSp = i;
            let typeSp = -1;
            let prioritySp = 100;
            let nBracket = 0;
            let nEBracket = 0;
            let nCollect = 0;
            let nVCollect = 0;
            let aBracket = 99999;
            let eBracket = 99999;
            let aEBracket = 99999;
            let eEBracket = 99999;
            let aCollect = 99999;
            let eCollect = 99999;
            let aVCollect = 99999;
            let eVCollect = 99999;
            let iExp = 99999;
            let iInd = 99999;
            // Splitpunkt Sp finden (Achtung: rückwäts)
            while (i >= 0) {
                let ch: string = s.charAt(i);
                if (ch == ')') {
                    nBracket++;
                    if (eBracket == 99999)
                        eBracket = i;
                } else if (ch == '(') {
                    if (nBracket > 0)
                        nBracket--;
                    if (aBracket == 99999 && nBracket == 0)
                        aBracket = i;
                } else if (ch == ']') {
                    nEBracket++;
                    if (eEBracket == 99999)
                        eEBracket = i;
                } else if (ch == '[') {
                    if (nEBracket > 0)
                        nEBracket--;
                    if (aEBracket == 99999 && nEBracket == 0)
                        aEBracket = i;
                } else if (ch == '}' && i > 0 && s.charAt(i - 1) == '\\') {
                    nVCollect++;
                    if (eVCollect == 99999)
                        eVCollect = i;
                } else if (ch == '{' && i > 0 && s.charAt(i - 1) == '\\') {
                    if (nVCollect > 0)
                        nVCollect--;
                    if (aVCollect == 99999 && nVCollect == 0)
                        aVCollect = i;
                } else if (ch == '}') {
                    nCollect++;
                    if (eCollect == 99999)
                        eCollect = i;
                } else if (ch == '{') {
                    if (nCollect > 0)
                        nCollect--;
                    if (aCollect == 99999 && nCollect == 0)
                        aCollect = i;
                } else if (nBracket == 0 && nCollect == 0 && nEBracket == 0 && nVCollect == 0) {
                    for (let j = 0; j < MathePadConverter.mCode.length; j++)
                        if (StrUtil.startsWith(s, MathePadConverter.mCode[j].name, i)) {
                            if (MathePadConverter.mCode[j].priority < prioritySp) {
                                prioritySp = MathePadConverter.mCode[j].priority;
                                iSp = i;
                                typeSp = j;
                            }
                        }
                    // <=> vs. => Problem
                    if (typeSp == 1 && iSp > 0 && s.charAt(iSp - 1) == '<') {
                        iSp--;
                        typeSp++;
                    }
                    if (ch == '^' && iExp == 99999)
                        iExp = i;
                    if (ch == '_' && iInd == 99999)
                        iInd = i;
                }
                i--;
            }

            if (prioritySp != 100 && prioritySp != 9) {
                let sPre: string = MathePadConverter.Text2mh(s.substring(0, iSp), oldStyle);
                let sPost: string = MathePadConverter.Text2mh(s.substring(iSp + MathePadConverter.mCode[typeSp].name.length), oldStyle);
                let tr: string = MathePadConverter.mCode[typeSp].getTrans(oldStyle);
                if (StrUtil.startsWith(tr, "2R"))
                    sOut = tr.substring(2) + "{" + sPost + "}{" + sPre + "}";
                else if (StrUtil.startsWith(tr, "2"))
                    sOut = tr.substring(1) + "{" + sPre + "}{" + sPost + "}";
                else if (StrUtil.startsWith(tr, "1"))
                    sOut = sPre + tr.substring(1) + "{" + sPost + "}";
                else
                    sOut = sPre + tr + sPost;
            } else if (prioritySp == 9) {
                // Teile ermitteln
                let ifirst: number = (iExp < iInd) ? iExp : iInd, iIndE, iExpE;
                let s1: string = MathePadConverter.Text2mh(s.substring(0, ifirst), oldStyle);
                let sInd = "";
                let sExp = "";
                let s1Ind = "";
                let s1Exp = "";
                if (iInd != 99999) {
                    iIndE = MathePadConverter.GetIndExp(s, iInd + 1, iExp < iInd ? 99999 : iExp);
                    if (iIndE == iExp || iIndE == s.length)
                        sInd = s.substring(iInd + 1, iIndE);
                    else {
                        return MathePadConverter.Text2mh(s.substring(0, iIndE), oldStyle) + MathePadConverter.Text2mh(s.substring(iIndE), oldStyle);
                    }
                    s1Ind = MathePadConverter.Text2mh(sInd, oldStyle);
                }
                if (iExp != 99999) {
                    iExpE = MathePadConverter.GetIndExp(s, iExp + 1, iInd < iExp ? 99999 : iInd);
                    if (iExpE == iInd || iExpE == s.length)
                        sExp = s.substring(iExp + 1, iExpE);
                    else {
                        return MathePadConverter.Text2mh(s.substring(0, iExpE), oldStyle) + MathePadConverter.Text2mh(s.substring(iExpE), oldStyle);
                    }
                    s1Exp = MathePadConverter.Text2mh(sExp, oldStyle);
                }
                // schreiben
                if (sInd == "")
                    sOut = s1 + "^{" + MathePadConverter.Text2mh(sExp, oldStyle) + "}";
                else if (sExp == "")
                    sOut = s1 + "_{" + MathePadConverter.Text2mh(sInd, oldStyle) + "}";
                else
                    sOut = s1 + "@powind{" + s1Exp + "}{" + s1Ind + "}";
            } else {
                let MaxeBracket = -1;
                if (aBracket != 99999 && eBracket != 9999 && eBracket > MaxeBracket)
                    MaxeBracket = eBracket;
                if (aCollect != 99999 && eCollect != 9999 && eCollect > MaxeBracket)
                    MaxeBracket = eCollect;
                if (aEBracket != 99999 && eEBracket != 9999 && eEBracket > MaxeBracket)
                    MaxeBracket = eEBracket;
                if (aVCollect != 99999 && eVCollect != 9999 && eVCollect > MaxeBracket)
                    MaxeBracket = eVCollect;
                if (eBracket < MaxeBracket)
                    eBracket = 99999;
                if (eCollect < MaxeBracket)
                    eCollect = 99999;
                if (eEBracket < MaxeBracket)
                    eEBracket = 99999;
                if (eVCollect < MaxeBracket)
                    eVCollect = 99999;
                if (aBracket != 99999 && eBracket != 99999)
                    sOut = MathePadConverter.DoBracket(s, aBracket, eBracket, 0, 0, oldStyle);// "(",
                // ")");
                else if (aEBracket != 99999 && eEBracket != 99999)
                    sOut = MathePadConverter.DoBracket(s, aEBracket, eEBracket, 0, 1, oldStyle);// "[",
                // "]");
                else if (aVCollect != 99999 && eVCollect != 99999)
                    sOut = MathePadConverter.DoBracket(s, aVCollect, eVCollect, 1, 2, oldStyle);// "{",
                // "}");
                else if (aCollect != 99999 && eCollect != 99999) {
                    let sPre: string = MathePadConverter.Text2mh(s.substring(0, aCollect), oldStyle);
                    if (eCollect < aCollect) {
                        return sPre + "{" + MathePadConverter.Text2mh(s.substring(aCollect + 1), oldStyle);
                    }
                    let sMid: string = MathePadConverter.Text2mh(s.substring(aCollect + 1, eCollect), oldStyle);
                    let sPost: string = MathePadConverter.Text2mh(s.substring(eCollect + 1), oldStyle);
                    sOut = sPre + sMid + sPost;
                } else {
                    sOut = s;
                }
            }
            return sOut;
        }

        static DoBracket(s: string, a: number, e: number, addChar: number, type: number, oldStyle: boolean): string {
            let sPre: string = MathePadConverter.Text2mh(s.substring(0, a - addChar), oldStyle);
            if (e < a)
                return sPre + "@bracket" + type + "{" + MathePadConverter.Text2mh(s.substring(a + 1), oldStyle) + "}";
            let sMid: string = MathePadConverter.Text2mh(s.substring(a + 1, e - addChar), oldStyle);
            let sPost: string = MathePadConverter.Text2mh(s.substring(e + 1), oldStyle);
            return sPre + "@bracket" + type + "{" + sMid + "}" + sPost;
        }

    }
}