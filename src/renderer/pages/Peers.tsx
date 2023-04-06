import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useReducer, useState } from 'react';

function Peers() {
  const [peer, setPeer] = useState('');

  const rerender = useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Name',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'firstName',
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: 'Info',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'age',
            header: () => 'Age',
            footer: (props) => props.column.id,
          },
          {
            header: 'More Info',
            columns: [
              {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                footer: (props) => props.column.id,
              },
              {
                accessorKey: 'status',
                header: 'Status',
                footer: (props) => props.column.id,
              },
              {
                accessorKey: 'progress',
                header: 'Profile Progress',
                footer: (props) => props.column.id,
              },
            ],
          },
          {
            accessorKey: 'createdAt',
            header: 'Created At',
          },
        ],
      },
    ],
    []
  );
  return (
    <div className="space-y-4">
      <h1 className="font-extrabold text-xl text-zinc-50">Peers</h1>
      <div className="w-full h-px bg-[#232324]" />
      <input
        className=""
        onChange={(event) => {
          setPeer(event.currentTarget.value);
        }}
      />
      <p className="text-white">{peer}</p>
      <button
        type="button"
        className="text-white bg-blue-500"
        onClick={async () => {
          console.log('connecting to peer');
          const res = await window.electron.ipcRenderer.invoke('connect', [
            peer,
          ]);
          console.log(res);
        }}
      >
        connect to peer
      </button>
    </div>
  );
}

export default Peers;
