const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 8000;

const basePath =
  "https://vercel-cloud-bucket.s3.ap-south-1.amazonaws.com/__outputs";

// Proxy middleware
const s3Proxy = createProxyMiddleware({
  target: basePath,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    const hostname = req.hostname;
    const subdomain = hostname.split(".")[0];
    return `/${subdomain}${path}`; // Rewrite path for S3
  },
  onProxyReq: (proxyReq, req, res) => {
    // Ensure index.html is served if no file is specified
    if (req.url === "/") {
      proxyReq.path += "index.html";
    }

    // Add necessary headers for S3 access
    proxyReq.setHeader("Host", "vercel-cloud-bucket.s3.ap-south-1.amazonaws.com");
    proxyReq.setHeader("Origin", "*"); // Allow CORS
  },
});

app.use("/", s3Proxy);

app.listen(PORT, () =>
  console.log(`Reverse Proxy Running on Port ${PORT}`)
);
