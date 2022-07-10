const { TextToSpeechPlugin } = require("eleventy-plugin-text-to-speech");

require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(TextToSpeechPlugin, {
    voiceName: "en-AU-WilliamNeural",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
