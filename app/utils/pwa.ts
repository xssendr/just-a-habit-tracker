// pwa.ts

/**
 * Prompts the user to install the PWA if conditions are met.
 * VitePWA handles SW registration automatically.
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

