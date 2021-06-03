import onChange from 'on-change';

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

const createPostElement = (post, t) => {
  const element = document.createElement('li');
  element.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
  );

  const link = document.createElement('a');
  link.setAttribute('href', post.link);
  link.classList.add(post.isReaded ? 'font-weight-normal' : 'fw-bold');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('target', '_blank');
  link.textContent = post.title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-target', '#modal');
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

    post.isReaded = true;
  });

  element.append(link);
  element.append(button);

  return element;
};

export const renderFeeds = (state, t) => {
  const { feeds } = state.data;

  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = `${t('feeds.title')}`;

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => feedsList.append(createFeedElement(feed)));

  feedsContainer.append(feedsHeader);
  feedsContainer.append(feedsList);
};

export const renderPosts = (state, t) => {
  const { posts } = state.data;

  const postsContainer = document.querySelector('.posts');
  postsContainer.textContent = '';

  const postsHeader = document.createElement('h2');
  postsHeader.textContent = `${t('posts.title')}`;

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group');
  posts.flat().forEach((post) => postsList.append(createPostElement(post, t)));

  postsContainer.append(postsHeader);
  postsContainer.append(postsList);
};

export const renderFeedback = (state, elements, t) => {
  const { input, feedback } = elements;
  if (state.form.error) {
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
        feedback.textContent = state.form.error;
        break;
    }
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = `${t('success')}`;
  }
};

const handleProcessState = (state, elements, t) => {
  const { form, input, submitButton } = elements;
  switch (state.processState) {
    case 'loading':
      input.readOnly = true;
      submitButton.disabled = true;
      break;
    case 'downloaded':
      input.readOnly = false;
      submitButton.disabled = false;
      form.reset();
      input.focus();
      renderFeedback(state, elements, t);
      break;
    case 'failed':
      input.readOnly = false;
      submitButton.disabled = false;
      break;
    default:
      console.log('unknown state');
  }
};

export default (state, elements, t) => onChange(state, (path) => {
  // console.log('STATE:', state);
  // console.log('PATH:', path);
  // console.log('VALUE:', value);
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
      renderFeedback(state, elements, t);
      break;
    default:
      console.log('missed handler');
      break;
  }
});
