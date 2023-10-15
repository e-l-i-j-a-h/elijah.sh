var themeSwitcher = (function () {

	'use strict';

	var themes = {
		'light': {
			faviconUrl: '/images/favicon-light.svg',
			vars: {
				'bg': '#fbf1c7',
				'bg-hard': '#f9f5d7',
				'bg-soft': '#f2e5bc',
				'bg1': '#ebdbb2',
				'bg2': '#d5c4a1',
				'bg3': '#bdae93',
				'bg4': '#a89984',
				'fg': '#7c6f64',
				'red': '#cc241d',
				'green': '#98971a',
				'yellow': '#d79921',
				'blue': '#458588',
				'purple': '#b16286',
				'aqua': '#689d6a',
				'orange': '#d65d0e',

				'bg-strong': '#928374',
				'fg-hard': '#282828',
				'fg-soft': '#282828',
				'fg1': '#3c3836',
				'fg2': '#504945',
				'fg3': '#665c54',
				'fg4': '#7c6f64',
				'fg-strong': '#3c3836',
				'red-strong': '#9d0006',
				'green-strong': '#79740e',
				'yellow-strong': '#b57614',
				'blue-strong': '#076678',
				'purple-strong': '#8f3f71',
				'aqua-strong': '#427b58',
				'orange-strong': '#af3a03',
			},
		},
		'dark': {
			faviconUrl: '/images/favicon-dark.svg',
			vars: {
				'bg': '#282828',
				'bg-hard': '#1d2021',
				'bg-soft': '#32302f',
				'bg1': '#3c3836',
				'bg2': '#504945',
				'bg3': '#665c54',
				'bg4': '#7c6f64',
				'fg': '#a89984',
				'red': '#cc241d',
				'green': '#98971a',
				'yellow': '#d79921',
				'blue': '#458588',
				'purple': '#b16286',
				'aqua': '#689d6a',
				'orange': '#d65d0e',

				'bg-strong': '#928374',
				'fg-hard': '#fbf1c7',
				'fg-soft': '#fbf1c7',
				'fg1': '#ebdbb2',
				'fg2': '#d5c4a1',
				'fg3': '#bdae93',
				'fg4': '#a89984',
				'fg-strong': '#ebdbb2',
				'red-strong': '#fb4934',
				'green-strong': '#b8bb26',
				'yellow-strong': '#fabd2f',
				'blue-strong': '#83a598',
				'purple-strong': '#d3869b',
				'aqua-strong': '#8ec07c',
				'orange-strong': '#fe8019',
			},
		},
	};

	var preferredColorSchemeWatcher = matchMedia('(prefers-color-scheme: dark)');

	function applyTheme(themeName) {
		var theme, faviconUrl, vars;

		if (!(themeName in themes))
			throw new Error('unknown theme "' + themeName + '"');

		theme = themes[themeName];
		faviconUrl = theme.faviconUrl;
		vars = theme.vars;

		document.querySelector('link[rel=icon]').href = faviconUrl;

		for (var key in vars) {
			document.documentElement.style.setProperty('--' + key, vars[key]);
		}

		localStorage.setItem('theme', themeName);
	}

	preferredColorSchemeWatcher.addEventListener('change', function (e) {
		applyTheme(e.matches ? 'dark' : 'light');
	});

	applyTheme(

		// look in localStorage for last used theme
		localStorage.getItem('theme') ||

		// fallback to browser preferred color scheme
		(preferredColorSchemeWatcher.matches ? 'dark' : 'light') ||

		// fallback to dark theme
		'dark'
	);

	// public

	return {

		applyTheme: applyTheme,

	};

})();
