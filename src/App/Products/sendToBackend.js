import { readAndCompressImage } from 'browser-image-resizer';
import { db, storage } from '../../Firebase/index';
import { getMostRecentImage } from './functionsUploadImages';

const sendToBackend = async ({
  setIsSubmitting,
  setIsSubmitted,
  setBrand,
  states,
  brand,
  brandsAndTrends,
  filesList,
  setPictures,
  setFiles,
  dispatch,
  thumbPhoto,
  setThumbPhoto,
  priceTag = 'Não',
  setOpenToast,
  setMessageToast,
  setTypeOfToast,
  cartId,
  onCartPress,
  setLocation
}) => {
  setIsSubmitting(true);
  const uploadImages = await Promise.all(
    filesList.map(async file => {
      console.log('file', file);
      try {
        if (file.size === 0) throw 'Empty sized image';
        const timestamp = Date.now();
        //const compressed = await readAndCompressImage(file, { quality: 0.65 });
        const image = storage.child(`${brand}/${brand}-${timestamp}-${file.name}`);
        const uploadTask = await image.put(file);
        const url = await uploadTask.ref.getDownloadURL();

        const docRef = await db.collection('catalog-images').add({
          availableQuantities: states[`availableQuantities${file.identifierOfPicture}`] ? states[`availableQuantities${file.identifierOfPicture}`] : '',
          price: states[`price${file.identifierOfPicture}`] ? states[`price${file.identifierOfPicture}`] : '',
          description: states[`description${file.identifierOfPicture}`] ? states[`description${file.identifierOfPicture}`] : '',
          referenceId: states[`referenceId${file.identifierOfPicture}`] ? states[`referenceId${file.identifierOfPicture}`] : '',
          brandName: brand,
          discount: states[`discount${file.identifierOfPicture}`] ? states[`discount${file.identifierOfPicture}`] : '',
          status: 'available',
          url,
          timestamp,
          pricetag: 'Não',
          photoPeriod: 'Nova',
          bucket: `${Math.floor(Math.random() * (300 - Number.MIN_VALUE))}`, // will be used to fetch random images on front-end
        });
        console.log('docRef.id,brand',docRef.id,brand)
        if(cartId)onCartPress(docRef.id,brand,'available')
        console.log('added new image file',file)
        try {
            if(thumbPhoto.identifierOfPicture ===file.identifierOfPicture){

                if (priceTag === 'Sim') {
                  await db.collection('catalog-brands').doc(brand).set(
                    {
                      brand,
                      updatedAt: timestamp,
                      updatedLoggedThumb: url,
                      trends: [],
                    },
                    { merge: true },
                  );
                } else if (url && timestamp) {
                  await db.collection('catalog-brands').doc(brand).set(
                    {
                      brand,
                      updatedThumb: url,
                      updatedAt: timestamp,
                      updatedLoggedThumb: url,
                      trends: [],
                    },
                    { merge: true },
                  );
                }

            }
            console.log('segundo try');

          } catch (error) {
            console.log(error);
            //setIsSubmitting(false);
            setTypeOfToast('warning');
            setMessageToast('Erro no envio das fotos');
            setOpenToast(true);
          }
        return [url, timestamp, file.identifierOfPicture];
      } catch (error) {
        console.log(error);
        setIsSubmitting(false);
      }
    }),
  );

  setIsSubmitting(false);
  setIsSubmitted(true);
  //setBrand('');
  setPictures([]);
  setFiles([]);
  setThumbPhoto('');
  const payload = { userValue: '', identifierOfPicture: '', inputType: 'clear' };
  dispatch(payload);
  setTypeOfToast('alert');
  setMessageToast('Enviado com sucesso');
  setOpenToast(true);
  if(cartId)setLocation(`/pedidos/${cartId}`)
};

export default sendToBackend;
