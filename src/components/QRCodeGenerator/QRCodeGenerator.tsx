import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import '../../styles/components/QRCodeGenerator.scss';

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (qrRef.current === null) return;

    toPng(qrRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr_register.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error al descargar el código QR:', error);
      });
  };

  return (
    <div className="qr-container-wrapper">
      <h3 className="qr-text">Escanea para registrarte</h3>
      <div ref={qrRef} className="qr-container">
        <QRCodeCanvas 
          value={url} 
          size={250} 
          fgColor="#007A8C" 
          bgColor="#FFFFFF" 
          level="H"
        />
      </div>
      <button onClick={handleDownload} className="qr-button">
        Descargar QR
      </button>
    </div>
  );
};

export default QRCodeGenerator;
