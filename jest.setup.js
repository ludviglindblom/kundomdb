import "@testing-library/jest-dom";

// Polyfill for Next.js Web APIs
if (typeof Request === "undefined") {
  global.Request = class Request {};
}
if (typeof Response === "undefined") {
  global.Response = class Response {};
}
if (typeof Headers === "undefined") {
  global.Headers = class Headers {};
}
