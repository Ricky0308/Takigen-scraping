from rest_framework.response import Response
from rest_framework.views import APIView
from conditions.models import ConditionCluster
from django.conf import settings
import boto3
import pandas as pd


def converter(elem):
    if type(elem) == str:
        return f'"{elem}"'
    elif elem == None:
        return ""
    else:
        return str(elem)

class Experiments(APIView):
    def get(self, request):
        c = ConditionCluster.objects.get(name="test-WWY")
        c.get_target_str()
        return Response("")