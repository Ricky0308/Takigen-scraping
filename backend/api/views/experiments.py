from rest_framework.response import Response
from rest_framework.views import APIView
from conditions.models import ConditionCluster


class Experiments(APIView):
    def get(self, request):
        obj_set = ConditionCluster.objects.filter(name__startswith="test")
        for i in obj_set:
            i.delete()
        return Response("")