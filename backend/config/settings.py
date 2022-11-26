"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
import os
import datetime
import environ

env = environ.Env()
environ.Env.read_env()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

ALLOWED_HOSTS = [
    "HR-friend-LB-122647274.ap-northeast-1.elb.amazonaws.com"
]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api",
    "data", 
    "logs", 
    "accounts", 
    "conditions",
    "scraping",
    "config", 
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    # for local 
    # "default": {
    #     "ENGINE": "django.db.backends.mysql",
    #     "NAME": "scraping",
    #     "USER": "root",
    #     "PASSWORD": env("DB_PASS_LOCAL"),
    # }
    # for deploy
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "main",
        "USER": env("DB_USER_DEPLOY"),
        "PASSWORD": env("DB_PASS_DEPLOY"),
        "HOST" : env("DB_URL_DEPLOY"),
        "PORT" : "3306"
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

# デプロイ時にstatifilesをweb上で表示するためのurl
STATIC_URL = "static/"

# fileが保存されるサーバ上のパス
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST_FRAMEWORK
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        # 'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [ 
        "config.authentications.AnonymousUserAuthentication",
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}

# Cookieの設定
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': datetime.timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': datetime.timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'UPDATE_LAST_LOGIN': True,
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Celery 
# CELERY_BROKER_URL = "redis://localhost:6379"

from kombu.utils.url import safequote
aws_access_key = safequote(env("AWS_ACCESS_KEY"))
# aws_access_key = safequote("AKIAVX3DKFPIAYUZTLAB") #fake
aws_secret_key = safequote(env("cvepFGN66SqqURXqJEvPLOAjAAR34DS3WNEQXTX6"))
CELERY_BROKER_URL = "sqs://{aws_access_key}:{aws_secret_key}@".format(
    aws_access_key=aws_access_key, aws_secret_key=aws_secret_key,
)
CELERY_DEFAULT_QUEUE = "myQ"
CELERY_BROKER_TRANSPORT_OPTIONS = {
    'predefined_queues': {
        'celery': {
            'url': env("BROKER_URL"),
            'access_key_id': aws_access_key,
            'secret_access_key': aws_secret_key,
        }
    }
}
# CELERY_RESULT_BACKEND = "redis://172.17.0.5:6379"
