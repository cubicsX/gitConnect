import requests
import os
import json

from pymongo import MongoClient
from bson.objectid import ObjectId

from django_middleware_global_request.middleware import get_request

GITHUB_SECRET = os.environ.get("GITHUB_SECRET")
GITHUB_CLIENT_ID = os.environ.get("GITHUB_ID")

client = MongoClient("localhost", 27017)
user_collection = client["gitconnect"]["user"]
project_collection = client["gitconnect"]["project"]
search_collection = client["gitconnect"]["search"]
SEARCH_ID = ObjectId("603b9746eaebc306575fa974")


print(GITHUB_CLIENT_ID, GITHUB_SECRET)


class ExchangeCode:
    @staticmethod
    def exchange_code(code):
        response = requests.post(
            url="https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_SECRET,
                "code": code,
            },
            headers={"accept": "application/json"},
        )
        data = json.loads(response.content)
        return data


def get_access_token(request=None):
    if request is None:
        request = get_request()
    access_token = request.session["access_token"]
    print(access_token)
    return access_token


def get_user_object_id(request=None):
    if request is None:
        request = get_request()
    user_object_id = request.session["user_object_id"]
    return user_object_id


class StoreUser:
    @staticmethod
    def find_or_add_user(user_info=None):
        """
        find the user into user_collections.
        If user is not there then create one
        and return user `_id`.

        Args:
            user_info (dict): user_info contains following field,
                username (github)
                userid (github)
                email (github)
                avatar (github)
                githubURL (github)
                linkedinURL (additional_field)
                stackoverflowURL (additional_field)
                skills (additional_field)
                contributions (additional_field)
                bookmarks (additional_field)
                owner (additional_field)
                incoming (additional_field)
                outgoing (additional_field)
                notification_bucket (additional_field)

        Returns:
            [bson.object.ObjectId]: user_objectId
        """
        user_id = user_info["userid"]
        user = user_collection.find_one(filter={"userid": user_id})
        if user == None:
            user = user_collection.insert_one(user_info)
            return str(user.inserted_id)
        else:
            return str(user["_id"])

    @staticmethod
    def fetch_and_crete_user_details():
        user = GithubEndpointFetch.fetch_user()
        user_details = {
            "username": user["login"],
            "userid": user["login"],
            "email": "",
            "avatar": user["avatar_url"],
            "githubURL": user["html_url"],
            "linkedinURL": "",
            "stackoverflowURL": "",
            "skills": [],
            "contributions": [],
            "bookmarks": [],
            "owner": [],
            "incoming": [],
            "outgoing": [],
            "notification_bucket": [],
        }
        user_object_id = StoreUser.find_or_add_user(user_info=user_details)
        return user_object_id


class SearchPageHandler:
    @staticmethod
    def fetch_project(search_info):
        """
        fetch projects containing search_query in tags.
        final return dict contains two additional field
            1. bookmark
            2. contribution
        value of this fields is based on user's bookmarks and
        contributions.

        Args:
            search_info (dict):
                USER_ID (bson.object.ObjectId)
                search_query (string)

        Returns:
            project_list (list[:dict])
        """
        search = search_collection.find_one({"_id": SEARCH_ID})
        user = user_collection.find_one({"_id": search_info["USER_ID"]})
        user_bookmarks = user["bookmarks"]
        user_contributions = user["contributions"]
        user_outgoing = user["outgoing"]
        try:
            project_id_list = search[search_info["search_query"]]
        except KeyError:
            project_id_list = None
        except AttributeError:
            project_id_list = None
        if project_id_list != None:
            projects_list = list()
            for id in project_id_list:
                project = project_collection.find_one({"_id": id})
                if project == None:
                    continue
                if user_bookmarks == None:
                    project["bookmark"] = False
                else:
                    project["bookmark"] = True if id in user_bookmarks else False
                if user_outgoing == None:
                    project["contribution"] = False

                else:
                    project["contribution"] = True if id in user_outgoing else False
                projects_list.append(project)
            return projects_list
        else:
            return []

    @staticmethod
    def create_and_fetch_search_details(search_query: str):
        search_query = search_query.strip()
        search_info = {
            "USER_ID": ObjectId(get_user_object_id()),
            "search_query": search_query,
        }
        project_list = SearchPageHandler.fetch_project(search_info=search_info)
        for project in project_list:
            project["_id"] = str(project["_id"])
            project["owner"] = str(project["owner"])
        return project_list


