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


class ViewSession {
    get expireDate() {
        return new Date(this._getViewExpireTime());
    }
    get reactiveDate() {
        return new Date(this._getViewExpireTime() + this.reactiveInTime_ms);
    }

    expireInTime_ms = 2_592_000_000; // 30 days
    get reactiveInTime_ms() { return parseInt(localStorage['reactiveInTime_ms']); }
    set reactiveInTime_ms(time_ms) { localStorage['reactiveInTime_ms'] = time_ms; }
    constructor() {
        localStorage['reactiveInTime_ms'] = localStorage['reactiveInTime_ms'] || 10_368_000_000; // 120 days
        try {
            this.validate();
        } catch (err) {
            this.resetAll();
            throw err;
        }
    }

    validate() {
        if (this._getViewExpireTime() === -1) {
            this.initOrRenew(this.expireInTime_ms);
        }

        if (this.expireDate.toString() === 'Invalid Date') {
            console.error('invalid expireDate Time');
            this.stopAndInvalidate();
        }

        const timeNow = new Date().getTime();
        const viewExpireTime = this._getViewExpireTime();

        const reactiveDateTime = this.reactiveDate.getTime();
        if (timeNow > reactiveDateTime) { // renew view session after the expired n day + x days
            this.resetAll();
            this.initOrRenew(this.expireInTime_ms);
        }
        else if (timeNow > viewExpireTime) { // invalidate view session after n days
            this.stopAndInvalidate();
        }
    }

    _getViewExpireTime() {
        const viewExpireTime = parseInt(localStorage['viewExpireTime']);
        if (isNaN(viewExpireTime) === true) {
            return -1;
        }
        else {
            return viewExpireTime;
        }
    }

    initOrRenew(expireInTime_ms) {
        localStorage['viewExpireTime'] = new Date().getTime() + expireInTime_ms || -1;
    }

    stopAndInvalidate() {
        window.stop();
        window.document.body.remove();
        setTimeout(() => {
            alert('your view session is expired. please retry next time.');
        }, 0);
        console.error('your view session has expired.');
    }

    resetAll() {
        localStorage.removeItem('viewExpireTime');
        localStorage.removeItem('reactiveInTime_ms');
    }

    test(expireIn_sec = 5, renewIn_sec = 10) {
        this.resetAll();
        this.expireInTime_ms = expireIn_sec * 1000;
        this.reactiveInTime_ms = renewIn_sec * 1000;
        this.validate();
    }
}


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

    window.viewSession = new ViewSession();
}
else {
    window.viewSession = new ViewSession();

    // test viewSession
    // window.viewSession.resetAll();
    // window.viewSession.expireInTime_ms = 1000 * 5;
    // window.viewSession.reactiveInTime_ms = 1000 * 10;
    // window.viewSession.validate();
}