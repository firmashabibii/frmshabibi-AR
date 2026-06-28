var e = {
	name: "@ar-js-org/marker-creator",
	version: "0.1.0",
	description: "An utility app to create pattern markers from your own images",
	keywords: [
		"artoolkit",
		"ar",
		"augmented reality",
		"marker creator",
		"pattern marker",
		"ar.js",
		"webar"
	],
	main: "dist/marker-creator.umd.js",
	module: "dist/marker-creator.mjs",
	types: "dist/index.d.ts",
	exports: { ".": {
		import: "./dist/marker-creator.mjs",
		require: "./dist/marker-creator.umd.js"
	} },
	scripts: {
		dev: "vite",
		build: "vite build",
		preview: "vite preview",
		test: "echo \"Error: no test specified\" && exit 1"
	},
	repository: {
		type: "git",
		url: "https://github.com/AR-js-org/Marker-Creator.git"
	},
	author: {
		name: "Walter Perdan",
		url: "https:://github.com/kalwalt"
	},
	devDependencies: {
		"@types/node": "^25.5.0",
		typescript: "^6.0.2",
		vite: "^8.0.3",
		"vite-plugin-dts": "^4.5.4"
	}
}, t = class t {
	static version = e.version;
	static sharedCanvas = document.createElement("canvas");
	static sharedContext = t.sharedCanvas.getContext("2d");
	constructor() {}
	static toCanvas(e, t) {
		console.assert(!1, "not yet implemented");
	}
	static encodeImageURL(e, n) {
		let r = new Image();
		r.onload = function() {
			n(t.encodeImage(r));
		}, r.src = e;
	}
	static encodeImage(e) {
		let n = t.sharedCanvas, r = t.sharedContext;
		if (!r) return "";
		n.width = 16, n.height = 16;
		let i = "";
		for (let t = 0; t > -2 * Math.PI; t -= Math.PI / 2) {
			r.save(), r.clearRect(0, 0, n.width, n.height), r.translate(n.width / 2, n.height / 2), r.rotate(t), r.drawImage(e, -n.width / 2, -n.height / 2, n.width, n.height), r.restore();
			let a = r.getImageData(0, 0, n.width, n.height);
			t !== 0 && (i += "\n");
			for (let e = 2; e >= 0; e--) for (let t = 0; t < a.height; t++) {
				for (let n = 0; n < a.width; n++) {
					n !== 0 && (i += " ");
					let r = t * a.width * 4 + n * 4 + e, o = a.data[r];
					i += String(o).padStart(3);
				}
				i += "\n";
			}
		}
		return i;
	}
	static triggerDownload(e, t = "pattern-marker.patt") {
		let n = window.document.createElement("a");
		n.href = window.URL.createObjectURL(new Blob([e], { type: "text/plain" })), n.download = t, document.body.appendChild(n), n.click(), document.body.removeChild(n);
	}
	static buildFullMarker(e, n, r, i, a) {
		let o = .1, s = o + (1 - 2 * o) * ((1 - n) / 2), c = t.sharedCanvas, l = t.sharedContext;
		if (!l) return;
		c.width = c.height = r, l.fillStyle = "white", l.fillRect(0, 0, c.width, c.height), l.fillStyle = i, l.fillRect(o * c.width, o * c.height, c.width * (1 - 2 * o), c.height * (1 - 2 * o)), l.fillStyle = "white", l.fillRect(s * c.width, s * c.height, c.width * (1 - 2 * s), c.height * (1 - 2 * s));
		let u = document.createElement("img");
		u.addEventListener("load", function() {
			l.drawImage(u, s * c.width, s * c.height, c.width * (1 - 2 * s), c.height * (1 - 2 * s)), a(c.toDataURL());
		}), u.src = e;
	}
};
//#endregion
export { t as ArPatternFile };
