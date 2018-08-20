/************************
 *      TUTORIAL
 ***********************/
import "./scss/interactiveTutorial.scss";
import smoothScrollTo from './smooth-scroll.js';
import ListenerTracker from './listenerTracker.js';

const requireContext = require.context("./demo/media", true, /^\.\/.*\.jpg$/);
requireContext.keys().map(requireContext);

ListenerTracker.init();
function roundNumber(num) {
    if (Math.round(num) != num) {
        if (Math.pow(0.1, 3) > num) {
            return 0;
        }
        const sign = Math.sign(num);
        const arr = ("" + Math.abs(num)).split(".");
        if (arr.length > 1) {
            if (arr[1].length > 3) {
                const integ = +arr[0] * Math.pow(10, 3);
                let dec = integ + (+arr[1].slice(0, 3) + Math.pow(10, 3));
                const proc = +arr[1].slice(3, 4)
                if (proc >= 5) {
                    dec = dec + 1;
                }
                dec = sign * (dec - Math.pow(10, 3)) / Math.pow(10, 3);
                return dec;
            }
        }
    }
    return num;
}

export default function interactiveTutorial(tutorialParams) {
    document.addEventListener('scrollEnd', createOverlayMaskAndTooltip);
    const innerHeight = document.documentElement.clientHeight;
    const innerWidth = document.documentElement.clientWidth;

    const activeElementId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : tutorialParams.tutorialElements[0].id;

    const currentElementIndex = tutorialParams.tutorialElements.findIndex(el => el.id == activeElementId);

    const currentElement = tutorialParams.tutorialElements[currentElementIndex];
    const activeElement = document.getElementById(activeElementId);

    if (currentElementIndex > 0) {
        const elem = document.getElementById('ttip-' + tutorialParams.tutorialElements[currentElementIndex - 1].id);
        elem.parentNode.removeChild(elem);
    }


    if (tutorialParams.preventDefault) {
        // get all event listeners for the element BEFORE adding the continueOrEndTutorial listener
        var clickListeners = activeElement.getEventListeners();
        // remove all click event listeners of the current element
        clickListeners.forEach(eventListener => activeElement.removeEventListener('click', eventListener.listener));
    }
    const bodyRect = document.body.getBoundingClientRect(),
        elemRect = activeElement.getBoundingClientRect(),
        offset = elemRect.top - bodyRect.top - (window.innerHeight / 2 - activeElement.offsetHeight / 2);

    smoothScrollTo(0, offset, 500);

    // create overlay if needed
    let overlay;
    if (!document.getElementById('it-overlay')) {
        overlay = document.createElement('div');
        overlay.id = 'it-overlay';
        overlay.classList.add(tutorialParams.theme || 'it_theme__dark');
        document.body.appendChild(overlay);
    } else overlay = document.getElementById('it-overlay');

    // remove mask while scrolling
    overlay.style.cssText = '';

    function createOverlayMaskAndTooltip() {
        // get the updated active element position
        const activeElementRect = activeElement.getBoundingClientRect();

        const offsetsPerc = {
            top: roundNumber(activeElementRect.top / innerHeight * 100),
            left: roundNumber(activeElementRect.left / innerWidth * 100),
            bottom: roundNumber((activeElementRect.top + activeElementRect.height) / innerHeight * 100),
            right: roundNumber((activeElementRect.left + activeElementRect.width) / innerWidth * 100)
        }

        // set css overlay mask
        const mask = `
                    -webkit-clip-path: polygon(
                        0% 0%, 
                        0% 100%, 
                        ${offsetsPerc.left}% ${offsetsPerc.bottom}%, 
                        ${offsetsPerc.left}% ${offsetsPerc.top}%,
                        ${offsetsPerc.right}% ${offsetsPerc.top}%, 
                        ${offsetsPerc.right}% ${offsetsPerc.bottom}%, 
                        ${offsetsPerc.left}% ${offsetsPerc.bottom}%, 
                        0 100%, 
                        100% 100%, 
                        100% 0%);  
                    clip-path: polygon(
                        0% 0%, 
                        0% 100%,
                        ${offsetsPerc.left}% ${offsetsPerc.bottom}%, 
                        ${offsetsPerc.left}% ${offsetsPerc.top}%,
                        ${offsetsPerc.right}% ${offsetsPerc.top}%, 
                        ${offsetsPerc.right}% ${offsetsPerc.bottom}%, 
                        ${offsetsPerc.left}% ${offsetsPerc.bottom}%, 
                        0 100%, 
                        100% 100%, 
                        100% 0%);`;
        overlay.style.cssText = mask;

        // Element tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'ttip-' + activeElementId;
        tooltip.classList.add('it_ttip');

        // temporarily hide the tooltip (so that size and position are available)
        tooltip.style.visibility = 'hidden';

        tooltip.innerHTML = '<p>' + currentElement.ttipText + '</p>';

        // 'OK' link if element is not interactive of confirmBtn is true and attach click event listener
        if (currentElement.interactive === false || tutorialParams.confirmBtn) {
            const okLink = document.createElement('a');
            okLink.classList.add('it_ttip_link');
            okLink.innerText = currentElement.confirmBtnText || 'OK';
            tooltip.appendChild(okLink);
            okLink.addEventListener('click', continueOrEndTutorial);
        }

        overlay.appendChild(tooltip);
        const tooltipRect = tooltip.getBoundingClientRect();

        // vertical tooltip positioning
        tooltip.style.top = activeElementRect.top > tooltipRect.height + 20 ? parseInt(activeElementRect.top - tooltipRect.height - 20) + 'px' : parseInt(activeElementRect.top + activeElementRect.height + 20) + 'px';
        // horizontal tooltip positioning
        tooltip.style.left = activeElementRect.left < tooltipRect.width + 20 ? parseInt(activeElementRect.left) + 'px' : parseInt(activeElementRect.left - tooltipRect.width + activeElementRect.width) + 'px';

        // show tooltip
        tooltip.style.visibility = 'visible';
    }

    function continueOrEndTutorial() {
        // remove scrollEnd event listener, it will be added again for the next element if the tutorial is still in progress
        document.removeEventListener('scrollEnd', createOverlayMaskAndTooltip);
        //console.log('activeElement: ',activeElement);
        
        // execute callback if provided
        if (currentElement.cb && currentElement.cb() instanceof Promise) {
            currentElement.cb().then(()=>{
                // add the removed click event listener before continuing to the next step
                if (tutorialParams.preventDefault) {
                    clickListeners.forEach(eventListener => {
                        activeElement.addEventListener('click', eventListener.listener);
                    });
                }
                activeElement.removeEventListener('click', continueOrEndTutorial);
                // if the tutorial isn't over yet continue, else end it
                if (tutorialParams.tutorialElements[currentElementIndex + 1]) {
                    interactiveTutorial(tutorialParams, tutorialParams.tutorialElements[currentElementIndex + 1].id);
                } else {
                    endTutorial();
                }
            })
        } else {
            if(currentElement.cb){
                currentElement.cb();
            }
            // add the removed click event listener before continuing to the next step
            if (tutorialParams.preventDefault) {
                clickListeners.forEach(eventListener => {
                    activeElement.addEventListener('click', eventListener.listener);
                });
            }
            activeElement.removeEventListener('click', continueOrEndTutorial);
            // if the tutorial isn't over yet continue, else end it
            if (tutorialParams.tutorialElements[currentElementIndex + 1]) {
                interactiveTutorial(tutorialParams, tutorialParams.tutorialElements[currentElementIndex + 1].id);
            } else {
                endTutorial();
            }
        }
    }

    // continue tutorial when clicking the target element
    activeElement.addEventListener('click', continueOrEndTutorial);

    function endTutorial() {
        // remove tooltip and overlay
        const elem = document.getElementById('ttip-' + currentElement.id);
        elem.parentNode.removeChild(elem);
        overlay.parentNode.removeChild(overlay);
        // execute callback if provided
        if (tutorialParams.tutorialEndCallback) {
            tutorialParams.tutorialEndCallback();
        }
    }

}