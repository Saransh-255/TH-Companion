/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const zip = require("gulp-zip");

gulp.task("sass", (done) => {
  gulp.src("./src/styles/**/index.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./dist/css"));
  done();
});
gulp.task("manifest", (done) => {
  gulp.src("./manifest.json")
    .pipe(gulp.dest("./dist/"));
  done();
});
gulp.task("zip", (done) => {
  gulp.src("./dist/*")
    .pipe(zip("bcomp.zip"))
    .pipe(gulp.dest("./dist/"));
  done();
});

gulp.task("dev", gulp.series("sass", "manifest"));

gulp.task("prod", gulp.series("sass", "manifest", "zip"));