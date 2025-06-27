import React from 'react';
import { useParams } from 'react-router-dom';
import ReelHistoryComponent from './ReelHistoryComponent';

const ReelHistoryPage = () => {
  const { barcodeId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Reel Usage History for <span className="text-blue-600">{barcodeId}</span>
        </h2>
        <ReelHistoryComponent initialBarcode={barcodeId} />
      </div>
    </div>
  );
};

export default ReelHistoryPage;
