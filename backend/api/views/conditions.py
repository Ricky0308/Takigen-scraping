from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser
import re
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.models import Account
from conditions.models import ConditionCluster, Condition
from conditions.serializer import CondClusterSimpleSerializer
from accounts.models import Account
from .utils.conditions import modify_cond_dict

class CreateCondCluster(APIView):
    def post(self, request):
        conditions = request.data.get("conditions")
        cluster_name = request.data.get("cluster_name")
        target_url = request.data.get("company_url")
        search_site = request.data.get("search_site")
        if search_site == "マイナビ":
            prefix = "https://job.mynavi.jp"
            target_url
            if not re.match(prefix, target_url.strip(" ")):
                raise Exception("正しいURLではありません")
        if hasattr(request.user, "account"):
            new_cluster = ConditionCluster(name = cluster_name, account=request.user.account)
        else:
            new_cluster = ConditionCluster(name = cluster_name)
        new_cluster.save()
        for index, cond in enumerate(conditions):
            new_cond = {}
            for key, value in cond.items():
                if type(value) == list:
                    new_cond[key] = ",".join(value)
            new_cond_obj = Condition(condition = new_cond, order=index, cluster = new_cluster)
            new_cond_obj.save()
        return Response(new_cluster.id)

class CondClusterInfo(APIView):
    def get(self, request):
        """
        description: 
            ログインユーザーのみが使える、ConditionClusterを返すview。
            request.query_params["type"]によって返ってくる値が変化する。
            ①type=simple_list : アカウントが持っている全てのClusterのID+名前
            ②type=detail : 特定の一つのClusterの情報 + 付随する全てのCondition + csvデータ
                また, query_paramとしてidをとる
            ③type=list : ①に付加的な情報(付随するConditionの数など)がついたもの
        """
        allowed_types = ["simple_list", "detail", "list"]
        if request.query_params.get("type") not in allowed_types:
            return Response(False)

        if type(request.user) is not AnonymousUser:
            if request.query_params.get("type") == "simple_list":
                cond_clusters = ConditionCluster.objects.filter(account=request.user.account)
                serializer = CondClusterSimpleSerializer(cond_clusters, many=True)
                return Response(serializer.data)

            elif request.query_params.get("type") == "list":
                cond_clusters = ConditionCluster.objects.filter(account=request.user.account)
                return Response([cond.show_extended_info() for cond in cond_clusters])

        if request.query_params.get("type") == "detail":
            cluster_id = request.query_params.get("cluster_id")
            if not cluster_id or cluster_id == "false":
                return Response(False)
            cluster = ConditionCluster.objects.get(id = cluster_id)
            return Response(cluster.show_detail())

        return Response(False)


class CondClusterExistsOrNot(APIView):
    """
    description:
        idをparameterとして受け取り, 該当する誰にも所有されていないクラスターが存在すればTrueを
        そうでなければFalseを返す
    """
    def get(self, request):
        if request.query_params.get("id"):
            cluster_id = request.query_params.get("id")
            try:
                # セキュリティ向上のため, ConditionCluster.account == None のクラスターだけに限定する必要
                ConditionCluster.objects.get(id = cluster_id)
                return Response(True)
            except:
                return Response(False)
        return Response(False)
