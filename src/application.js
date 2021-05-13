export default () => {
  const div = document.createElement('div');
  const header = document.createElement('h1');
  header.textContent = 'Hello World!';
  header.setAttribute('style', 'text-align: center; font-size: 60px;');
  div.append(header);

  document.body.append(div);
};
