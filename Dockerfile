# ─── InfraDev Static Website ───────────────────────────────────────────────
# Serves the static site with nginx (alpine for minimal image size)
FROM nginx:1.27-alpine

# Remove default nginx placeholder content
RUN rm -rf /usr/share/nginx/html/*

# Copy site files
COPY index.html        /usr/share/nginx/html/index.html
COPY robots.txt        /usr/share/nginx/html/robots.txt
COPY site.webmanifest  /usr/share/nginx/html/site.webmanifest
COPY .well-known/      /usr/share/nginx/html/.well-known/
COPY data/             /usr/share/nginx/html/data/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
