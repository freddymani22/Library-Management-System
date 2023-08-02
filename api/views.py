from rest_framework import generics

from books.models import Book, Member, BookStatus
from .serializers import BookSerializer, MemberSerializer, BookStatusSerializer


class BookListAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class MemberListAPIView(generics.ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class MemberRetrieveUpdateDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class BookStatusUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = BookStatus.objects.all()
    serializer_class = BookStatusSerializer


class BookStatusListCreateAPIView(generics.ListCreateAPIView):
    queryset = BookStatus.objects.all()
    serializer_class = BookStatusSerializer


class BookSearchApiView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.GET.get('q')
        print(q)
        results = Book.objects.none()
        if q is not None:
            return Book.objects.search(query=q)
        return results
