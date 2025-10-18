window.resizeInterop = (function () {
    let dotNetRef = null;
    function registerResize(dotNetObject) {
        dotNetRef = dotNetObject;
        window.addEventListener('resize', onResize);
    }
    function unregisterResize() {
        window.removeEventListener('resize', onResize);
        dotNetRef = null;
    }
    function onResize() {
        if (dotNetRef) {
            dotNetRef.invokeMethodAsync('SetWidth', window.innerWidth).catch(() => { });
        }
    }
    function getWidth() {
        return window.innerWidth;
    }
    return {
        registerResize: registerResize,
        unregisterResize: unregisterResize,
        getWidth: getWidth
    };
})();
