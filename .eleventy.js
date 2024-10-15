import { DateTime } from "luxon";
import CleanCSS from "clean-css";
import UglifyJS from "uglify-js";
import htmlmin from "html-minifier";

export default async function (eleventyConfig) {

    eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

    // Date formatting for humans
    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("LLLL dd, yyyy");
    });

    // Date formatting for machine
    eleventyConfig.addFilter("machineDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
    });

    // Minify CSS
    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
    });

    // Minify JS
    eleventyConfig.addFilter("jsmin", function(code) {
        let minified = UglifyJS.minify(code);
        if( minified.error ) {
            console.log("UglifyJS error: ", minified.error);
            return code;
        }
        return minified.code;
    });

    // Minify HTML output
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if( outputPath.indexOf(".html") > -1) {
            let minified = htmlmin.minify(content, {
                userShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }
        return content;
    });

    // Only content in the 'posts/' directory
    eleventyConfig.addCollection("posts", function(collection) {
        return collection.getAllSorted().filter(function(item) {
            return item.inputPath.match(/^\.\/posts\//) !== null;
        });
    });

    // Only content in the latest 'posts/' directory
    eleventyConfig.addCollection("postsLatest", function(collection) {
        return collection
          .getFilteredByGlob('**/posts/*.md')
          .slice(-9)
    });

    // Only content in the 'notes/' directory
    eleventyConfig.addCollection("notes", function(collection) {
        return collection.getAllSorted().filter(function(item) {
            return item.inputPath.match(/^\.\/notes\//) !== null;
        });
    });

    // Only content in the latest 'notes/' directory
    eleventyConfig.addCollection("notesLatest", function(collection) {
        return collection
          .getFilteredByGlob('**/notes/*.md')
          .slice(-9)
    });

    // Don't process folders with static assets e.g. images
    eleventyConfig.addPassthroughCopy("static/images");

    /* Markdown Plugins */
    let markdownIt = require("markdown-it");
    let options = {
        html: true,
        breaks: true,
        linkify: true
    };
    let opts = {
        permalink: true,
        permalinkClass: "direct-link",
        permalinkSymbol: "#"
    };

    return {
        templateFormats: [
            "md",
            "njk",
            "html"
        ],

        // If your site lives in a different subdirectory, change this.
        // Leading or trailing slashes are all normalized away, so don’t worry about it.
        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for URLs (it does not affect your file structure)
        pathPrefix: "/",

        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true,
        dir: {
            input: ",",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };
};
