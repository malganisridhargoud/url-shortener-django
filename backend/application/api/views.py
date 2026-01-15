from django.http import JsonResponse
from rest_framework.response import Response
# importing an api view decorator
# import permission_classes for private routing
from rest_framework.decorators import api_view, permission_classes
# import authenticated permission to check if the person is actually authenticated to view the private routes
from rest_framework.permissions import IsAuthenticated

# to customize our tokens
# in urls.py, we have used built-in views/functions to obtain  access/refresh token pair
# inorder to customize/encrypt things further into the token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# incase notes section is to be used
# import the serialized content
# from .serializers import NoteSerializer
# from ..models import Note

# inorder to customize the token, first we override
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # we have access to the user object, therefore we can encrypt user details that we prefer along with the token
        # accessing the super() such that we obtain the base token
        token = super().get_token(user)

        # Add custom claims
        # adding/encrypting username to our base token
        token['username'] = user.username

        return token

# after customizing the token, we again view/obtain it
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# function to return all the routes in the application using rest_framework Response and api_view decorator
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)

# incase a basic note retrieval is to be made
# function to serialize
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getNotes(request):
#     user = request.user
#     # notes = user.note_set.all()
#     notes = Note.objects.all()
#     serializer = NoteSerializer(notes, many=True)

#     return Response(serializer.data)

from .serializers import RegisterSerializer, ShortenedURLSerializer
from ..models import ShortenedURL
from rest_framework import status

@api_view(['POST'])
def register_user(request):
    """API Endpoint for user registration"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django_ratelimit.decorators import ratelimit

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='5/m', method='POST', block=False)
def create_short_url(request):
    """Create a new shortened URL for the logged-in user"""
    if getattr(request, 'limited', False):
        return Response(
            {"error": "Rate limit exceeded. Try again after 1 minute."}, 
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
        
    serializer = ShortenedURLSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        
        # Enforce limit of 3 URLs: Delete older ones
        user_urls = ShortenedURL.objects.filter(user=request.user).order_by('-created_at')
        if user_urls.count() > 3:
            # Get IDs of URLs to delete (skip the first 3)
            urls_to_delete = user_urls[3:]
            # Delete them
            for url in urls_to_delete:
                url.delete()
                
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_urls(request):
    """Get all shortened URLs for the logged-in user"""
    user = request.user
    urls = ShortenedURL.objects.filter(user=user).order_by('-created_at')
    serializer = ShortenedURLSerializer(urls, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_short_url(request, pk):
    """Delete a shortened URL"""
    try:
        url = ShortenedURL.objects.get(pk=pk, user=request.user)
        url.delete()
        return Response({"message": "URL deleted successfully"}, status=status.HTTP_200_OK)
    except ShortenedURL.DoesNotExist:
        return Response({"error": "URL not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)
