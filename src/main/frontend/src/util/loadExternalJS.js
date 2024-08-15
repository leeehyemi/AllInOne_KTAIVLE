function loadExternalJS() {
    const scripts = [
        '/js/main.js',
        'lib/wow/wow.min.js',
        'lib/easing/easing.min.js',
        'lib/waypoints/waypoints.min.js',
        'lib/owlcarousel/owl.carousel.min.js',
        'lib/isotope/isotope.pkgd.min.js',
        'lib/lightbox/js/lightbox.min.js'
    ];

    scripts.forEach(src => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
    });
}

export default loadExternalJS;