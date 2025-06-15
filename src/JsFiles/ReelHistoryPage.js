import React from 'react';
import { useParams } from 'react-router-dom';
import ReelHistoryComponent from './ReelHistoryComponent';

const ReelHistoryPage = () => {
    const { barcodeId } = useParams();
    
    return (
        <div className="reel-history-page">
            <h2>Reel Usage History for {barcodeId}</h2>
            <ReelHistoryComponent initialBarcode={barcodeId} />
        </div>
    );
};

export default ReelHistoryPage;