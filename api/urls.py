from django.urls import path

from .views import (BookListAPIView, BookRetrieveUpdateDestroyAPIView,
                    MemberListAPIView, MemberRetrieveUpdateDestroyAPIView, BookStatusUpdateAPIView, BookStatusListCreateAPIView, BookSearchApiView)


urlpatterns = [
    path('book-list/', BookListAPIView.as_view(), name='book-list'),
    path('book-list/<int:pk>/',
         BookRetrieveUpdateDestroyAPIView.as_view(), name='book-rud'),
    path('book-search/', BookSearchApiView.as_view(), name='book-search'),
    path('member-list/', MemberListAPIView.as_view(), name='member-list'),
    path('member-rud/', MemberRetrieveUpdateDestroyAPIView.as_view(), name='member-rud'),
    path('book-status/', BookStatusListCreateAPIView.as_view(),
         name='book-status-listcreate'),
    path('book-status/<int:pk>/', BookStatusUpdateAPIView.as_view(),
         name='book-status-update'),
]
