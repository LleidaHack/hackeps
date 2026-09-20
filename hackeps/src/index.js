const React = require("react");
const ReactDOM = require("react-dom/client");

// Bootstrap (CSS + icon font) is only needed by the full site. The waiting page
// styles itself with Tailwind, so we skip ~250 KB of render-blocking CSS and a
// webfont while REACT_APP_LAUNCH_PENDING is on.
// require() (not import) so these are evaluated *before* App's Tailwind sheet,
// keeping the same cascade order as before, and so webpack can drop them
// entirely when the condition folds to false at build time.
if (process.env.REACT_APP_LAUNCH_PENDING !== "1") {
  require("bootstrap/dist/css/bootstrap.css");
  require("bootstrap-icons/font/bootstrap-icons.css");
  // Font Awesome (menu, profile and sponsor icons) is appended here instead of
  // in index.html: the waiting page never downloads it, it does not block the
  // first paint, and there is no inline onload handler for the CSP to allow.
  const fontAwesome = document.createElement("link");
  fontAwesome.rel = "stylesheet";
  fontAwesome.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
  fontAwesome.integrity =
    "sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==";
  fontAwesome.crossOrigin = "anonymous";
  fontAwesome.referrerPolicy = "no-referrer";
  document.head.appendChild(fontAwesome);
}

const App = require("src/App.js").default;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  /* <React.StrictMode>*/
  React.createElement(App),
  /*</React.StrictMode>*/
);
