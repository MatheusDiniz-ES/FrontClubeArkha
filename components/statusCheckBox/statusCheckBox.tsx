import React, { useState } from 'react';
import { IoMdPower } from 'react-icons/io';
import clsx from 'clsx';

const StatusCheckbox = ({ row, rowID, desativar, ativar, mudarParaTeste }: any) => {
  const [selectedStatus, setSelectedStatus] = useState(row);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = async (status: any) => {
    if (status === 'Inativo') {
      await desativar(rowID);
    } else if (status === 'Ativo') {
      await ativar(rowID);
    } else {
      await mudarParaTeste(rowID);
    }
    setIsDialogOpen(false);
  };

  return (
<div className="flex items-center gap-4">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center justify-start rounded-none gap-4 transition-colors duration-300 py-4 px-6 hover:bg-gray-300 hover:text-gray-700 cursor-pointer disabled:cursor-not-allowed border-none bg-transparent"
      >
        <IoMdPower className="w-5 h-5" />
        Alterar status
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white w-[500px] mx-auto p-6 dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Alterar Status</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-4 w-full border rounded bg-white dark:bg-gray-750 dark:text-gray-300 dark:border-gray-600 mb-4"
            >
              <option value="Teste">Teste</option>
              <option value="Inativo">Inativo</option>
              <option value="Ativo">Ativo</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="py-2 px-4 border rounded bg-transparent text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await handleStatusChange(selectedStatus);
                }}
                className={clsx(
                  'py-2 px-4 border rounded text-white',
                  selectedStatus === 'Ativo' ? 'bg-green-500 hover:bg-green-700' :
                  selectedStatus === 'Inativo' ? 'bg-red-500 hover:bg-red-700' :
                  'bg-yellow-500 hover:bg-yellow-700'
                )}
              >
                Sim, desejo {selectedStatus === 'Ativo' ? 'Ativar' : selectedStatus === 'Inativo' ? 'Inativar' : 'mudar para teste'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheckbox;
