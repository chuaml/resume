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
        x.addEventListener('mouseup', function (e) {
            gtag('event', 'read_policy', {});
        }, { once: true });
    });

});

