import onChange from 'on-change';

const createFeedElement = (feed) => {
  const element = document.createElement('li');
  element.classList.add('list-group-item', 'border-0', 'border-end-0');

  const feedHeader = document.createElement('h3');
  feedHeader.classList.add('h6', 'm-0');
  const feedDescription = document.createElement('p');
  feedDescription.classList.add('m-0', 'small', 'text-black-50');

  feedHeader.textContent = feed.title;
  feedDescription.textContent = feed.description;

  element.append(feedHeader);
  element.append(feedDescription);

  return element;
};

const createPostElement = (post, t) => {
  const element = document.createElement('li');
  element.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'aligh-items-start', 'border-0', 'border-end-0');

  const link = document.createElement('a');
  link.setAttribute('href', post.link);
  link.classList.add(post.readed ? 'fw-normal' : 'fw-bold');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');
  link.textContent = post.title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = `${t('posts.viewButton')}`;

  button.addEventListener('click', () => {
    link.classList.remove('fw-bold');
    link.classList.add('font-weight-normal');

    const title = document.querySelector('.modal-title');
    title.textContent = post.title;

    const description = document.querySelector('.modal-body');
    description.textContent = post.description;

    const articleButton = document.querySelector('.full-article');
    articleButton.setAttribute('href', post.link);

    post.readed = true;
  });

  element.append(link);
  element.append(button);

  return element;
};

export const renderFeeds = (state, t) => {
  const { feeds } = state.data;

  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const feedCard = document.createElement('div');
  feedCard.classList.add('card', 'border-0');

  const feedBody = document.createElement('div');
  feedBody.classList.add('card-body');

  const feedsHeader = document.createElement('h2');
  feedsHeader.classList.add('card-title', 'h4');
  feedsHeader.textContent = `${t('feeds.title')}`;

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => feedsList.append(createFeedElement(feed)));

  feedCard.append(feedBody);
  feedCard.append(feedsList);
  feedBody.append(feedsHeader);
  feedsContainer.append(feedCard);
};

export const renderPosts = (state, t) => {
  const { posts } = state.data;

  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');

  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');

  const postsHeader = document.createElement('h2');
  postsHeader.classList.add('card-title', 'h4');
  postsHeader.textContent = `${t('posts.title')}`;

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  posts.flat().forEach((post) => postsList.append(createPostElement(post, t)));

  postsCard.append(postsBody);
  postsCard.append(postsList);
  postsBody.append(postsHeader);
  postsContainer.append(postsCard);
};

const renderError = (state, elements, t) => {
  const { input, feedback } = elements;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  switch (state.form.error) {
    case 'Not Contain RSS':
      feedback.textContent = t('errors.notContain');
      break;
    case 'Network Error':
      feedback.textContent = t('errors.network');
      break;
    default:
      feedback.textContent = t(state.form.error);
      break;
  }
};

export const renderSuccess = (elements, t) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = `${t('success')}`;
};

const handleProcessState = (state, elements, t) => {
  const { form, input, submitButton } = elements;
  switch (state.processState) {
    case 'loading':
      input.readOnly = true;
      submitButton.disabled = true;
      break;
    case 'standby':
      input.readOnly = false;
      submitButton.disabled = false;
      form.reset();
      input.focus();
      renderSuccess(elements, t);
      break;
    case 'failed':
      input.readOnly = false;
      submitButton.disabled = false;
      break;
    default:
      break;
  }
};

export default (state, elements, t) => onChange(state, (path) => {
  // console.log('STATE:', state);
  // console.log('PATH:', path);
  switch (path) {
    case 'data.feeds':
      renderFeeds(state, t);
      break;
    case 'data.posts':
      renderPosts(state, t);
      break;
    case 'processState':
      handleProcessState(state, elements, t);
      break;
    case 'form.error':
      renderError(state, elements, t);
      break;
    default:
      break;
  }
});
