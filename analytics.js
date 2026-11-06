(() => {
    const consentKey = 'onetask_analytics_consent';
    const hubspotScriptId = 'hs-script-loader';
    const hubspotScriptUrl = 'https://js-na2.hs-scripts.com/244736924.js';
    const hasGlobalPrivacyControl = navigator.globalPrivacyControl === true;

    const readConsent = () => {
        try {
            return localStorage.getItem(consentKey);
        } catch {
            return null;
        }
    };

    const saveConsent = (value) => {
        try {
            localStorage.setItem(consentKey, value);
        } catch {
            // The current page still honors the visitor's choice if storage is unavailable.
        }
    };

    const loadHubSpot = () => {
        if (hasGlobalPrivacyControl || document.getElementById(hubspotScriptId) || window.__oneTaskHubSpotLoaded) return;

        window.__oneTaskHubSpotLoaded = true;
        const script = document.createElement('script');
        script.id = hubspotScriptId;
        script.src = hubspotScriptUrl;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    };

    const clearHubSpotCookies = () => {
        ['hubspotutk', '__hstc', '__hssc', '__hssrc'].forEach((name) => {
            document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
            document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
        });
    };

    const closeDialog = () => document.querySelector('#analytics-consent')?.remove();

    const showConsent = () => {
        closeDialog();
        const dialog = document.createElement('section');
        dialog.id = 'analytics-consent';
        dialog.className = 'analytics-consent';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'analytics-consent-title');

        if (hasGlobalPrivacyControl) {
            dialog.innerHTML = `<div><h2 id="analytics-consent-title">Privacy preference honored</h2><p>Your browser has Global Privacy Control enabled, so optional analytics remain off.</p></div><div class="analytics-consent-actions"><button type="button" data-consent-close>Close</button></div>`;
        } else {
            dialog.innerHTML = `<div><h2 id="analytics-consent-title">Your privacy choices</h2><p>We use optional HubSpot analytics to understand website usage and improve 1task. You can allow or decline this tracking.</p></div><div class="analytics-consent-actions"><button type="button" data-consent="denied">Decline</button><button class="analytics-consent-allow" type="button" data-consent="granted">Allow analytics</button></div>`;
        }

        document.body.appendChild(dialog);
        dialog.querySelector('button')?.focus();
    };

    document.addEventListener('click', (event) => {
        const settingsLink = event.target.closest('[data-privacy-settings], a[href="#privacy-settings"]');
        if (settingsLink) {
            event.preventDefault();
            showConsent();
            return;
        }

        if (event.target.closest('[data-consent-close]')) {
            closeDialog();
            return;
        }

        const choice = event.target.closest('[data-consent]')?.dataset.consent;
        if (!choice) return;

        const previouslyGranted = readConsent() === 'granted';
        saveConsent(choice);
        closeDialog();

        if (choice === 'granted') {
            loadHubSpot();
        } else {
            clearHubSpotCookies();
            if (previouslyGranted && document.getElementById(hubspotScriptId)) location.reload();
        }
    });

    const initialize = () => {
        const consent = readConsent();
        if (consent === 'granted') loadHubSpot();
        else if (consent !== 'denied' && !hasGlobalPrivacyControl) showConsent();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
    else initialize();
})();
