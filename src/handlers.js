export const checkIsRss = (doc, t) => {
  const rss = doc.querySelector('rss');

  if (!rss) {
    return Promise.reject(new Error(`${t('errors.notContain')}`));
  }

  return doc;
};

export const addRss = (doc, watchedState, t) => {
  watchedState.downloadedFeeds.push(watchedState.form.url);
  const feedback = document.querySelector('.feedback');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = `${t('success')}`;
  const rss = doc.querySelector('rss');
  return rss;
};

export const disableUI = () => {
  const inputField = document.querySelector('input');
  const submitButton = document.querySelector('[type="submit"]');
  inputField.readOnly = true;
  submitButton.disabled = true;
};

export const enableUI = () => {
  const inputField = document.querySelector('input');
  const submitButton = document.querySelector('[type="submit"]');
  inputField.readOnly = false;
  submitButton.disabled = false;
};
