let isLoaded = false;
let callbacks: (() => void)[] = [];

export const loadReCaptchaScript = (): Promise<void> => {
    return new Promise((resolve) => {
        if (isLoaded) {
            resolve();
            return;
        }

        if (document.querySelector('script[src*="recaptcha"]')) {
            callbacks.push(resolve);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            isLoaded = true;
            callbacks.forEach(cb => cb());
            callbacks = [];
            resolve();
        };

        document.head.appendChild(script);
    });
}; 