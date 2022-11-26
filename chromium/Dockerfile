FROM python:3.8.14-bullseye

WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt

ENV DEBIAN_FRONTEND=noninteractive \
    DEBCONF_NONINTERACTIVE_SEEN=true

# install required packages and delete chache to make image lighter 
RUN apt-get -qqy update \
  && apt-get -qqy --no-install-recommends install \
    bzip2 \
    ca-certificates \
    openjdk-11-jre-headless \
    tzdata \
    sudo \
    unzip \
    wget \
    jq \
    curl \
    supervisor \
    gnupg2 \ 
    xvfb \
    pulseaudio \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* 

#=========
# fluxbox
# A fast, lightweight and responsive window manager
#=========
RUN apt-get update -qqy \
  && apt-get -qqy install \
    fluxbox \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# #==============
# # Xvfb
# #==============
RUN apt-get update -qqy \
  && apt-get -qqy install \
    xvfb \
    pulseaudio \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# # ENV LANG_WHICH en
# # ENV LANG_WHERE US
# # ENV ENCODING UTF-8
# # ENV LANGUAGE ${LANG_WHICH}_${LANG_WHERE}.${ENCODING}
# # ENV LANG ${LANGUAGE}
# # # Layer size: small: ~9 MB
# # # Layer size: small: ~9 MB MB (with --no-install-recommends)
# # RUN apt-get -qqy update \
# #   && apt-get -qqy --no-install-recommends install \
# #     #language-pack-en \
# #     tzdata \
# #     locales \
# #   && locale-gen ${LANGUAGE} \
# #   && dpkg-reconfigure --frontend noninteractive locales \
# #   && apt-get -qyy autoremove \
# #   && rm -rf /var/lib/apt/lists/* \
# #   && apt-get -qyy clean

RUN echo "deb http://deb.debian.org/debian/ sid main" >> /etc/apt/sources.list \
  # && apt-get -qqy install chromium=106.0.5249.119 \
  && apt-get update -qqy \
  && apt-get -qqy install chromium \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

COPY wrap_chromium_binary /opt/bin/wrap_chromium_binary
RUN chmod 777 /opt/bin/wrap_chromium_binary \
    && /opt/bin/wrap_chromium_binary

#============================================
# Chromium webdriver
#============================================
RUN apt-get update -qqy \
  && apt-get -qqy install chromium-driver \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

ENV DISPLAY 1
# CMD "Xvfb :1 -screen 0 1024x768x24"
# RUN echo "chromium" > /opt/selenium/browser_name

# # command
# # docker image build -t chromium-test .
# # docker container run --rm -it -v $PWD/../python_files/:/app --name chromium-test chromium-test
# # docker exec -it chromium-test bash
# # docker image rm chromium-test
CMD "/bin/bash"

#==============================================================================================

#command
# docker container run --rm -it -v $PWD/python_files/:/app --name standalone-chrome selenium/standalone-chrome


