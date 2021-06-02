import * as yup from 'yup';

export default (url, downloadedFeeds, t) => {
  const schema = yup
    .string()
    .required(`${t('errors.required')}`)
    .url(`${t('errors.invalid')}`)
    .notOneOf(downloadedFeeds, `${t('errors.alreadyExists')}`);
  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.message;
  }
};
