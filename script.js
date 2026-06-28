AFRAME.registerComponent('url-handler', {
    schema: { url: { type: 'string' } },
    init: function () {
        var data = this.data;
        // Trigger ini akan jalan saat kursor loading selesai (fuse) atau layar ditap
        this.el.addEventListener('click', function () {
            window.open(data.url, '_blank');
        });
    }
});