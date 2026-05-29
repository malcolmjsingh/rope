const element = document.documentElement; // Or a specific div

document.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen: ${err.message}`);
        });
    }
});
