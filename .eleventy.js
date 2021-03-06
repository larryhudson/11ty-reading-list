const { TextToSpeechPlugin } = require("eleventy-plugin-text-to-speech");
const fsPromises = require("fs/promises");
const mp3Duration = require("mp3-duration");
const { Podcast } = require("podcast");
const path = require("path");

require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(TextToSpeechPlugin, {
    voiceName: "en-AU-WilliamNeural",
  });

  eleventyConfig.on("eleventy.after", async function () {
    // find the podcast-info.json file
    const SITE_OUTPUT_DIR = "_site";
    const PODCAST_INFO_FILENAME = `podcast-info.json`;

    const PODCAST_INFO_FILEPATH = path.join(
      SITE_OUTPUT_DIR,
      PODCAST_INFO_FILENAME
    );

    try {
      const podcastItemsFromJson = await fsPromises
        .readFile(PODCAST_INFO_FILEPATH)
        .then((data) => JSON.parse(data));

      const podcastItems = await Promise.all(
        podcastItemsFromJson.map(async (podcastItem) => {
          const mp3FilePath = path.join(SITE_OUTPUT_DIR, podcastItem.mp3Url);

          const size = await fsPromises
            .stat(mp3FilePath)
            .then((fileStats) => fileStats.size);

          const duration = await mp3Duration(mp3FilePath);

          return {
            ...podcastItem,
            duration,
            size,
          };
        })
      );

      const feed = new Podcast({
        title: "Larry's reading list",
        description: "Audio versions of articles Larry wants to read",
        feedUrl: "https://larryhudson-reading-list.netlify.app/podcast.xml",
        siteUrl: "https://larryhudson-reading-list.netlify.app",
        docs: "https://larryhudson-reading-list.netlify.app",
        author: "Larry Hudson",
        managingEditor: "Larry Hudson",
        webMaster: "Larry Hudson",
        copyright: "2022 Larry Hudson",
        language: "en",
        pubDate: "March 27, 2022 17:14:00 GMT",
        ttl: 60,
        itunesAuthor: "Larry Hudson",
        itunesSubtitle: "Audio articles for Larry to listen to",
        itunesSummary: "Generated with Microsoft TTS",
        itunesOwner: { name: "Larry Hudson", email: "larryhudson@hey.com" },
        itunesExplicit: false,
      });

      podcastItems.forEach((podcastItem) => {
        feed.addItem({
          title: podcastItem.title,
          description: podcastItem.description,
          url: podcastItem.pageUrlWithSite,
          date: podcastItem.date,
          itunesDuration: podcastItem.duration,
          itunesSummary: podcastItem.description,
          content: `content: ${podcastItem.description}`,
          enclosure: {
            url: podcastItem.mp3UrlWithSite,
            size: podcastItem.size,
          },
        });
      });

      const podcastFeedXml = feed.buildXml();

      const PODCAST_FEED_OUTPUT_FILENAME = "/podcast.xml";
      const PODCAST_FEED_OUTPUT_FILEPATH = path.join(
        SITE_OUTPUT_DIR,
        PODCAST_FEED_OUTPUT_FILENAME
      );

      await fsPromises.writeFile(PODCAST_FEED_OUTPUT_FILEPATH, podcastFeedXml);
      //   await fsPromises.rm(PODCAST_INFO_FILEPATH);
    } catch {}
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
