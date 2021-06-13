import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  const rss = dom.querySelector('rss');
  const errors = dom.querySelectorAll('parsererror');

  if (!_.isEmpty(errors) || !rss) {
    throw new Error('errors.notContain');
  }

  const feedTitle = rss.querySelector('title');
  const feedDescription = rss.querySelector('description');
  const postElements = rss.querySelectorAll('item');

  return {
    title: feedTitle.textContent,
    description: feedDescription.textContent,
    items: Array.from(postElements).map((post) => {
      const title = post.querySelector('title');
      const description = post.querySelector('description');
      const link = post.querySelector('link');

      return {
        title: title.textContent,
        description: description.textContent,
        link: link.textContent,
      };
    }),
  };
};
