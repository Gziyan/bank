var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var mock = require("mockjs");
var webserver = require("gulp-webserver");

gulp.task("webserver", function () {
    gulp.src("./")
        .pipe(webserver({
            host: "localhost",
            port: 8090,
            open: true,
            livereload: true
        }));
});

gulp.task("interface", function () {
    gulp.src("./")
        .pipe(webserver({
            host: "localhost",
            port: 8080,
            middleware: function (req, res, next) {
                res.writeHead(200, {
                    "Content-type": "text/json;charset=utf8",
                    "Access-Control-Allow-Origin": "*"
                });


                if(req.url=="/data") {
                    var filename = req.url.split("/")[1];
                    var dataFile = path.join(__dirname, "js", filename+".json");

                    fs.exists(dataFile, function (exist) {

                        if (exist) {
                            fs.readFile(dataFile, function (err, data) {
                                if (err) return console.error(err);
                                res.end(data);
                            });
                        } else {
                            var data = "can't find file: " + filename;
                            res.end(data);
                        }
                    });

                }
                next();
            }
        }));
});
gulp.task("default", function () {
    gulp.start("webserver","interface")
});