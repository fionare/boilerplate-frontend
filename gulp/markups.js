'use strict';

const fs = require('fs-extra');
const path = require('path');
const { src, dest } = require('gulp');
const { paths } = require('./conf');

const $ = require('gulp-load-plugins')();

// stores current branch
let branch = "";
// stores current basePath
let basePath = "";

// generates html files based on html sources and json data
const markups = () => {
	const production = process.env.NODE_ENV === 'production';

	const nunjucksOptions = { path: paths.html.import };
	const injectStyles = src(paths.css.static, { read: false });
	const injectScripts = src(paths.js.static, { read: false });
	const injectOptions = {
		ignorePath: paths.dist.dir,
		addRootSlash: false,
		quiet: true
	};

	const renameOptions = file => {
		if (file.basename == 'index') return;
		file.dirname = file.basename.split('_').join('/');
		file.basename = 'index';
	};

	const prettyOptions = {
		indent_size: 2,
		max_preserve_newlines: 0
	};

	const fetchData = file => {
		const data = JSON.parse(fs.readFileSync(paths.json.config));
		if(data.basePath[branch] && basePath === "") {
			basePath = data.basePath[branch];
		}

		let output = {};
		output.basePath = basePath;

    const filename = file.basename.split('.')[0];
    filename !== 'index' &&
      (output.canonicalUrl = filename.split('_').join('/'));

		let jsonFiles = fs
		.readdirSync(paths.json.data.dir)
		.filter(files => /\.(json)$/.test(files));
		
		if (jsonFiles.length > 0) {
			jsonFiles.forEach(filename => {
				// get current file name
				const name = path.parse(filename).name;
				// get current file extension
				const ext = path.parse(filename).ext;
				// get current file path
				const filepath = path.resolve(paths.json.data.dir, filename);

				output[name] = JSON.parse(fs.readFileSync(filepath));
			});
		}

		if (file.path.includes('tmp')) {
			const content = JSON.parse(
				fs.readFileSync(
					path.join(
						paths.json.tmp.dir,
						`${path.parse(file.basename).name}.json`
						)
					)
				);
			
			for (const key in content) {
				output[key] = content[key];
			}
		}

		return output;
	};

	production && (injectOptions.removeTags = true);

	return src(paths.html.entry)
	.pipe($.data(fetchData))
	.pipe($.nunjucksRender(nunjucksOptions))
	.pipe($.rename(renameOptions))
	.pipe($.inject(injectStyles, injectOptions))
	.pipe($.inject(injectScripts, injectOptions))
	.pipe($.prettyHtml(prettyOptions))
	.pipe(dest(paths.dist.dir))
	.pipe($.touchCmd());
};

const setBranch = branchName => {
	branch = branchName;
}

const setBasePath = newBasePath => {
	basePath = newBasePath;
}

module.exports.setBranch = setBranch;
module.exports.setBasePath = setBasePath;
module.exports.default = markups;
