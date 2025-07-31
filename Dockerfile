# Stage 1: Use official nginx image
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy your app files to nginx public folder
COPY . /usr/share/nginx/html

# Expose port 8080 for the container
EXPOSE 8080

# Override nginx default port from 80 to 8080:
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