class ProjectHandler:
    @staticmethod
    def add_project(project_info):
        """
        add new project to database as user is owner.
        add project ids to search_collection accroding to tags.

        Args:
            project_info (dict): project_info contains following,
                owner: USER_ID (bson.object.ObjectId)
                projectTitle (string)
                projectDescription (string)
                projectUrl (string)
                projectSkills (array)
                projectOpenings (integer)
        """
        project = project_collection.insert_one(project_info)
        user = user_collection.find_one({"_id": project_info["owner"]})
        list1 = user["owner"]
        list1.append(project.inserted_id)
        user_collection.find_one_and_update(
            {"_id": project_info["owner"]},
            {
                "$set": {
                    "owner": list1,
                }
            },
            upsert=False,
        )

        key = search_collection.find_one({"_id": SEARCH_ID})
        for skill in project_info["projectSkills"]:
            try:
                value_list = key[skill]
                value_list.append(project.inserted_id)
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID}, {"$set": {skill: value_list}}, upsert=False
                )
            except AttributeError:
                value_list = list()
                value_list.append(project.inserted_id)
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            skill: value_list,
                        }
                    },
                    upsert=False,
                )
            except KeyError:
                value_list = list()
                value_list.append(project.inserted_id)
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            skill: value_list,
                        }
                    },
                    upsert=False,
                )

    @staticmethod
    def update_project(project_info):
        """
        update project to database.
        alter search_database based on tags.

        Args:
            project_info (dict): project_info contains following,
                PROJECT_ID (bson.object.ObjectId)
                "projectUrl" (string)
                "projectTitle" (string)
                "projectDescription" (string)
                "projectOpenings" (array)
                "projectSkills" (integer)
        """
        old_skills = set(
            project_collection.find_one({"_id": project_info["_id"]})["projectSkills"]
        )
        new_skills = set(project_info["projectSkills"])
        add_to_search = list(new_skills - old_skills)
        remove_to_search = list(old_skills - new_skills)
        project_collection.find_one_and_update(
            {"_id": project_info["_id"]},
            {
                "$set": {
                    "projectUrl": project_info["projectUrl"],
                    "projectTitle": project_info["projectTitle"],
                    "projectDescription": project_info["projectDescription"],
                    "projectOpenings": project_info["projectOpenings"],
                    "projectSkills": project_info["projectSkills"],
                }
            },
            upsert=False,
        )
        search_data = search_collection.find_one({"_id": SEARCH_ID})
        for add in add_to_search:
            try:
                value_list = search_data[add]
                value_list.append(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            add: value_list,
                        }
                    },
                    upsert=False,
                )
            except AttributeError:
                value_list = list()
                value_list.append(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            add: value_list,
                        }
                    },
                    upsert=False,
                )
            except KeyError:
                value_list = list()
                value_list.append(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            add: value_list,
                        }
                    },
                    upsert=False,
                )
        for remove in remove_to_search:
            try:
                value_list = search_data[remove]
                value_list.remove(project_info["_id"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            remove: value_list,
                        }
                    },
                    upsert=False,
                )
            except:
                raise ValueError(
                    f"This is never gone be executed, find remove_tag {remove}"
                )

    @staticmethod
    def remove_project(project_info):
        old_skills = set(
            project_collection.find_one({"_id": project_info["PROJECT_ID"]})[
                "projectSkills"
            ]
        )
        remove_to_search = list(old_skills)
        project_collection.delete_one({"_id": project_info["PROJECT_ID"]})
        search_data = search_collection.find_one({"_id": SEARCH_ID})
        for remove in remove_to_search:
            try:
                value_list = search_data[remove]
                value_list.remove(project_info["PROJECT_ID"])
                search_collection.find_one_and_update(
                    {"_id": SEARCH_ID},
                    {
                        "$set": {
                            remove: value_list,
                        }
                    },
                    upsert=False,
                )
            except:
                raise ValueError(
                    f"This is never gone be executed, find remove_tag {remove}"
                )
        user_owner = user_collection.find_one({"_id": project_info["USER_ID"]})["owner"]
        user_owner.remove(project_info["PROJECT_ID"])
        user_collection.find_one_and_update(
            {"_id": project_info["USER_ID"]},
            {
                "$set": {
                    "owner": user_owner,
                }
            },
        )

    @staticmethod
    def fetch_and_remove_project(project_id):
        project_info = {
            "PROJECT_ID": ObjectId(project_id["_id"]),
            "USER_ID": ObjectId(get_user_object_id()),
        }
        ProjectHandler.remove_project(project_info=project_info)

    @staticmethod
    def get_user_project(user_id):
        user_owner = user_collection.find_one({"_id": user_id})["owner"]
        project_list = list()
        for id in user_owner:
            projets = project_collection.find_one({"_id": id})
            projets["_id"] = str(projets["_id"])
            projets["owner"] = str(projets["owner"])
            project_list.append(projets)
        return project_list

    @staticmethod
    def fetch_and_create_project_info(project_data):
        user_object_id = get_user_object_id()
        project_info = {
            "owner": ObjectId(user_object_id),
            "projectUrl": project_data["projectTitle"],
            "projectTitle": project_data["projectTitle"].split("/")[-1],
            "projectDescription": project_data["projectDescription"],
            "projectOpenings": project_data["projectOpenings"],
            "projectSkills": project_data["projectSkills"],
        }
        ProjectHandler.add_project(project_info=project_info)

    @staticmethod
    def fetch_and_get_list_of_owner_project():
        user_object_id = get_user_object_id()
        return ProjectHandler.get_user_project(user_id=ObjectId(user_object_id))

    @staticmethod
    def fetch_and_update_project_info(project_data):
        project_data["_id"] = ObjectId(project_data["_id"])
        project_data["owner"] = ObjectId(project_data["owner"])
        ProjectHandler.update_project(project_info=project_data)


