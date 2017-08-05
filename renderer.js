// import loader from 'monaco-loader';
// import { remote } from 'electron';

const loader = require('monaco-loader')
const {remote} = require('electron')

loader().then((monaco) => {
  const editor = monaco.editor.create(document.getElementById('main'), {
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
  });

  remote.getCurrentWindow().show();
});
