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
        c = ConditionCluster.objects.get(name="test-a")
        tmp_file = c.data.csv.file.file
        fiftn_a = ["あ, い" for i in range(15)]
        fiftn_a[5] = "100"
        fiftn_a[10] = None
        fiftn_a[3] = "True"
        fiftn_l = ",".join(map(converter, fiftn_a)) + "\n"
        
        s3 = boto3.resource('s3')
        file = s3.Object(settings.AWS_STORAGE_BUCKET_NAME, f"csv_files/{str(c.data.csv)}")
        s = file.get().get("Body").read().decode("utf-8")
        # bucket = s3.Bucket(settings.AWS_STORAGE_BUCKET_NAME)
        # bucket.Object(f"csv_files/{str(c.data.csv)}").download_file(f"csv_tmp/{c.data.csv}")
        try:
            bs = file.get().get("Body").read()
            s = file.get().get("Body").read().decode("utf-8")
            double = s + fiftn_l 

            # print(double.split("\n")[-2])
            # print(lst)
            # print(lst.decode("utf-8"))
            file.put(Body=double)
        except BaseException as e:
            print(e)
            print("except")
            # print(str(file.get().get("Body").read()))
        return Response("")