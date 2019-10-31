const gulp = require("gulp");
const git = require("gulp-git");
const chalk = require("chalk");
const readlineSync = require("readline-sync");
const { watch, serve, bump } = require("./index.js");
const compile = require("./compile");

let workingDirectoryModified = false;
let branch = "";
let state = "default";
let gitStatus = "";
let gitRemoved = [];

const setBuild = done => {
	state = "build";
	done();
};

const checkStatus = done => {
	git.status({ args: "--porcelain" }, function(err, stdout) {
		if (stdout) {
			workingDirectoryModified = true;
			gitStatus = stdout;
		} else {
			workingDirectoryModified = false;
		}
		done();
	});
};

const checkBranches = done => {
	git.revParse({ args: "--abbrev-ref HEAD" }, function(err, currentBranch) {
		branch = currentBranch;
		if (branch === "master") {
			if (state === "default") {
				if (workingDirectoryModified) {
					console.log(chalk.inverse("[********]") + " * Master branch shouldn't have modified files, please check the changes");
				} else {
					masterInput(done);
				}
			}
			if (state === "build") {
				console.log(chalk.inverse("[********]") + " * Build is not allowed to run on master");
			}
		} else {
			if (state === "default") {
				branchDefaultActions(done);
			}
			if (state === "build") {
				branchBuildActions(done);
			}
		}
		done();
	});
};

const masterInput = done => {
	git.exec({ args: "branch -a" }, function(err, stdout) {
		let branches = [];
		let options = [];
		options.push("Run preview server");
		stdout = stdout.split("\n");
		stdout.forEach(entry => {
			if (entry.indexOf("*") !== 0 && entry !== "") {
				options.push("Switch to branch " + entry.trim());
				branches.push(entry.trim());
			}
		});
		let index = readlineSync.keyInSelect(options, chalk.inverse("[********]") + " > Choose an option: ");
		if (index > 0) {
			branch = branches[index - 1];
			git.checkout(branch, function(err) {
				if (state === "default") {
					branchDefaultActions(done);
				}
				if (state === "build") {
					branchBuildActions(done);
				}
				done();
			});
		} else if (index === 0) {
			runPreviewMode(done);
			done();
		} else {
			done();
		}
	});
};

const branchBuildActions = done => {
	if (branch === "wp/dev") {
		console.log(chalk.inverse("[********]") + " * Build is not allowed to run on wp/dev");
	} else if (branch === "html/stable") {
		if (workingDirectoryModified) {
			console.log(chalk.inverse("[********]") + " * html/stable branch shouldn't have modified files, please check the changes");
			done();
		} else {
			git.exec({args : " log -1 --pretty=%B"}, (err, stdout) => {
				console.log(stdout);
				done();
			});
		}
	} else {
		console.log(chalk.inverse("[********]") + " * Running build on development branch...");
		if (workingDirectoryModified) {
			if (readlineSync.keyInYN(chalk.inverse("[********]") + " > Continue with committing changes, merging, and building?")) {
				gulp.series(commitChanges, checkoutStableAndMerge, runBuildMode)();
			}
		} else {
			if (readlineSync.keyInYN(chalk.inverse("[********]") + " > Continue with merging changes and building?")) {
				gulp.series(checkoutStableAndMerge, runBuildMode)();
			}
		}
	}
};

const runBuildMode = done => {
	console.log(chalk.inverse("[********]") + " * Running build mode");
	process.env.NODE_ENV = 'production';
	compile.setBranch(branch);
	gulp.series(compile.run, bump, checkStatus, commitChanges)();
	done();
}

const runPreviewMode = done => {
	console.log(chalk.inverse("[********]") + " * Running preview mode");
	gulp.series(serve)();
	done();
}

const runDevelopmentMode = done => {
	console.log(chalk.inverse("[********]") + " * Running development mode");
	compile.setBranch(branch);
	gulp.series(compile.run, watch, serve)();
	done();
}

const branchDefaultActions = done => {
	if (branch === "wp/dev") {
		runPreviewMode(done);
	} else if (branch === "html/stable") {
		masterInput(done);
	} else {
		runDevelopmentMode(done);
	}
};

const commitChanges = done => {
	let files = gitStatus.split("\n");
	files.forEach(entry => {
		if(entry !== "") {
			let status = entry.substring(0,2).trim();
			let file = entry.substring(3)
			if(status === "D" || status === "AD") {
				gitRemoved.push(file);
			}
		}
	});

	let message = "Build commit";
	if(branch !== "html/stable") {
		message = "Pre-build commit (" + branch + ")";
	}

	const date = (new Date()).toString().substring(0,24);

	git.exec({args : " add *"}, () => {
		if(gitRemoved.length > 0) {
			git.exec({args : " rm " + gitRemoved.join(" ")}, () => {
				git.exec({args : " commit -m '" + message + " on: "+ date +"'"}, () => {
					done();
				});
			});
		} else {
			git.exec({args : " commit -m '" + message + " on: "+ date +"'"}, () => {
				done();
			});
		}
	});
};

const checkoutStableAndMerge = done => {
	git.checkout("html/stable", () => {
		git.merge(branch, () => {
			branch = "html/stable";
			done();
		});
	});
};

exports.default = gulp.series(checkStatus, checkBranches);
exports.build = gulp.series(setBuild, checkStatus, checkBranches);
