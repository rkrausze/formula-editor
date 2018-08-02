namespace fe {
    export class ElementUtils {

        static getAbsDim(el: HTMLElement) {
            let xPos = 0;
            let yPos = 0;
            let w =  el.clientWidth;
            let h =  el.clientHeight;

            while (el) {
                if (el.tagName == "BODY") {
                    xPos += (el.offsetLeft + el.clientLeft);
                    yPos += (el.offsetTop + el.clientTop);
                } else {
                // for all other non-BODY elements
/*                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                    yPos += (el.offsetTop - el.scrollTop + el.clientTop);*/
                    xPos += (el.offsetLeft + el.scrollLeft + el.clientLeft);
                    yPos += (el.offsetTop + el.scrollTop + el.clientTop);
                }

                el = <HTMLElement>(el.offsetParent);
            }
            return { x: xPos, y: yPos, w: w, h: h };
        }
    }
}