class UserHandler:
    @staticmethod
    def fetch_user(user_id):
        """
        fuction returns user details of specified user_id.

        Args:
            user_id (bson.onject.ObjectId)

        Returns:
            dict: return dict contains following fields,
                username
                userid
                email
                avatar
                githubURL
                linkedinURL
                stackoverflowURL
                skills
                bookmarks
                contributions
        """
        user = user_collection.find_one({"_id": user_id})
        user_bookmarks = list()
        for project_id in user["bookmarks"]:
            project = project_collection.find_one({"_id": project_id})
            if project is None:
                continue
            bookmark_details = {
                "PROJECT_ID": str(project_id),
                "projectTitle": project["projectTitle"],
                "projectDescription": project["projectDescription"],
            }
            user_bookmarks.append(bookmark_details)
        user_contributions = list()
        for project_id in user["contributions"]:
            project = project_collection.find_one({"_id": project_id})
            if project is None:
                continue
            contribution_details = {
                "projectTitle": project["projectTitle"],
                "projectDescription": project["projectDescription"],
            }
            user_contributions.append(contribution_details)
        user_dict = {
            "username": user["username"],
            "userid": user["userid"],
            "email": user["email"],
            "avatar": user["avatar"],
            "githubURL": user["githubURL"],
            "linkedinURL": user["linkedinURL"],
            "stackoverflowURL": user["stackoverflowURL"],
            "skills": user["skills"],
            "bookmarks": user_bookmarks,
            "contributions": user_contributions,
        }
        return user_dict

    @staticmethod
    def update_user_profile(user_info):
        """
        update user profile based on user_id.

        Args:
            user_info (dict): user_info contains following field,
                USER_ID (bson.object.ObjectId)
                username (string)
                email (string)
                avatar (string)
                githubURL (string)
                linkedinURL (string)
                stackoverflowURL (string)
                skills (array)
        """
        user_id = user_info["USER_ID"]
        user_collection.find_one_and_update(
            {"_id": user_id},
            {
                "$set": {
                    "username": user_info["username"],
                    "email": user_info["email"],
                    "avatar": user_info["avatar"],
                    "githubURL": user_info["githubURL"],
                    "linkedinURL": user_info["linkedinURL"],
                    "stackoverflowURL": user_info["stackoverflowURL"],
                    "skills": user_info["skills"],
                }
            },
            upsert=False,
        )

    @staticmethod
    def fetch_and_create_user_info():
        user_object_id = ObjectId(get_user_object_id())
        user_dict = UserHandler.fetch_user(user_id=user_object_id)
        return user_dict

    @staticmethod
    def fetch_and_update_user_info(user_info):
        user_dict = {
            "USER_ID": ObjectId(get_user_object_id()),
            "username": user_info["username"],
            "email": user_info["email"],
            "avatar": user_info["avatar"],
            "githubURL": user_info["githubURL"],
            "linkedinURL": user_info["linkedinURL"],
            "stackoverflowURL": user_info["stackoverflowURL"],
            "skills": [item["imageText"] for item in user_info["skills"]],
        }
        UserHandler.update_user_profile(user_info=user_dict)


