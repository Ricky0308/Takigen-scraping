FROM selenium/standalone-chrome:latest

USER 0
# RUN gpasswd -a seluser root

# for Chrome installation
RUN sudo mkdir /var/lib/apt/lists/partial \
    && sudo apt update -y \
    && sudo apt install -y python3-pip\
    && sudo apt install -y redis\
    && sudo apt install -y libcurl4-openssl-dev\
    && sudo apt install -y libssl-dev\
    && sudo apt install -y mysql-client

RUN sudo apt install -y mysql-server\
    && sudo apt install -y libmysqlclient-dev

# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get install -y tzdata
# ENV DEBIAN_FRONTEND=interactive
# RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i google-chrome-stable_current_amd64.deb
# RUN apt -f install -y

WORKDIR /app
RUN echo $PWD 
COPY requirements.txt /app
COPY start_worker.sh /opt/bin/start_worker.sh
RUN sudo chmod 777 /opt/bin/start_worker.sh
RUN --mount=type=cache,target=/Users/ricky/Library/Caches/pip pip install -r requirements.txt
RUN pip install "celery[sqs]"
RUN pip install boto3
RUN pip install pycurl~=7.44.1
RUN pip install pymysql
COPY . /app

# CMD "python3 -m celery -A config worker -l info"
# CMD python3 -m celery -A config worker -l info
CMD python3 manage.py runserver 0.0.0.0:8000

# command
# docker image build -t celery-worker:latest .
# backend_path=/Users/ricky/dev/Scraping/Takigen-scraping/backend/
# docker container run --rm -it -v $backend_path:/app --name celery-worker celery-worker:latest
# docker image rm -f celery-worker

# command multiarchitect 
# docker buildx build --push --platform=linux/arm64,linux/amd64 -t <AWS ECR tag name> .
# celery-worker 
# docker buildx build --push --platform=linux/arm64,linux/amd64 -t public.ecr.aws/j1q2i1c5/hr-celerr-worker:latest .
# backend 
# docker buildx build --push --platform=linux/arm64,linux/amd64 -t public.ecr.aws/j1q2i1c5/hr-backend-repo .

# command for backend 
# docker image build -t scraping-backend .
# backend_path=/Users/ricky/dev/Scraping/Takigen-scraping/backend/
# docker container run --rm -it -v $backend_path:/app --name scraping-backend -p 8000:8000 scraping-backend:latest
# docker image rm -f scraping-backend


#=========================

# compose 使わない時にネットワークを明示的に指定
# docker container run --rm -it --net bridge -v /dev/shm:/dev/shm $PWD:/app --name recruit-power recruit-power:latest

# driver用
# docker container run --rm -it --net bridge -v /dev/shm:/dev/shm -v $PWD/python_files/:/app -p 4444:4444 --name driver seleniarm/standalone-chromium:latest
# docker container run --rm -it --net bridge -v /dev/shm:/dev/shm -p 4444:4444 --name driver selenium/standalone-chrome
# driver (マウントしない)
# docker container run --rm -it --net bridge -p 4444:4444 --name driver seleniarm/standalone-chromium:latest


# ==========================

# docker container run --rm -it --name chrome selenium/standalone-chrome:latest
# docker container exec -it chrome bin/bash