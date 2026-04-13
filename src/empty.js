export default {};
export const FormData = typeof window !== 'undefined' ? window.FormData : null;
export const formDataToBlob = () => null;
export const File = typeof window !== 'undefined' ? window.File : null;
export const Blob = typeof window !== 'undefined' ? window.Blob : null;
export const Headers = typeof window !== 'undefined' ? window.Headers : null;
export const Request = typeof window !== 'undefined' ? window.Request : null;
export const Response = typeof window !== 'undefined' ? window.Response : null;
export const fetch = typeof window !== 'undefined' ? window.fetch : null;
