from django.contrib import admin
from django.urls import path
from backend.views import (
    GithubOAuth,
    TestEndPoint,
    PageValidation,
    SearchPage,
    GithubRepositoryList,
    ProjectView,
    ListProject,
    UserView,
    BookmarkView,
    ContributionView,
    NotificationView,
    SignOutView,
    FirebaseView,
)

urls = [
    path("", GithubOAuth.as_view(), name="GithubOAuth"),
    path("test-endpoint", TestEndPoint.as_view(), name="TestEndPoint"),
    path("page-validation", PageValidation.as_view(), name="PageValidation"),
    path("search-page", SearchPage.as_view(), name="SearchPage"),
    path(
        "fetch-project-list",
        GithubRepositoryList.as_view(),
        name="GithubRepositoryList",
    ),
    path("project", ProjectView.as_view(), name="ProjectView"),
    path("list-project", ListProject.as_view(), name="ListProject"),
    path("user-view", UserView.as_view(), name="UserView"),
    path("bookmark-view", BookmarkView.as_view(), name="BookmarkView"),
    path("contribution-view", ContributionView.as_view(), name="ContributionView"),
    path("notification-view", NotificationView.as_view(), name="NotificationView"),
    path("signout", SignOutView.as_view(), name="SignOutView"),
    path("firebase-view", FirebaseView.as_view(), name="FirebaseView"),
    
]
