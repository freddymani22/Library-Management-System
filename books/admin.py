from django.contrib import admin

# Register your models here.
from .models import Book, Member, BookStatus


class BookAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']


class BookStatusAdmin(admin.ModelAdmin):
    list_display = ['id', 'returned']
    search_fields = ['title']
# class BorrwedBookAdmin(admin.ModelAdmin):
#     list_display = ['book', 'member']
#     search_fields = ['book', 'member']
#     raw_id_fields = ['book', 'member']


admin.site.register(Book, BookAdmin)
admin.site.register(Member)
# admin.site.register(BorrowedBook, BorrwedBookAdmin)
# admin.site.register(ReturnedBook)
admin.site.register(BookStatus, BookStatusAdmin)
