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

// checks working directory status
// entry point when running gulp
const checkStatus = (done) => {
	git.status({ args: "--porcelain" }, function (err, stdout) {
		if (stdout) {
			// set status
			workingDirectoryModified = true;
			// dump output to be processed later
			gitStatus = stdout;
		} else {
			// set status
			workingDirectoryModified = false;
		}
		done();
	});
};

// checks current active branch
// entry point when running gulp
const checkBranches = (done) => {
	git.revParse({ args: "--abbrev-ref HEAD" }, function (err, currentBranch) {
		// set branch name as current branch
		branch = currentBranch;
		if (branch === "main") {
			// branch is master
			if (workingDirectoryModified) {
				// master should only have merges
				// if there are any configuration updates or framework updates, make sure it's committed before running gulp
				console.log(chalk.inverse("[********]") + " * Main branch shouldn't have modified files, please check the changes");
			} else {
				console.log(chalk.inverse("[********]") + " * Welcome to main branch, please work on your designated branch");
				console.log(chalk.inverse("[********]") + " - html/dev/main for html development");
				console.log(chalk.inverse("[********]") + " - html/staging for html builds for staging server");
				console.log(chalk.inverse("[********]") + " - html/release for html builds for production server");
				console.log(chalk.inverse("[********]") + " - wp/dev for WordPress development");
				console.log(chalk.inverse("[********]") + " * If the default branches are not available, please change branch with git command");
				branchSwitcher(done);
			}
		} else {
			runOptions(done);
		}
		done();
	});
};

const runOptions = (done) => {
	let options = [];
	let actions = [];

	process.env.NODE_ENV = "default";

	switch (branch) {
		case "main":
			options.push("Switch branch");
			actions.push("switch");
			break;
		case "wp/dev":
			options.push("Run preview server");
			actions.push("preview");
			options.push("Switch branch");
			actions.push("switch");
			break;
		default:
			options.push("Run development server");
			actions.push("dev");
			options.push("Build test");
			actions.push("buildtest");
			options.push("Build and commit");
			actions.push("build");
			options.push("Switch branch");
			actions.push("switch");
			break;
	}

	let index = readlineSync.keyInSelect(options, chalk.inverse("[********]") + " > Choose an option: ");

	if (index > -1) {
		switch (actions[index]) {
			case "buildtest":
				runTestBuildMode(done);
				break;
			case "build":
				branchBuildActions(done);
				break;
			case "dev":
				runDevelopmentMode(done);
				break;
			case "preview":
				runPreviewMode(done);
				break;
			case "switch":
				branchSwitcher(done);
				break;
		}
	} else {
		done();
	}
};

const branchSwitcher = (done) => {
	git.exec({ args: "branch -l" }, function (err, stdout) {
		let branches = [];
		let options = [];
		stdout = stdout.split("\n");
		stdout.forEach((entry) => {
			if (entry.indexOf("*") !== 0 && entry !== "") {
				options.push("Switch to branch " + entry.trim());
				branches.push(entry.trim());
			}
		});

		let index = readlineSync.keyInSelect(options, chalk.inverse("[********]") + " > Choose an option: ");
		if (index > -1) {
			git.checkout(branches[index], function (err) {
				if (err) {
					console.log(chalk.inverse("[********]") + " * Branch switching failed");
				} else {
					branch = branches[index];
				}
				runOptions(done);
			});
		} else {
			done();
		}
	});
};

const branchBuildActions = (done) => {
	console.log(chalk.inverse("[********]") + " * Running build on development branch...");
	if (workingDirectoryModified) {
		if (readlineSync.keyInYN(chalk.inverse("[********]") + " > Continue with committing changes and building?")) {
			gulp.series(commitChanges, runBuildMode)();
		}
	} else {
		gulp.series(runBuildMode)();
	}
};

const runTestBuildMode = (done) => {
	console.log(chalk.inverse("[********]") + " * Running build mode");
	process.env.NODE_ENV = "production";
	compile.setBranch(branch);
	gulp.series(
		compile.run,
		bump,
		(done) => {
			return gulp.src(["./dist/**/*"]).pipe(gulp.dest("./build/"));
		},
		(done) => {
			console.log(chalk.inverse("[********]") + " * Build completed");
			done();
		},
		runOptions
	)();
	done();
};

const runBuildMode = (done) => {
	console.log(chalk.inverse("[********]") + " * Running build mode");
	process.env.NODE_ENV = "production";
	git.revParse({ args: "--abbrev-ref HEAD" }, function (err, currentBranch) {
		// set branch name as current branch
		branch = currentBranch;
		compile.setBranch(branch);
		gulp.series(
			compile.run,
			bump,
			(done) => {
				return gulp.src(["./dist/**/*"]).pipe(gulp.dest("./build/"));
			},
			checkStatus,
			commitChanges
		)();
		done();
	});
};

const runPreviewMode = (done) => {
	console.log(chalk.inverse("[********]") + " * Running preview mode");
	console.log(chalk.inverse("[********]") + " * You might want to undo changes after finishing");
	gulp.series(serve)();
	done();
};

const runDevelopmentMode = (done) => {
	console.log(chalk.inverse("[********]") + " * Running development mode");
	compile.setBranch(branch);
	gulp.series(compile.run, watch, serve)();
	done();
};

const branchDefaultActions = (done) => {
	if (branch === "wp/dev") {
		runPreviewMode(done);
	} else {
		runDevelopmentMode(done);
	}
};

const commitChanges = (done) => {
	let files = gitStatus.split("\n");
	files.forEach((entry) => {
		if (entry !== "") {
			let status = entry.substring(0, 2).trim();
			let file = entry.substring(3);
			if (status === "D" || status === "AD") {
				gitRemoved.push(file);
			}
		}
	});

	let message = "Build commit";

	const date = new Date().toString().substring(0, 24);

	git.exec({ args: " add *" }, () => {
		if (gitRemoved.length > 0) {
			git.exec({ args: " rm " + gitRemoved.join(" ") }, () => {
				git.exec({ args: " commit -m '" + message + " on: " + date + "'" }, () => {
					done();
				});
			});
		} else {
			git.exec({ args: " commit -m '" + message + " on: " + date + "'" }, () => {
				done();
			});
		}
	});
};

const checkoutWPAndMerge = (done) => {
	git.checkout("wp/dev", () => {
		git.merge(branch, () => {
			branch = "wp/dev";
			done();
		});
	});
};

exports.default = gulp.series(checkStatus, checkBranches);
exports.dev = branchDefaultActions;
exports.build = runBuildMode;
