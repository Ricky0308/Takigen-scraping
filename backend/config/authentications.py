from django.contrib.auth.models import AnonymousUser
from rest_framework import authentication
from rest_framework import exceptions

class AnonymousUserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth = authentication.get_authorization_header(request)
        auth = str(auth)
        token = str(auth.split(" ")[-1])

        # if not auth or auth[0].lower() != b'token':
        #     return None

        # if len(auth) == 1:
        #     msg = _('Invalid token header. No credentials provided.')
        #     raise exceptions.AuthenticationFailed(msg)
        # elif len(auth) > 2:
        #     msg = _('Invalid token header. Credentials string should not contain spaces.')
        #     raise exceptions.AuthenticationFailed(msg)

        # try:
        #     token = Token.objects.get(token=auth[1])
        # except Token.DoesNotExist:
        #     raise exceptions.AuthenticationFailed('No such token')

        if token == "undefined'":
            return (AnonymousUser(), "anonymoustoken")
        return None