from rest_framework import serializers

from books.models import Book, Member, BookStatus


class MemberSerializer(serializers.ModelSerializer):
    borrowed_book_list = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = ['id', 'member', 'email', 'borrowed_book_list']

    def get_borrowed_book_list(self, obj):
        book_last = BookStatus.objects.filter(
            member=obj.id).filter(returned=False).all()
        book_borrowed_pks = book_last.values_list('book_id', flat=True)
        books_qs = Book.objects.filter(pk__in=book_borrowed_pks)
        title_list = [book.title for book in books_qs
                      ]

        if book_last:
            return title_list

        return None


class BookStatusSerializer(serializers.ModelSerializer):
    borrowed_member = serializers.SerializerMethodField()

    class Meta:
        model = BookStatus
        fields = ['id', 'book', 'member', 'returned', 'borrowed_member']

    def get_borrowed_member(self, obj):
        member_borrowed = obj.member
        if member_borrowed:
            member_borrowed_serializer = MemberSerializer(member_borrowed)
            return member_borrowed_serializer.data
        else:
            return None


class BookSerializer(serializers.ModelSerializer):
    borrowed_by = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'genre', 'author',
                  'availability_status', 'isbn', 'borrowed_by']

    def get_borrowed_by(self, obj):
        borrowed_book = BookStatus.objects.filter(book=obj.id).last()
        if borrowed_book:
            borrowed_book_serializer = BookStatusSerializer(borrowed_book)
            return borrowed_book_serializer.data
        else:
            return None
