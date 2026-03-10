// pwa.ts

/**
 * Registers the service worker for the application.
 * Requires the service worker file to be present in the root of the app.
 */
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
};

/**
 * Prompts the user to install the PWA if conditions are met.
 * This function can be called at strategic points in the app's lifecycle.
 */
type BeforeInstallPromptChoiceResult = {
    outcome: 'accepted' | 'dismissed';
    platform?: string;
};

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<BeforeInstallPromptChoiceResult>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const initPwaPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini info bar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e as BeforeInstallPromptEvent;
        // Optionally, display your own install button here.
        console.log('PWA install prompt deferred.');
    });
};

export const showPwaPrompt = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: BeforeInstallPromptChoiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA installation prompt.');
            } else {
                console.log('User dismissed the PWA installation prompt.');
            }
            deferredPrompt = null;
        });
    }
};