from django.urls import path

from .views import index, books_view, member_view

urlpatterns = [
    path('', index, name='home'),
    path('books/', books_view, name='books'),
    path('members/', member_view, name='members')
]
