import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'Ссылка должна быть валидным URL',
  },
});

const schema = yup.string().url();

export default (url) => {
  try {
    schema.validateSync(url);
    return '';
  } catch (err) {
    return err.message;
  }
};
