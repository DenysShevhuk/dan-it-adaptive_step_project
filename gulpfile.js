const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const browserslist = require("browserslist");
const cleancss = require("gulp-clean-css");
const media = require("gulp-group-css-media-queries");
const purifycss = require("gulp-purifycss");
const del = require("del");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");

let source = "src";
let distribution = "dist";

const path = {
    src: {
        html: [source + "/*.html", "!" + source + "/_*.html"],
        scss: source + "/scss/style.scss",
        js: source + "/js/main.js",
        img: source + "/img/**/*.{jpg,png,ico,svg,webp,gif}",
        fonts: source + "/fonts",
    },

    build: {
        html: distribution + "/",
        css: distribution + "/css/",
        js: distribution + "/js/",
        img: distribution + "/img/",
        fonts: distribution + "/fonts/*.ttf",
    },

    watch: {
        html: source + "/",
        css: source + "/scss/**/*.scss",
        js: source + "/js/**/*.js",
        img: source + "/img/**/*.{jpg,png,ico,svg,webp,gif}",
    },
};

function sync() {
    browsersync.init({
        server: {
            baseDir: "./" + distribution + "/",
            notify: false,
        },
    });
}

function html() {
    return gulp
        .src(path.src.html)
        .pipe(fileinclude())
        .pipe(gulp.dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return gulp
        .src(path.src.scss)
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(purifycss([source + "/**/*.html", source + "/js/**/*.js"]))
        .pipe(media())
        .pipe(
            autoprefixer({
                cascade: true,
            })
        )
        .pipe(gulp.dest(path.build.css))
        .pipe(cleancss())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return gulp
        .src(path.src.js)
        .pipe(fileinclude())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream());
}

function img() {
    return gulp
        .src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3,
            })
        )
        .pipe(gulp.dest(path.build.img));
}

function clean(params) {
    return del("./" + distribution + "/");
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
}

let build = gulp.series(clean, gulp.parallel(html, css, js, img));
let watch = gulp.series(build, gulp.parallel(watchFiles, sync));

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;

exports.build = build;
exports.default = watch;