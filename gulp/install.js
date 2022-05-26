"use strict";

const git = require("gulp-git");
const readlineSync = require('readline-sync');
const gulp = require("gulp");
const chalk = require("chalk");
const fs = require('fs-extra');

const init = done => {
	console.log(chalk.inverse("[********]") + " * Initializing repository");
	git.init({args: "--quiet"}, function (err) {
		done();
	});
};

const add = () => {
	console.log(chalk.inverse("[********]") + " * Adding files");
	return gulp.src(["./*", ".gitignore", "!node_modules"])
	.pipe(git.add());
};

const commit = () => {
	console.log(chalk.inverse("[********]") + " * Creating initial commit");
	const date = (new Date()).toString().substring(0,24);
	return gulp.src(["./*", ".gitignore", "!node_modules"])
	.pipe(git.commit('Initial Commit: ' + date, {
		disableAppendPaths: true,
		args: "--quiet"
	}));
};

const setup = done => {
	console.log(chalk.inverse("[********]") + " * Generating Branches");
	git.branch("html/dev/main");
	git.branch("html/dev/stable");
	git.branch("html/build/staging");
	git.branch("html/build/release");
	git.branch("html/build/wp");
	git.branch("wp/dev/main");
	git.checkout('html/dev/main', {args:'-b'});

	let remote = readlineSync.question(chalk.inverse("[********]") + " > Enter GitHub repository SSH/HTTPS: ");
	if(remote) {
		git.addRemote("origin", remote, () => {
			if (readlineSync.keyInYN(chalk.inverse("[********]") + " > Do you want to push everything to origin?")) {
				git.exec({args: "push -u origin --all"}, () => {
					done();
				});
			}　else {
				done();
			}
		});
	} else {
		done();
	}
}

if (fs.existsSync('.git')) {
	exports.default = done => { done(); };
} else {
	exports.default = gulp.series(init, add, commit, setup);
}
