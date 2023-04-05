import { useEffect, useState } from 'react';
import InfoCard from 'renderer/components/InfoCard';

function Peers() {
  return (
    <div className="space-y-4">
      <h1 className="font-extrabold text-xl text-zinc-50">Network Status</h1>
      <div className="grid grid-cols-3 gap-4">
        <InfoCard title="Online Peers" content="4" />
        <InfoCard title="Inbound Traffic" content="20 mb" />
        <InfoCard title="Outbound Traffic" content="1 mb" />
      </div>
    </div>
  );
}

export default Peers;
