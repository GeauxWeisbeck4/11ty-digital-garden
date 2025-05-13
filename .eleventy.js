import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default async function(eleventyConfig) {

  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);
  // Add eleventy navigation plugin
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

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