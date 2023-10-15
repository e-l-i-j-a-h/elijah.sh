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

const njkPaths = {
	'templates': 'src/templates',
	'blogPosts': 'src/templates/views/blog',
};

const gulpPaths = {
	'views':  { src: 'src/templates/views/**/*.njk', dst: 'public/' },
	'static': { src: 'src/static/**/*',              dst: 'public/' },
};

const buildTimestamp = {
	locale: 'en-US',
	options: {
		year:         'numeric',
		month:        'long',
		day:          '2-digit',
		hour:         '2-digit',
		minute:       '2-digit',
		timeZoneName: 'short',
		timeZone:     'America/New_York',
	},
};

function clean() {
	return rimraf('public/*', { glob: true });
}

// compile nunjucks view templates
function processViews() {
	return src(gulpPaths['views'].src)
		.pipe(njk({
			path: [ njkPaths['templates'] ],
			data: {
				ctx: {
					'build_timestamp':
						new Date().toLocaleString(
							buildTimestamp.locale,
							buildTimestamp.options
						),
					'blog_posts':
						fs.readdirSync(njkPaths['blogPosts'])
							.map(x => path.parse(x).name)
							.filter(x => x != 'index'),
				},
			},
		}))
		.pipe(minify({
			minify: true,
			minifyHTML: { collapseWhitespace: true, },
		}))
		.pipe(dest(gulpPaths['views'].dst));
}

function processStatic() {
	return src(gulpPaths['static'].src)
		.pipe(minify({
			minify: true,
			minifyCSS: { sourceMap: true },
			minifyJS:  { sourceMap: true },
		}))
		.pipe(dest(gulpPaths['static'].dst));
}

function watchAll() {
	watch(njkPaths['templates'], processViews);
	watch(gulpPaths['static'].src, processStatic);
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
