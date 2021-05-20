import _ from 'lodash';

export default (rss, watchedState) => {
  const feedTitle = rss.querySelector('title');
  const feedDescription = rss.querySelector('description');
  const postElements = rss.querySelectorAll('item');
  const rssId = _.uniqueId();

  watchedState.form.data.feeds.push({
    id: rssId,
    title: feedTitle.textContent,
    description: feedDescription.textContent,
  });

  const posts = Array.from(postElements).map((post) => {
    const title = post.querySelector('title');
    const description = post.querySelector('description');
    const link = post.querySelector('link');
    const date = post.querySelector('pubDate');

    return {
      feedId: rssId,
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
      date: date.textContent,
    };
  });

  watchedState.form.data.posts.unshift(posts);
};
