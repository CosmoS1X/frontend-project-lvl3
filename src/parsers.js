export const parseFeeds = (rss, watchedState) => {
  const feedTitle = rss.querySelector('title');
  const feedDescription = rss.querySelector('description');

  watchedState.form.data.feeds.push({
    title: feedTitle.textContent,
    description: feedDescription.textContent,
  });

  watchedState.form.processState = 'feed downloaded';
  return rss;
};

export const parsePosts = (rss, watchedState) => {
  const postElements = rss.querySelectorAll('item');

  const posts = Array.from(postElements).map((post) => {
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
    };
  });

  watchedState.form.data.posts.unshift(posts);
  watchedState.form.processState = 'posts downloaded';
};
