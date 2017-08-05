const loader = require('monaco-loader')
const { ipcRenderer, remote } = require('electron')
const fs = require('fs')

loader().then((monaco) => {
  const el = document.getElementById('main');
  const editor = monaco.editor.create(el, {
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
  });

  const fileManager = new FileManager({ editor, monaco });

  // cancel file drop default events
  document.ondragover = document.ondrop = function (e) {
    e.preventDefault()
  }

  // add file drop event
  document.body.addEventListener('drop', function (e) {
    const path = e.dataTransfer.files[0].path;
    ipcRenderer.send('drop-file', path);
  });

  remote.getCurrentWindow().show();
});

class FileManager {
  constructor({ editor, monaco }) {
    this.editor = editor;
    this.monaco = monaco;

    // When we receive a 'open-file' message, open the file
    ipcRenderer.on('open-file', (e, path) => this.openFile(path));

    document.querySelector('#save').onclick = () => this.saveFile();
  }

  openFile(path) {
    fs.readFile(path, 'utf-8', (err, data) => {
      this.editor.setModel(this.monaco.editor.createModel(data, 'javascript'));
    });
  }

  saveFile() {
    remote.dialog.showSaveDialog((filename) => {
      if (!filename) return;

      const model = this.editor.getModel();
      let data = '';

      model._lines.forEach((line) => {
        data += line.text + model._EOL;
      });

      fs.writeFile(filename, data, 'utf-8');
    });
  }
}
