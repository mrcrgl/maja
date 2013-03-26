var expect = require("chai").expect,
    jsdom  = require("jsdom");
    
require("../lib/jsdom_patch");

describe("The jQuerify patch", function () {

    var HTML = "<html><head><title>test</title></head><body></body></html>";

    it("loads jQuery locally", function (done) {
        var document = jsdom.jsdom(HTML),
            window   = document.createWindow();
        
        jsdom.jQueryify(window, function () {
            var title  = window.$("title").text(),
                script = window.$("script").text();
            
            expect(title).to.equal("test");
            expect(script).to.match(/^\/\* local \*\//);
            done();
        });
    });
    
    it("can load a remote script", function (done) {
        var document = jsdom.jsdom(HTML),
            window   = document.createWindow();
        
        jsdom.jQueryify(
            window,
            "http://code.jquery.com/jquery-latest.js",
            function () {
                var title  = window.$("title").text(),
                    script = window.$("script").text();
                
                expect(title).to.equal("test");
                expect(script).to.not.match(/^\/\* local \*\//);
                done();
            }
        );
    });
    
    it("ignores invalid window objects", function () {
        function fail () {
            throw new Error("This should not be thrown!");
        }
        
        jsdom.jQueryify(null, fail);
        jsdom.jQueryify({}, fail);
    });

});