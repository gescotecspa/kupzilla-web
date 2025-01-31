import { useEffect } from 'react';
import Loader from '../Loader/Loader';

const RedirectToAppStore = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // Enlace para Google Play y App Store
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.camaradeturismocobquecura.CobquecurApp';
    const appStoreUrl = 'https://apps.apple.com/app/colocarAppleIdCorrespondiente';

    // Detecta si es un dispositivo Android o iOS
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    if (isAndroid) {
      // Redirigir a Google Play en Android
      window.location.href = playStoreUrl;
    } else if (isIOS) {
      // Redirigir a App Store en iOS
      window.location.href = appStoreUrl;
    } else {
      // Si no es Android ni iOS, redirigir a una URL genérica (opcional)
      window.location.href = 'https://www.cobquecurapp.cl';
    }

    // Agregar un tiempo de espera para permitir que la app se abra (fallback en caso de no abrirse)
    const timeout = setTimeout(() => {
      if (isAndroid) {
        window.location.href = playStoreUrl;
      } else if (isIOS) {
        window.location.href = appStoreUrl;
      }
    }, 2000);

    // Limpiar el timeout si se redirige antes
    return () => clearTimeout(timeout);
  }, []);

  return <Loader />;
};

export default RedirectToAppStore;
