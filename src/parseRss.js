export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data.contents, 'application/xml');
  const rss = dom.querySelector('rss');

  if (!rss) {
    throw new Error('Not Contain RSS');
  }

  const feedTitle = rss.querySelector('title');
  const feedDescription = rss.querySelector('description');
  const postElements = rss.querySelectorAll('item');

  return {
    title: feedTitle.textContent,
    description: feedDescription.textContent,
    posts: Array.from(postElements).map((post) => {
      const title = post.querySelector('title');
      const description = post.querySelector('description');
      const link = post.querySelector('link');
      const guid = post.querySelector('guid');

      return {
        title: title.textContent,
        description: description.textContent,
        link: link.textContent,
        guid: guid.textContent,
        isReaded: false,
      };
    }),
  };
};
