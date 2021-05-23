const input = document.querySelector('input');

const createFeedElement = (feed) => {
  const element = document.createElement('li');
  element.classList.add('list-group-item');

  const feedHeader = document.createElement('h3');
  const feedDescription = document.createElement('p');

  feedHeader.textContent = feed.title;
  feedDescription.textContent = feed.description;

  element.append(feedHeader);
  element.append(feedDescription);

  return element;
};

const createPostElement = (post, i18n) => {
  const element = document.createElement('li');
  element.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
  );

  const link = document.createElement('a');
  link.setAttribute('href', post.link);
  link.classList.add('font-weight-bold');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = post.title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.textContent = `${i18n.t('posts.viewButton')}`;

  button.addEventListener('click', () => alert('feature in development'));

  element.append(link);
  element.append(button);

  return element;
};

export const renderFeeds = (state, i18n) => {
  const { feeds } = state.form.data;

  input.classList.remove('is-invalid');

  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = `${i18n.t('feeds.title')}`;

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => feedsList.prepend(createFeedElement(feed)));

  feedsContainer.append(feedsHeader);
  feedsContainer.append(feedsList);
};

export const renderPosts = (state, i18n) => {
  const { posts } = state.form.data;

  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const postsHeader = document.createElement('h2');
  postsHeader.textContent = `${i18n.t('posts.title')}`;

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group');
  posts.flat().forEach((post) => postsList.append(createPostElement(post, i18n)));

  postsContainer.append(postsHeader);
  postsContainer.append(postsList);
};

export const renderError = (error) => {
  input.classList.add('is-invalid');
  const feedback = document.querySelector('.feedback');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = error;
};
