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
        this._setUserInfo();
        try {
            this.validate();
        } catch (err) {
            this.resetAll();
            throw err;
        }
    }

    _setUserInfo() {
        const searchParams = new URLSearchParams(location.search);
        if (!localStorage['user.fromCompany']) { // only set user info only 1st time visit, to prevent manual overwrite
            const text = searchParams.get('utm_source')?.trim();
            if (text) localStorage['user.fromCompany'] = text;
        }
        if (!localStorage['user.jobOffer']) { // only set user info only 1st time visit
            const text = searchParams.get('utm_campaign')?.trim();
            if (text) localStorage['user.jobOffer'] = text;
        }
        if (!localStorage['user.fromMedium']) { // only set user info only 1st time visit
            const text = searchParams.get('utm_medium')?.trim();
            if (text) localStorage['user.fromMedium'] = text;
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

        // remove user info
        for (const [k, v] of Object.entries(localStorage)) {
            if (k.startsWith('user'))
                localStorage.removeItem(k);
        }
    }

    test(expireIn_sec = 5, renewIn_sec = 10) {
        this.resetAll();
        this.expireInTime_ms = expireIn_sec * 1000;
        this.reactiveInTime_ms = renewIn_sec * 1000;
        this.validate();
    }

    async isDebugMode() {
        const debugModeFlagKeyHash = '87924606b4131a8aceeeae8868531fbb9712aaa07a5d3a756b26ce0f5d6ca674';
        const inputKey = new URLSearchParams(location.search).get('debugmodekey');
        const inputKeyHash = await sha256(inputKey);

        if (inputKey && inputKeyHash === debugModeFlagKeyHash) {
            sessionStorage['debugmodekey'] = inputKey;
            location.search = location.search.replace('debugmodekey' + '=' + inputKey, ''); // remove key from querystring
            return true;
        }

        if ((await sha256(sessionStorage['debugmodekey'])) === debugModeFlagKeyHash) { // or use existing key
            return true;
        }

        return false;
    }
}

async function sha256(plainText) {
    const msgUint8 = new TextEncoder().encode(plainText);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
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