class ContributionHandler:
    @staticmethod
    def request_contribution(project_info):
        """
        user can request for contribution on project.
        after request, (user_id,project_id) details add in
        incoming list of project owner.

        Args:
            project_info (dict): contains following fields,
                USER_ID (bson.object.ObjectId)
                PROJECT_ID (bson.object.ObjectId)
                OWNER_ID (bson.object.ObjectId)
        """
        owner = user_collection.find_one({"_id": project_info["OWNER_ID"]})
        incoming_list = owner["incoming"]
        incoming_list.append(
            {
                "user_id": project_info["USER_ID"],
                "project_id": project_info["PROJECT_ID"],
            }
        )
        user_collection.find_one_and_update(
            {"_id": project_info["OWNER_ID"]},
            {
                "$set": {
                    "incoming": incoming_list,
                }
            },
            upsert=False,
        )
        user = user_collection.find_one({"_id": project_info["USER_ID"]})
        user_outgoing = user["outgoing"]
        user_outgoing.append(project_info["PROJECT_ID"])
        user_collection.find_one_and_update(
            {"_id": project_info["USER_ID"]},
            {
                "$set": {
                    "outgoing": user_outgoing,
                }
            },
            upsert=False,
        )

    @staticmethod
    def remove_contribution(project_info):
        """
        user can take back his contribution request.
        after take back request, user outgoing_list and
        project owner incoming_list is updated.

        Args:
            project_info (dict): contains following fields,
                USER_ID (bson.object.ObjectId)
                PROJECT_ID (bson.object.ObjectId)
                OWNER_ID (bson.object.ObjectId)
        """
        owner = user_collection.find_one({"_id": project_info["OWNER_ID"]})
        incoming_list = owner["incoming"]
        incoming_list.remove(
            {
                "user_id": project_info["USER_ID"],
                "project_id": project_info["PROJECT_ID"],
            }
        )
        user_collection.find_one_and_update(
            {"_id": project_info["OWNER_ID"]},
            {
                "$set": {
                    "incoming": incoming_list,
                }
            },
            upsert=False,
        )
        user = user_collection.find_one({"_id": project_info["USER_ID"]})
        user_outgoing = user["outgoing"]
        user_outgoing.remove(project_info["PROJECT_ID"])
        user_collection.find_one_and_update(
            {"_id": project_info["USER_ID"]},
            {
                "$set": {
                    "outgoing": user_outgoing,
                }
            },
            upsert=False,
        )

    @staticmethod
    def fetch_and_remove_contribution_info(contribution_dict):
        contribution_info = {
            "USER_ID": ObjectId(get_user_object_id()),
            "PROJECT_ID": ObjectId(contribution_dict["PROJECT_ID"]),
            "OWNER_ID": ObjectId(contribution_dict["OWNER_ID"]),
        }

        ContributionHandler.remove_contribution(project_info=contribution_info)

    @staticmethod
    def fetch_and_add_contribution_info(contribution_dict):
        contribution_info = {
            "USER_ID": ObjectId(get_user_object_id()),
            "PROJECT_ID": ObjectId(contribution_dict["PROJECT_ID"]),
            "OWNER_ID": ObjectId(contribution_dict["OWNER_ID"]),
        }

        ContributionHandler.request_contribution(project_info=contribution_info)


