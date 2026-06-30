// Tiny dependency-free healthcheck for Docker/docker-compose, avoiding a
// reliance on curl/wget being present in the slim runtime image.
const port = process.env.PORT ?? '80';

fetch(`http://127.0.0.1:${port}/api/health`)
  .then((res) => {
    process.exit(res.ok ? 0 : 1);
  })
  .catch(() => {
    process.exit(1);
  });
