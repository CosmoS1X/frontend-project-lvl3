import * as yup from 'yup';

export default (url, downloadedFeeds, i18n) => {
  const schema = yup
    .string()
    .required(`${i18n.t('errors.required')}`)
    .url(`${i18n.t('errors.invalid')}`)
    .notOneOf(downloadedFeeds, `${i18n.t('errors.alreadyExists')}`);
  try {
    schema.validateSync(url);
    return '';
  } catch (err) {
    return err.message;
  }
};
