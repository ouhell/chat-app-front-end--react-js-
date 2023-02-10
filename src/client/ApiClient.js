const isdev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
export const HostName = isdev
  ? "http://localhost:5000"
  : window.location.origin;
console.log("Hostname", HostName);
