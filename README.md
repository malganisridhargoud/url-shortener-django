#Day-1
Basic short URL Converter using:

1.forms
2.views
3.models
4.urls

1.forms - creates a form for storing urls
2.views - logic to generate random string - ascii
3.models - database structure to store urls - original and short
4.urls - routes to the page 

#Day-2
Library - CRUD App

1.Used DRF - DefaultRouter in urls.py , viewsets in views.py , serializers
2.created a frontend folder - index.html,style.css,script.js
3.connected frontend and backend using:
   1.django-cors-headers : place in installed apps,allow_cors_origins = true
   2.used fetch for frontend to fetch the json response and loop through the data
   3.print data in the html div tags by relacing innerHtml.

requirements - django-rest-framework,django-cors-headers
