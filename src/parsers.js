export const parseFeeds = (rss, watchedState) => {
  const feedTitle = rss.querySelector('title');
  const feedDescription = rss.querySelector('description');

  watchedState.data.feeds.push({
    title: feedTitle.textContent,
    description: feedDescription.textContent,
  });

  watchedState.processState = 'feed downloaded';
  return rss;
};

export const parsePosts = (rss) => {
  const postElements = rss.querySelectorAll('item');

  return Array.from(postElements).map((post) => {
    const title = post.querySelector('title');
    const description = post.querySelector('description');
    const link = post.querySelector('link');
    const date = post.querySelector('pubDate');
    const guid = post.querySelector('guid');

    return {
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      date: date.textContent,
      guid: guid.textContent,
      isReaded: false,
    };
  });
};
