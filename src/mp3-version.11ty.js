const htmlToText = require("html-to-text");
const { AudioVersionTemplate } = require("eleventy-plugin-text-to-speech");

class AudioArticleTemplate extends AudioVersionTemplate {
  convertContentToPlainText = async (content) => {
    return htmlToText.convert(content, {
      wordwrap: 0,
      selectors: [
        {
          selector: "a",
          options: {
            ignoreHref: true,
          },
        },
        {
          selector: "figure",
          format: "skip",
        },
        {
          selector: "img",
          format: "skip",
        },
      ],
    });
  };
}

module.exports = AudioArticleTemplate;
