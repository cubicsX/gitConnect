from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponseRedirect
from backend.handler import (
    ExchangeCode,
    StoreUser,
    SearchPageHandler,
    GithubProjectList,
    ProjectHandler,
    UserHandler,
    BookmarkHandler,
    ContributionHandler,
    NotificationsHandler,
)
import json
import logging


class GithubOAuth(APIView):
    def get(self, request: Request):
        code = request.GET["code"]
        data = ExchangeCode.exchange_code(code)
        request.session["access_token"] = data["access_token"]
        # Update Or Create User Profile Data.
        # Store User object id
        user_object_id = StoreUser.fetch_and_crete_user_details()
        request.session["user_object_id"] = user_object_id
        return HttpResponseRedirect("http://localhost:3000")


class TestEndPoint(APIView):
    def get(self, request: Request):

        return Response()


class PageValidation(APIView):
    def post(self, request: Request):
        access_token = request.session.get("access_token", None)

        if access_token is None:
            return Response(
                data={
                    "status": "ERROR",
                    "message": "Don't have permission to view",
                }
            )
        else:
            return Response(data={"status": "OK"})


class SearchPage(APIView):
    def get(self, request: Request):
        search_query = request.GET["search_query"]
        projects = SearchPageHandler.create_and_fetch_search_details(
            search_query=search_query
        )
        return Response(data=projects)


class GithubRepositoryList(APIView):
    def get(self, request: Request):
        project_list = GithubProjectList.fetch_and_process_repo_list()
        return Response(data=project_list)


class ListProject(APIView):
    def get(self, request: Request):
        project_list = ProjectHandler.fetch_and_get_list_of_owner_project()

        return Response(data=project_list)


class ProjectView(APIView):
    def post(self, request: Request):
        data = json.loads(request.body)
        ProjectHandler.fetch_and_create_project_info(project_data=data)
        return Response()

    def put(self, request: Request):
        data = json.loads(request.body)
        ProjectHandler.fetch_and_update_project_info(project_data=data)
        return Response()

    def delete(self, request: Request):
        data = json.loads(request.body)
        ProjectHandler.fetch_and_remove_project(project_id=data)
        return Response()


class BookmarkView(APIView):
    def delete(self, request: Request):
        data = json.loads(request.body)
        BookmarkHandler.fetch_and_remove_bookmark_info(bookmark_dict=data)
        return Response()

    def post(self, request: Request):
        data = json.loads(request.body)
        BookmarkHandler.fetch_and_add_bookmark_info(bookmark_dict=data)
        return Response()


class ContributionView(APIView):
    def delete(self, request: Request):
        data = json.loads(request.body)
        ContributionHandler.fetch_and_remove_contribution_info(contribution_dict=data)
        return Response()

    def post(self, request: Request):
        data = json.loads(request.body)
        ContributionHandler.fetch_and_add_contribution_info(contribution_dict=data)
        return Response()


class UserView(APIView):
    def get(self, request: Request):
        user_id = request.GET.get("user_id", None)
        user_dict = UserHandler.fetch_and_create_user_info(user_id=user_id)
        return Response(data=user_dict)

    def put(self, request: Request):
        data = json.loads(request.body)
        UserHandler.fetch_and_update_user_info(user_info=data)
        return Response()


class NotificationView(APIView):
    def get(self, request: Request):
        data = NotificationsHandler.fetch_and_process_collabrations_and_contributions()
        return Response(data=data)

    def post(self, request: Request):
        data = json.loads(request.body)
        if data["status"] == "accept":
            NotificationsHandler.fetch_and_accept_colloboration_request(
                project_dict=data["data"]
            )
        elif data["status"] == "reject":
            NotificationsHandler.fetch_and_reject_colloboration_request(
                project_dict=data["data"]
            )
        return Response()


class SignOutView(APIView):
    def post(self, request: Request):
        logging.info(f"Removing all the session key so as to sign out user")
        del request.session["access_token"]
        del request.session["user_object_id"]
        return Response()


"""
    Future Requirements [@team]:
     - When user accept an incoming request show total number of user under that project .
"""