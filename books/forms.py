from django import forms

from .models import Book, Member


class BookCreationForm(forms.ModelForm):

    class Meta:
        model = Book
        fields = ['title', 'author', 'genre', 'isbn']


class MemberCreationForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = '__all__'


# class BookBorrowedForm(forms.ModelForm):
#     book = forms.ModelChoiceField(
#         queryset=Book.objects.filter(availability_status=True))

#     class Meta:
#         model = BorrowedBook
#         fields = ['book', 'member']


# class BookReturnedForm(forms.ModelForm):
#     class Meta:
#         model = ReturnedBook
#         fields = '__all__'