class BookmarkHandler:
    @staticmethod
    def handle_bookmark(user_id, project_id, status):
        """
        add or remove bookmark basedo on status.
        if status is `True` then add bookmark,
        else remove bookmark.

        Args:
            user_id (bson.object.ObjectId)
            project_id (bson.object.ObjectId)
            status (bool)
        """
        user = user_collection.find_one({"_id": user_id})
        bookmark_list = user["bookmarks"]
        if status:
            bookmark_list.append(project_id)
        else:
            bookmark_list.remove(project_id)
        user_collection.find_one_and_update(
            {"_id": user_id},
            {
                "$set": {
                    "bookmarks": bookmark_list,
                }
            },
            upsert=False,
        )

    @staticmethod
    def remove_bookmark(bookmark_info):
        """
        remove bookmark from user_bookmarks by removing
        project_id.

        Args:
            bookmark_info (dict):
                USER_ID (bson.object.ObjectId)
                PROJECT_ID (bson.object.ObjectId)
        """
        BookmarkHandler.handle_bookmark(
            bookmark_info["USER_ID"], bookmark_info["PROJECT_ID"], status=False
        )

    @staticmethod
    def add_bookmark(bookmark_info):
        """
        add PROJECT_ID to user bookmarks list.

        Args:
            bookmark_info (dict):
                USER_ID (bson.object.ObjectId)
                PROJECT_ID (bson.object.ObjectId)
        """
        BookmarkHandler.handle_bookmark(
            bookmark_info["USER_ID"], bookmark_info["PROJECT_ID"], status=True
        )

    @staticmethod
    def fetch_and_remove_bookmark_info(bookmark_dict):
        bookmark_info = {
            "USER_ID": ObjectId(get_user_object_id()),
            "PROJECT_ID": ObjectId(bookmark_dict["PROJECT_ID"]),
        }
        BookmarkHandler.remove_bookmark(bookmark_info=bookmark_info)

    @staticmethod
    def fetch_and_add_bookmark_info(bookmark_dict):
        bookmark_info = {
            "USER_ID": ObjectId(get_user_object_id()),
            "PROJECT_ID": ObjectId(bookmark_dict["PROJECT_ID"]),
        }

        BookmarkHandler.add_bookmark(bookmark_info=bookmark_info)


class GithubProjectList:
    @staticmethod
    def fetch_and_process_repo_list():
        repo_data_list = GithubEndpointFetch.fetch_repo_list()
        processed_list = []
        base_url = "https://github.com"
        for repo in repo_data_list:
            full_name = repo["full_name"]
            value = f"{base_url}/{full_name}"
            processed_list.append({"value": value, "label": full_name.split("/")[-1]})
        return processed_list


class GithubEndpointFetch:
    @staticmethod
    def fetch_user():
        access_token = get_access_token()
        response = requests.get(
            url="https://api.github.com/user",
            headers={
                "Authorization": "Bearer " + access_token,
                "accept": "application/json",
            },
        )
        data = json.loads(response.content)
        return data

    @staticmethod
    def fetch_repo_list():
        access_token = get_access_token()
        response = requests.get(
            url="https://api.github.com/user/repos",
            headers={
                "Authorization": "Bearer " + access_token,
                "accept": "application/json",
            },
        )
        data = json.loads(response.content)
        return data


