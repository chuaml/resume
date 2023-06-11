// collect page view time
requestAnimationFrame(timeSpan_ms => timeSpan_ms); // init first rAF, to be used as timespan
window.addEventListener('beforeunload', function (ev) {
    requestAnimationFrame(timeSpan_ms => { // record only if page is being view
        const total_view_sec = timeSpan_ms / 1000;
        gtag('event', 'page_view_sec', { event_type: ev.type, timeSpan_sec: total_view_sec, value: total_view_sec });
    });
});

document.addEventListener('readystatechange', function (ev) {
    if (ev.target.readyState !== 'interactive') return;
    requestAnimationFrame(timeSpan_ms => { // record only if page is being view
        const total_view_sec = timeSpan_ms / 1000;
        gtag('event', 'readystatechange', { event_type: ev.type, text: 'interactive', timeSpan_sec: total_view_sec, value: 0 - total_view_sec });
    });
});

window.addEventListener('DOMContentLoaded', function (ev) {
    requestAnimationFrame(timeSpan_ms => { // record only if page is being view
        const total_view_sec = timeSpan_ms / 1000;
        gtag('event', 'DOMContentLoaded', { event_type: ev.type, timeSpan_sec: total_view_sec, value: 0 - total_view_sec });
    });
});

window.addEventListener('load', function (ev) {
    requestAnimationFrame(timeSpan_ms => { // record only if page is being view
        const total_view_sec = timeSpan_ms / 1000;
        gtag('event', 'window_load', { event_type: ev.type, timeSpan_sec: total_view_sec, value: 0 - total_view_sec });
    });
});




document.querySelectorAll('a[href^=mailto]').forEach(function (x) {
    const handler = function (e) {
        gtag('event', 'click_copy_email', { event_type: e.type });
    };
    x.addEventListener('click', handler, { once: true });
    x.addEventListener('copy', handler, { once: true });
});

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (x) {
    const handler = function (e) {
        gtag('event', 'click_copy_phone', { event_type: e.type });
    };
    x.addEventListener('click', handler, { once: true });
    x.addEventListener('copy', handler, { once: true });
});

document.querySelectorAll('a[href^="https://www.linkedin.com/in/"]').forEach(function (x) {
    x.addEventListener('click', function (e) {
        gtag('event', 'click_LinkedIn');
    }, { once: true });
});



document.querySelectorAll('details').forEach(function (x) {
    x.addEventListener('click', function (e) {
        const jobTitle = e.currentTarget.closest('article').querySelector('h3').innerText.trim();
        gtag('event', 'click_job_details', { text: jobTitle });
    }, { once: true });
});

document.querySelectorAll('#terms-and-conditions').forEach(function (x) {
    x.addEventListener('pointerleave', function (e) {
        gtag('event', 'read_policy');
    }, { once: true });
});


document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen') {
        alert('hi, you may just share the link, no screenshot is needed.');
    }
});

if (location.host !== '') {
    document.addEventListener('keydown', function (e) {
        const key = e.key.toUpperCase();
        if (key === 'F12') {
            e.preventDefault(); return false;
        }

        if (e.ctrlKey && key === 'U') {
            e.preventDefault(); return false;
        }

        if (e.ctrlKey && e.shiftKey) {
            if (key === 'I') {
                e.preventDefault(); return false;
            }
            if (key === 'C') {
                e.preventDefault(); return false;
            }
            if (key === 'J') {
                e.preventDefault(); return false;
            }
        }
    });
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // (function () {
    //     const cookieName = 'viewExpireTime';
    //     const viewExpireTime = document.cookie.split('; ').find(x => x.startsWith(cookieName));
    //     if (viewExpireTime === undefined) {
    //         // set view expire after n day
    //         document.cookie = cookieName + '='
    //             + new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString()
    //             + ';max-age=' + 60 * 60 * 24 * 365 / 4 // stay p time valid for blocking expired view
    //             ;
    //     } else {
    //         const expireDate = viewExpireTime.substring(viewExpireTime.indexOf('=') + 1);
    //         if (new Date() >= new Date(expireDate)) {
    //             window.stop();
    //             window.document.body.remove();
    //             alert('your view session is expired.');
    //             throw new Error('your view session has expired.');
    //         }
    //     }
    // })();

}