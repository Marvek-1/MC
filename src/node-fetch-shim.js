const _fetch = typeof window !== 'undefined' ? window.fetch : null;
const _Headers = typeof window !== 'undefined' ? window.Headers : null;
const _Request = typeof window !== 'undefined' ? window.Request : null;
const _Response = typeof window !== 'undefined' ? window.Response : null;

export { 
  _fetch as fetch,
  _Headers as Headers,
  _Request as Request,
  _Response as Response
};

export default _fetch;
