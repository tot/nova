import { useState } from 'react';

function Explorer() {
  const [selectedFile, setSelectedFile] = useState<File>();
  return (
    <>
      <div className="space-y-4">
        <h1 className="font-extrabold text-xl text-zinc-50">File Explorer</h1>
      </div>
      <label htmlFor="out-file" className="text-white">
        File to send
        <br />
        <input
          type="file"
          id="out-file"
          name="out-file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setSelectedFile(file);
          }}
        />
      </label>
      <br />
      <br />
      <input
        type="button"
        id="send-button"
        name="send-button"
        value="Send File"
        className="text-white bg-blue-500"
        onClick={() => {
          if (selectedFile === undefined) return;
          window.electron.ipcRenderer.invoke('send-file', selectedFile.path);
        }}
      />
    </>
  );
}

export default Explorer;
