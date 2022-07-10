class PodcastInfoJson {
  data() {
    return {
      permalink: `/podcast-info.json`,
    };
  }

  async render(data) {
    return JSON.stringify(
      data.collections.textToSpeechPluginPages.map((mp3Page) => ({
        title: mp3Page.data.title,
        description: mp3Page.data.description,
        date: mp3Page.data.date,
        mp3Url: mp3Page.data.mp3Url,
        pageUrlWithSite: `https://larryhudson-reading-list.netlify.app${mp3Page.url}`,
        mp3UrlWithSite: `https://larryhudson-reading-list.netlify.app${mp3Page.data.mp3Url}`,
      })),
      null,
      2
    );
  }
}

module.exports = PodcastInfoJson;
