// motionConfigs/logoAnimation.js

export const getLogoAnimation = (animationComplete, isMobile) => {
    if (!animationComplete) return {};

    return isMobile
        ? {
            top: -28,
            left: -132,
            x: 0,
            y: 0,
            scale: 0.25,
            position: 'fixed',
        }
        : {
            top: -28,
            left: -90,
            x: 0,
            y: 0,
            scale: 0.4,
            position: 'fixed',
        };
};

export const initialLogoPosition = {
    top: '50%',
    left: '50%',
    x: '-50%',
    y: '-50%',
    position: 'fixed',
    scale: 1,
    zIndex: 1500,
};
