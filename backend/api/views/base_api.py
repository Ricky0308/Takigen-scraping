from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser
from rest_framework.decorators import api_view

# @api_view(['GET'])
# def is_valid_token(request):
#     if request.user != AnonymousUser:
#         Response(False)
#     elif request.user:
#         Response(True)