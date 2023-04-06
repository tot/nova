import { useEffect, useState } from 'react';

function Settings() {
  const [ip, setIP] = useState('');

  useEffect(() => {
    const getIP = async () => {
      const data = await window.electron.ipcRenderer.invoke('get_ip', []);
      setIP(data);
    };
    getIP();
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-extrabold text-xl text-zinc-50">Settings</h1>
      <div className="w-full h-px bg-[#232324]" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1">
          <p className="text-zinc-200 font-bold pb-1">Network</p>
          <p className="text-zinc-500 text-sm">
            Aenean viverra sem id dui eleifend dignissim. Mauris mattis, dui in
            mollis interdum, odio magna tincidunt ante, et vehicula lacus nisl
            et odio.
          </p>
        </div>
        <div className="col-span-2 grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <p className="text-zinc-300 font-medium">IP Address</p>
            <p className="text-neutral-500 text-sm">
              Maecenas vel commodo purus. Proin id porta metus.
            </p>
          </div>
          <div className="col-span-1 flex justify-end">
            <p className="text-neutral-400 inline-block h-fit p-2 rounded border border-[#2a2a2b] bg-[#181818]">
              {ip}:3000
            </p>
          </div>
        </div>
      </div>
      {/* <h1 className="font-extrabold text-xl text-zinc-50">Client Settings</h1> */}
      <div className="w-full h-px bg-[#232324]" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1">
          <p className="text-zinc-200 font-bold pb-1">Client</p>
          <p className="text-zinc-500 text-sm">
            Aenean viverra sem id dui eleifend dignissim. Mauris mattis, dui in
            mollis interdum, odio magna tincidunt ante, et vehicula lacus nisl
            et odio.
          </p>
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <p className="text-zinc-300 font-medium">Download Location</p>
              <p className="text-neutral-500 text-sm">
                Maecenas vel commodo purus. Proin id porta metus.
              </p>
            </div>
            <div className="col-span-1 flex justify-end">
              <p className="text-neutral-400 w-auto h-fi whitespace-nowrap truncate p-2 rounded border border-[#2a2a2b] bg-[#181818]">
                /Users/tony/documents/school
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
