FROM --platform=arm64 seleniarm/standalone-chromium

# for Chrome installation
# RUN sudo mkdir /var/lib/apt/lists/partial \
#     && sudo apt update -y \
#     && sudo apt install -y python3-pip\
#     && sudo apt install -y redis

# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get install -y tzdata
# ENV DEBIAN_FRONTEND=interactive
# RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i google-chrome-stable_current_amd64.deb
# RUN apt -f install -y

WORKDIR /app
RUN echo $PWD 
COPY /Users/ricky/dev/Scraping/Takigen-scraping/docker/celery/requirements.txt /app
RUN pip install -r requirements.txt
USER 1200

# CMD "python -m celery -A config worker -l info"
CMD "/bin/bash"

# command
# cd /Users/ricky/dev/Scraping/Takigen-scraping/backend/
# docker image build -f ../docker/celery/Dockerfile -t celery-worker:latest .
# backend_path=/Users/ricky/dev/Scraping/Takigen-scraping/backend/
# docker container run --rm -it -v $backend_path:/app --name celery-worker celery-worker:latest

#=========================

# compose 使わない時にネットワークを明示的に指定
# docker container run --rm -it --net bridge -v /dev/shm:/dev/shm $PWD:/app --name recruit-power recruit-power:latest

# driver用
# docker container run --rm -it --net bridge -v /dev/shm:/dev/shm -v $PWD/python_files/:/app -p 4444:4444 --name driver seleniarm/standalone-chromium:latest
# docker container run --rm -it --net bridge -v /dev/shm:/dev/shm -p 4444:4444 --name driver selenium/standalone-chrome
# driver (マウントしない)
# docker container run --rm -it --net bridge -p 4444:4444 --name driver seleniarm/standalone-chromium:latest