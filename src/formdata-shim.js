const _FormData = typeof window !== 'undefined' ? window.FormData : null;
const _File = typeof window !== 'undefined' ? window.File : null;
const _Blob = typeof window !== 'undefined' ? window.Blob : null;

export { 
  _FormData as FormData,
  _File as File,
  _Blob as Blob
};

export const formDataToBlob = () => null;

export default _FormData;
