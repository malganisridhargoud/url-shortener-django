# Create your views here.
from django.shortcuts import render, redirect
from .models import ShortenedURL
from django.http import HttpResponseRedirect

from django.core.cache import cache

# for redirection logic
# check if shortened url matches the long url and redirect to long url
def redirect_to_original(request, short_code):
    # Try to get from cache first
    long_url = cache.get(short_code)
    
    if not long_url:
        try:
            shortened_url = ShortenedURL.objects.get(short_code=short_code)
            long_url = shortened_url.long_url
            # Cache the result for 15 minutes (900 seconds)
            cache.set(short_code, long_url, timeout=900)
        except ShortenedURL.DoesNotExist:
            # Since we removed the templates, we can just return a 404 or a JSON response
            from django.http import HttpResponseNotFound
            return HttpResponseNotFound("Short URL not found")  
            
    return HttpResponseRedirect(long_url)  
