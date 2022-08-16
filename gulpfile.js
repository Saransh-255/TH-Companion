const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const zip = require("gulp-zip")

gulp.task('sass', (done) => {
    gulp.src('./src/styles/*/index.scss')
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(gulp.dest("./dist/css"))
    done()
});
gulp.task('manifest', (done) => {
    gulp.src("./manifest.json")
        .pipe(gulp.dest("./dist/"))
    done()
})
gulp.task('zip', (done) => {
    gulp.src('./dist/*')
        .pipe(zip('bcomp.zip'))
    done()
})

gulp.task('dev', (done) => {
    gulp.series('sass', 'manifest')
    done()
})
gulp.task('prod', (done) => {
    gulp.series('sass', 'manifest', 'zip')
    done()
})