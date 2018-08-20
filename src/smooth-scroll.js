/**
 * Smooth scroll animation
 * @param {int} endX: destination x coordinate
 * @param {int) endY: destination y coordinate
 * @param {int} duration: animation duration in ms
 */

export default function smoothScrollTo(endX, endY, duration) {
    // create the event
    var scrollEndEvent = new CustomEvent("scrollEnd", {
        detail: {
            scrollEnded: true
        }
    });

    var startX = window.scrollX || window.pageXOffset,
        startY = window.scrollY || window.pageYOffset,
        distanceX = endX - startX,
        distanceY = endY - startY,
        startTime = new Date().getTime();

    duration = typeof duration !== 'undefined' ? duration : 400;

    // Easing function
    var easeInOutQuart = function (time, from, distance, duration) {
        if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
        return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
    };

    var timer = window.setInterval(function () {
        var time = new Date().getTime() - startTime,
            newX = easeInOutQuart(time, startX, distanceX, duration),
            newY = easeInOutQuart(time, startY, distanceY, duration);
        window.scrollTo(newX, newY);
        if (time >= duration) {
            window.clearInterval(timer);
            document.dispatchEvent(scrollEndEvent);
        }
    }, 1000 / 60); // 60 fps
};