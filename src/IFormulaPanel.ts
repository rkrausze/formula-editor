/// <reference path="Utils/FontMetrics.ts" />
namespace fe {
    export interface IFormulaPanel {
        getMiddleDelta(iFontSize: number): number;
        getLineThickness(iFontSize: number): number;
        getFont(iFontIndex: number, iFontSize: number): string; // font string for canvas.cxt
        getFontMetrics(iFontIndex: number, iFontSize: number): FontMetrics; // font string for canvas.cxt
        getFontDim(type: number, size: number): Dim;
        debug: boolean;
    }
}
