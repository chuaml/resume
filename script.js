window.addEventListener('DOMContentLoaded', function (ev) {
    (function () {
        const PageOpened_Sec = 15;
        setTimeout(function () {
            gtag('event', 'page_view_sec', { value: PageOpened_Sec, Seconds: PageOpened_Sec });
        }, PageOpened_Sec * 1000);
    })();
    (function () {
        const PageOpened_Sec = 30;
        setTimeout(function () {
            gtag('event', 'page_view_sec', { value: PageOpened_Sec, Seconds: PageOpened_Sec });
        }, PageOpened_Sec * 1000);
    })();
    (function () {
        const PageOpened_Sec = 60;
        setTimeout(function () {
            gtag('event', 'page_view_sec', { value: PageOpened_Sec, Seconds: PageOpened_Sec });
        }, PageOpened_Sec * 1000);
    })();
});

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


