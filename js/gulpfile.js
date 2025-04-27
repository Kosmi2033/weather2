var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gcmq = require('gulp-group-css-media-queries');

    gulp.task('css:build', function() {
        return gulp.src(['!src/_*.scss','src/*.scss']) // Взяли файлы с расширением .scss, исключили из выборки файлы, которые начинаются с символа _
            .pipe(sass()) // компилируем scss в css
            .pipe(gcmq()) // в полученном css группируем множество медиа-выражений в общие.
            .pipe(gulp.dest('src/')) // кладем наш css файл в ту же папку
    });