from rest_framework.views import APIView
from rest_framework.response import Response
from conditions.models import ConditionCluster
from selenium import webdriver

from scraping.utils import scraping

# Create your views here.
class ApiTest(APIView):
    def get(self, request):
        return Response('From backend! (GET reqeust)')

    def post(self, request):
        cluster = ConditionCluster.objects.get(id = request.data.get("condCluster"))
        condition_obj = cluster.condition_set.all()[0]
        condition_dict = dict(condition_obj.search_dict())
        print(f"condition : {condition_dict}")
        driver = webdriver.Chrome('/Users/ricky/dev/scraping/drivers/chromedriver')
        success, data = scraping.scrape_mynavi("タキゲン製造(株)", condition_dict, driver)
        return Response('From backend! (POST reqeust)')
