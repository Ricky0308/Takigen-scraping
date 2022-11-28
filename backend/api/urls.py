from django.urls import path

from api.views.experiments import Experiments
from api.views.scraping import Scraping
from api.views.conditions import CreateCondCluster, CondClusterInfo, CondClusterExistsOrNot
from api.views.api_test import ApiTest
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path("exp/", Experiments.as_view()),
    path("scrape/", Scraping.as_view()), 

    path("cluster/exists/", CondClusterExistsOrNot.as_view()),
    path("cluster/create/", CreateCondCluster.as_view()),
    path("cluster/list/", CondClusterInfo.as_view()),

    path("test/", ApiTest.as_view()), 
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
]
