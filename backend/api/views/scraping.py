from rest_framework.views import APIView
from rest_framework.response import Response
from selenium import webdriver
from scraping.tasks  import scrape_condition
from conditions.models import Condition, ConditionCluster

class Scraping(APIView):
    def post(self, request):
        cluster_id = request.data.get("clusterId")
        cluster = ConditionCluster.objects.get_or_none(id = cluster_id)
        # print(request.user.account)
        if cluster.in_progress == True:
            return Response(False)
        if cluster.account == None:
            scrape_condition.delay(cluster_id)
        elif hasattr(request.user, "account") and cluster.account == request.user.account:
            scrape_condition.delay(cluster_id)
        return Response(True)


