import * as yup from 'yup';

const schema = yup.string().url();

export default (url) => {
  try {
    schema.validateSync(url);
    return '';
  } catch {
    return 'Ссылка должна быть валидным URL';
  }
};
