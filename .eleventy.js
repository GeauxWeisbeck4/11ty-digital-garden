import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import pluginFilters from "./src/_config/filters.js";

export default async function(eleventyConfig) {

  // Watch CSS files
  eleventyConfig.addWatchTarget("css/**/*.css");
  // Wathc images for image pipeline
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

  // Per-page bundles, see plugin
  // Bundle <style> content and adss a {% css %} paired shortcode
  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
    // Add all <style> content to `css` bundle (use eleventy:ignore to opt-out)
    // supported selectors: https://npmjs.com/package/posthtml-match-helper
    bundleHtmlContentFromSelector: "style",
  });

  // Bundle <script> content adn adds a {% js %} paired shortcode
  eleventyConfig.addBundle("js", {
    bundleHtmlContentFromSelector: "script",
  });

  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);
  // Add eleventy navigation plugin
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);



  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "RSS Feed",
        order: 8
      }
    },
    collection: {
      name: "posts",
      limit: 20,
    },
    metadata: {
      language: "en",
      title: "11ty Digital Garden",
      subtitle: "Create your digital garden with the 11ty Digital Garden Starter today.",
      base: "https://your-site.com",
      author: {
        name: "Some Guy or Some Girl"
      }
    }
  });

  // Image optimization
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output formats for each image.
    formats: ["avif", "webp", "auto"],

    // widths: ["auto"]
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      }
    },

    sharpOptions: {
      animated: true,
    }
  });

  eleventyConfig.addPlugin(pluginFilters);

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // Use default Eleventy's built-in `slugify` filter
    // slugify: eleventyConfig.getFilter("slugify"),
    // sleector: "h1,h2,h3,h4,h5,h6", 
    // default
  });

  // Get the first `n` elements of a collection
  // Credit to `https://github.com/mjgs/eleventy-agile-blog` for tags
  eleventyConfig.addFilter("head", (array, n) => {
    if(n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function(item) {
          switch(item) {
            // list matches the `filter` list in tags.njk
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // Return an array in addCollection
    return [...tagSet];
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
      "11ty.js",
    ],
    dir: {
      input: "src",
      includes: "_includes",
      output: "site",
    },
    passthroughFileCopy: true,
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk"
  };
  
}