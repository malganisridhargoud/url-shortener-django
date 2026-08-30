from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter

# urlpatterns = [
#     # path("",views.urlshort,name="home"),\
#     # path("",views.display_time,name="dislay-time"),
#     # path("<str:slugs>/",views.urlRedirect,name="redirect")
#     path('',views.book_display,name="book_display"),
#     path('book/<int:pk>/',views.book_detail,name="book_detail"),
#     path('book/new/',views.book_create,name = "book_create"),
#     path('book/<int:pk>/edit/',views.book_update,name="book_update"),
#     path('book/<int:pk>/delete/',views.book_delete,name="book_delete")

# ]

# urlpatterns = [
#     path('', views.BookListView.as_view(), name="book_display"),
#     path('book/<int:pk>/', views.BookDetailView.as_view(), name="book-detail"),
#     path('book/new/', views.BookCreateView.as_view(), name="book_create"),
#     path('book/<int:pk>/edit/', views.BookUpdateView.as_view(), name="book_update"),
#     path('book/<int:pk>/delete/', views.BookDeleteView.as_view(), name="book_delete"),
# ]

router = DefaultRouter()

router.register(r'books',views.BookViewSet,basename='book')

urlpatterns = [
    path('api/',include(router.urls))
]


