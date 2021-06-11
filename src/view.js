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

const createPostElement = (post, viewedPostIds, t) => {
  const element = document.createElement('li');
  element.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'aligh-items-start', 'border-0', 'border-end-0');

  const link = document.createElement('a');
  link.setAttribute('href', post.link);
  link.classList.add(viewedPostIds.has(post.postId) ? ('fw-normal', 'link-secondary') : 'fw-bold');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');
  link.textContent = post.title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = t('posts.viewButton');

  button.addEventListener('click', () => {
    viewedPostIds.add(post.postId);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');

    const title = document.querySelector('.modal-title');
    title.textContent = post.title;

    const description = document.querySelector('.modal-body');
    description.textContent = post.description;

    const articleButton = document.querySelector('.full-article');
    articleButton.setAttribute('href', post.link);
  });

  element.append(link);
  element.append(button);

  return element;
};

export const renderFeeds = (state, t) => {
  const { data: { feeds } } = state;

  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const feedCard = document.createElement('div');
  feedCard.classList.add('card', 'border-0');

  const feedBody = document.createElement('div');
  feedBody.classList.add('card-body');

  const feedsHeader = document.createElement('h2');
  feedsHeader.classList.add('card-title', 'h4');
  feedsHeader.textContent = t('feeds.title');

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => feedsList.append(createFeedElement(feed)));

  feedCard.append(feedBody);
  feedCard.append(feedsList);
  feedBody.append(feedsHeader);
  feedsContainer.append(feedCard);
};

export const renderPosts = (state, t) => {
  const { data: { posts }, viewedPostIds } = state;

  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');

  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');

  const postsHeader = document.createElement('h2');
  postsHeader.classList.add('card-title', 'h4');
  postsHeader.textContent = t('posts.title');

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => postsList.append(createPostElement(post, viewedPostIds, t)));

  postsCard.append(postsBody);
  postsCard.append(postsList);
  postsBody.append(postsHeader);
  postsContainer.append(postsCard);
};

const renderError = (error, elements, t) => {
  const { input, feedback } = elements;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = t(error);
};

export const renderSuccess = (elements, t) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = t('success');
};

const handleProcessState = (state, elements, t) => {
  const { loadingProcess: { status } } = state;
  const { form, input, submitButton } = elements;
  switch (status) {
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
  const { form, loadingProcess } = state;
  switch (path) {
    case 'data.feeds':
      renderFeeds(state, t);
      break;
    case 'data.posts':
      renderPosts(state, t);
      break;
    case 'form.error':
      renderError(form.error, elements, t);
      break;
    case 'loadingProcess.status':
      handleProcessState(state, elements, t);
      break;
    case 'loadingProcess.error':
      renderError(loadingProcess.error, elements, t);
      break;
    default:
      break;
  }
});
