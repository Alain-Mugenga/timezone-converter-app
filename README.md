Timezone Converter \& World Clock App



A lightweight web application that lets users convert time across different time zones using the [TimeZoneDB API](https://timezonedb.com/api).



---



Docker Image Details



Docker Hub Repo: [https://hub.docker.com/r/alainmugenga1/timezone-app](https://hub.docker.com/r/alainmugenga1/timezone-app)

Image Name: `alainmugenga1/timezone-app`
Tags Used:

&nbsp; - `v1` — initial version

&nbsp; - `latest` — points to latest stable







Build Instructions (Locally)



If you'd like to build the image locally:





From the project root

docker build -t alainmugenga1/timezone-app:v1 .

 Run Instructions

Web Servers (Web01 \& Web02)

Use the following command on each web server:


For web-01


docker run -d --name web-01 --restart unless-stopped -p 8080:8080 alainmugenga1/timezone-app:v1

For Web-02

docker run -d --name web-02 --restart unless-stopped -p 8080:8080 alainmugenga1/timezone-app:v1

Each instance runs on port 8080.



You can verify they are running:




docker ps

Load Balancer (HAProxy) Configuration

HAProxy Config Snippet (haproxy.cfg):

cfg



frontend http-in

&nbsp;   bind \*:80

&nbsp;   default\_backend webapps



backend webapps

&nbsp;   balance roundrobin

&nbsp;   server web01 172.17.0.2:8080 check

&nbsp;   server web02 172.17.0.3:8080 check

Replace 172.17.0.2 and 172.17.0.3 with the actual IPs of your running containers.



Reload HAProxy:

docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'



Testing \& Verification

Load Balancing Test:

Run the following several times:



curl http://localhost

You should observe different responses (e.g., container ID or hostname) alternating — confirming round-robin balancing.



API Used

TimeZoneDB API



Docs: https://timezonedb.com/api



Used for fetching timezone data and conversions.



Challenges Faced

Networking Setup: Ensuring the containers could communicate with HAProxy internally required correct inspection of IPs using docker inspect.



Accessing from Host: Adjusting port mapping so all instances were reachable via localhost.



HAProxy Container: Needed to correctly reload config inside the container without restarting the service.



Acknowledgments

Special thanks to the TimeZoneDB team for providing a reliable API.



Docker and HAProxy communities for open documentation and support.



Author

Alain Mugenga

DockerHub: alainmugenga1





