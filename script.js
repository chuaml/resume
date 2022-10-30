window.addEventListener('DOMContentLoaded', function (ev) {

    const trackPageViewAfterSec = function (pageOpened_Sec) {
        setTimeout(function () {
            gtag('event', 'page_view_sec', { value: pageOpened_Sec, Seconds: pageOpened_Sec });
        }, pageOpened_Sec * 1000);
    }
    trackPageViewAfterSec(15);
    trackPageViewAfterSec(30);
    trackPageViewAfterSec(60);

    document.querySelectorAll('a[href^=mailto]').forEach(function (x) {
        const handler = function (e) {
            let email = e.currentTarget.innerText.trim();

            gtag('event', 'click_copy_email', { Email: email });
        };
        x.addEventListener('click', handler, { once: true });
        x.addEventListener('copy', handler, { once: true });
    });

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (x) {
        const handler = function (e) {
            let phone = e.currentTarget.innerText.trim();

            gtag('event', 'click_copy_phone', { Text: phone });
        };
        x.addEventListener('click', handler, { once: true });
        x.addEventListener('copy', handler, { once: true });
    });

    document.querySelectorAll('a[href^="https://www.linkedin.com/in/"]').forEach(function (x) {
        x.addEventListener('click', function (e) {
            gtag('event', 'click_LinkedIn', {});
        }, { once: true });
    });



    document.querySelectorAll('details').forEach(function (x) {
        x.addEventListener('click', function (e) {
            let jobTitle = e.currentTarget.closest('article').querySelector('h3').innerText;
            gtag('event', 'click_job_details', { Job: jobTitle });
        }, { once: true });
    });

    document.querySelectorAll('.section-policy').forEach(function (x) {
        x.addEventListener('pointerleave', function (e) {
            gtag('event', 'read_policy', {});
        }, { once: true });
    });

});

if (location.host !== '') {
    (function () {
        const cookieName = 'viewExpireTime';
        const viewExpireTime = document.cookie.split('; ').find(x => x.startsWith(cookieName));
        if (viewExpireTime === undefined) {
            // set view expire after n day
            document.cookie = cookieName + '='
                + new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toISOString()
                + ';max-age=' + 60 * 60 * 24 * 365 / 2 // stay p time valid for blocking expired view
                ;
        } else {
            const expireDate = viewExpireTime.substring(viewExpireTime.indexOf('=') + 1);
            if (new Date() >= new Date(expireDate)) {
                window.stop();
                window.document.body.remove();
                alert('your view session is expired.');
                throw new Error('your view session has expired.');
            }
        }
    })();

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
}