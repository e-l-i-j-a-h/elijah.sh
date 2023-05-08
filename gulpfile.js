// gulp
const { src, dest, series, parallel, watch } = require('gulp');

// gulp plugins
const njk = require('gulp-nunjucks-render');
const minify = require('gulp-minifier');
const svgmin = require('gulp-svgmin');

// other
const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');
const liveServer = require('live-server');

const defaultPort = 8000;

const paths = {
	src: {
		views: 'src/templates/views/**/*.njk',
		css: 'src/css/**/*.css',
		js: 'src/js/**/*.js',
		static: 'src/static/**/*',
	},
	dst: {
		views: 'public/',
		css: 'public/css',
		js: 'public/js',
		static: 'public/static',
	},

	templateRoot: 'src/templates',
	blogPosts: 'src/templates/views/blog',
};

const buildTimestamp = {
	locale: 'en-US',
	options: {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		timeZoneName: 'short',
		timeZone: 'America/New_York',
	},
};

function clean() {
	return rimraf('public/*', { glob: true });
}

// compile nunjucks view templates
function processViews() {
	return src(paths.src.views)
		.pipe(njk({
			path: [paths.templateRoot],
			data: {
				ctx: {
					'build_timestamp':
						new Date().toLocaleString(
							buildTimestamp.locale,
							buildTimestamp.options
						),
					'blog_posts':
						fs.readdirSync(paths.blogPosts)
						.map(x => path.parse(x).name)
						.filter(x => x != 'index'),
				},
			},
		}))
		.pipe(minify({
			minify: true,
			minifyHTML: { collapseWhitespace: true, },
		}))
		.pipe(dest(paths.dst.views));
}

function processCSS() {
	return src(paths.src.css)
		.pipe(minify({
			minify: true,
			minifyCSS: { sourceMap: true, },
		}))
		.pipe(dest(paths.dst.css));
}

function processJS() {
	return src(paths.src.js)
		.pipe(minify({
			minify: true,
			minifyJS: { sourceMap: true, },
		}))
		.pipe(dest(paths.dst.js));
}

function processStatic() {
	return src(paths.src.static)
		.pipe(dest(paths.dst.static));
}

function watchAll() {
	watch(paths.templateRoot, processViews);
	watch(paths.src.css, processCSS);
	watch(paths.src.js, processJS);
	watch(paths.src.static, processStatic);
}

function serve() {
	liveServer.start({
		root: 'public',
		open: false,
	});
}

exports.default = series(
	clean,
	parallel(
		processViews,
		processCSS,
		processJS,
		processStatic,
	),
);

exports.dev = series(
	exports.default,
	parallel(
		serve,
		watchAll,
	),
);

exports.clean = clean;
