app.directive('banner', function () {
    return {
        restict: 'E',
        scope: { src: '@' },
        template: `
                <div class ="mainpage-header-picture text-color-white">
                    <div class ="mainpage">
                    </div>
                </div>
        `,
    }
});