class NotificationsHandler:
    @staticmethod
    def fetch_incoming(user_id):
        """
        fetch user incoming collbration requests.

        Args:
            user_id (bson.onject.ObjectId)

        Returns:
            (list):
                {
                    user (string)
                    requestedProject (string)
                }
        """
        user = user_collection.find_one({"_id": user_id})
        user_incomings = [] if user["incoming"] is None else user["incoming"]
        incomings_list = list()
        for item in user_incomings:
            requested_user_id = user_collection.find_one({"_id": item["user_id"]})[
                "userid"
            ]
            requested_project_name = project_collection.find_one(
                {"_id": item["project_id"]}
            )["projectTitle"]
            requested_project_id = project_collection.find_one(
                {"_id": item["project_id"]}
            )["_id"]
            requested_project_owner = project_collection.find_one(
                {"_id": item["project_id"]}
            )["owner"]
            incomings_list.append(
                {
                    "user": requested_user_id,
                    "requestedProject": requested_project_name,
                    "project_id": requested_project_id,
                    "project_owner": requested_project_owner,
                }
            )
        return incomings_list

    @staticmethod
    def fetch_outgoing(user_id):
        """
        fetch user outgoing contribution requests.

        Args:
            user_id (bson.onject.ObjectId)

        Returns:
            (list):
                {
                    status (string): set default to "Ongoing"
                    requestedProject (string)

                }
        """
        user = user_collection.find_one({"_id": user_id})
        user_outgoings = [] if user["outgoing"] is None else user["outgoing"]
        outgoings_list = list()
        for item in user_outgoings:
            print("Item _++++++______________", type(item))
            requested_project_name = project_collection.find_one({"_id": item})[
                "projectTitle"
            ]
            requested_project_id = project_collection.find_one({"_id": item})["_id"]
            requested_project_owner = project_collection.find_one({"_id": item})[
                "owner"
            ]
            outgoings_list.append(
                {
                    "status": "Ongoing",
                    "requestedProject": requested_project_name,
                    "project_id": requested_project_id,
                    "project_owner": requested_project_owner,
                }
            )
        return outgoings_list

    @staticmethod
    def accept_incoming(project_info):
        """
        accept user incoming contribution request.
        remove request from owner incoming_list.
        remove request from user outgoing_list.
        add project_id to user's contribution list
        and update user notification_bucket.

        Args:
            project_info (dict): contains following fields,
                USER_ID (bson.object.ObjectId)
                PROJECT_ID (bson.object.ObjectId)
                OWNER_ID (bson.object.ObjectId)
        """
        user = user_collection.find_one({"_id": project_info["USER_ID"]})
        contribution_list = user["contributions"]
        contribution_list.append(project_info["PROJECT_ID"])
        bucket = user["notification_bucket"]
        bucket.append(
            {
                "project_id": project_info["PROJECT_ID"],
                "status": "Accepted",
            }
        )
        user_outgoing = user["outgoing"]
        user_outgoing.remove(project_info["PROJECT_ID"])
        user_collection.find_one_and_update(
            {"_id": project_info["USER_ID"]},
            {
                "$set": {
                    "outgoing": user_outgoing,
                    "contributions": contribution_list,
                    "notification_bucket": bucket,
                }
            },
        )
        owner = user_collection.find_one({"_id": project_info["OWNER_ID"]})
        incoming_list = owner["incoming"]
        incoming_list.remove(
            {
                "user_id": project_info["USER_ID"],
                "project_id": project_info["PROJECT_ID"],
            }
        )
        user_collection.find_one_and_update(
            {"_id": project_info["OWNER_ID"]},
            {
                "$set": {
                    "incoming": incoming_list,
                }
            },
            upsert=False,
        )
        contribution_info = {
            "USER_ID": project_info["USER_ID"],
            "PROJECT_ID": project_info["PROJECT_ID"],
        }
        NotificationsHandler.add_contribution(contribution_info=contribution_info)

    @staticmethod
    def reject_incoming(project_info):
        """
        reject user incoming contribution request.
        remove request from owner incoming_list.
        remove request from user outgoing_list
        and update user notification_bucket.

        Args:
            project_info (dict): contains following fields,
                USER_ID (bson.object.ObjectId)
                PROJECT_ID (bson.object.ObjectId)
                OWNER_ID (bson.object.ObjectId)
        """
        user = user_collection.find_one({"_id": project_info["USER_ID"]})
        bucket = user["notification_bucket"]
        bucket.append(
            {
                "project_id": project_info["PROJECT_ID"],
                "status": "Rejected",
            }
        )
        user_outgoing = user["outgoing"]
        user_outgoing.remove(project_info["PROJECT_ID"])
        user_collection.find_one_and_update(
            {"_id": project_info["USER_ID"]},
            {
                "$set": {
                    "outgoing": user_outgoing,
                    "notification_bucket": bucket,
                }
            },
        )
        owner = user_collection.find_one({"_id": project_info["OWNER_ID"]})
        incoming_list = owner["incoming"]
        incoming_list.remove(
            {
                "user_id": project_info["USER_ID"],
                "project_id": project_info["PROJECT_ID"],
            }
        )
        user_collection.find_one_and_update(
            {"_id": project_info["OWNER_ID"]},
            {
                "$set": {
                    "incoming": incoming_list,
                }
            },
            upsert=False,
        )

        contribution_info = {
            "USER_ID": project_info["USER_ID"],
            "PROJECT_ID": project_info["PROJECT_ID"],
        }
        NotificationsHandler.remove_contribution(contribution_info=contribution_info)

    @staticmethod
    def handle_contribution(user_id, project_id, status):
        """
        add or remove contribution based on status.
        if status is `True` then add project to user contributions list,
        otherwise remove project from list.

        Args:
            user_id (bson.object.ObjectId):
            project_id (bson.object.ObjectId):
            status (bool):
        """
        user = user_collection.find_one({"_id": user_id})
        contribution_list = user["contributions"]
        if status:
            contribution_list.append(project_id)
        else:
            contribution_list.remove(project_id)
        user_collection.find_one_and_update(
            {"_id": user_id},
            {
                "$set": {
                    "contributions": contribution_list,
                }
            },
            upsert=False,
        )

    @staticmethod
    def add_contribution(contribution_info):
        """
        add project to user contributions list.

        Args:
            contribution_info (bson.object.ObjectId)
        """
        NotificationsHandler.handle_contribution(
            contribution_info["USER_ID"], contribution_info["PROJECT_ID"], status=True
        )

    @staticmethod
    def remove_contribution(contribution_info):
        """
        remove project from user contributions list.

        Args:
            contribution_info (bson.object.ObjectId)
        """
        NotificationsHandler.handle_contribution(
            contribution_info["USER_ID"], contribution_info["PROJECT_ID"], status=False
        )

    @staticmethod
    def fetch_and_process_collabrations_and_contributions():
        user_object_id = ObjectId(get_user_object_id())
        incoming_list = NotificationsHandler.fetch_incoming(user_id=user_object_id)
        outgoing_list = NotificationsHandler.fetch_outgoing(user_id=user_object_id)
        for incoming in incoming_list:
            incoming["project_id"] = str(incoming["project_id"])
            incoming["project_owner"] = str(incoming["project_owner"])
        for outgoing in outgoing_list:
            outgoing["project_id"] = str(outgoing["project_id"])
            outgoing["project_owner"] = str(outgoing["project_owner"])
        return {"collaborations": incoming_list, "contributions": outgoing_list}

    @staticmethod
    def fetch_and_accept_colloboration_request(project_dict):
        user_object_id = ObjectId(get_user_object_id())
        project_info = {
            "USER_ID": user_object_id,
            "PROJECT_ID": ObjectId(project_dict["project_id"]),
            "OWNER_ID": ObjectId(project_dict["project_owner"]),
        }
        NotificationsHandler.accept_incoming(project_info=project_info)

    @staticmethod
    def fetch_and_reject_colloboration_request(project_dict):
        user_object_id = ObjectId(get_user_object_id())
        project_info = {
            "USER_ID": user_object_id,
            "PROJECT_ID": ObjectId(project_dict["project_id"]),
            "OWNER_ID": ObjectId(project_dict["project_owner"]),
        }
        NotificationsHandler.reject_incoming(project_info=project_info)
