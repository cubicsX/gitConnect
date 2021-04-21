import requests
import os
import json

from pymongo import MongoClient
from bson.objectid import ObjectId

from django_middleware_global_request.middleware import get_request

GITHUB_SECRET = os.environ.get("GITHUB_SECRET")
GITHUB_CLIENT_ID = os.environ.get("GITHUB_ID")
GITCONNECT_CLUSTER_PASS = os.environ.get("GITCONNECT_CLUSTER_PASS")

class Connect(object):
    @staticmethod    
    def get_connection():
        return MongoClient(f"mongodb+srv://gitconnect:{GITCONNECT_CLUSTER_PASS}@gitconnectcluster.ytua1.mongodb.net/test")

client = Connect.get_connection()
user_collection = client["gitconnect"]["user"]
project_collection = client["gitconnect"]["project"]
search_collection = client["gitconnect"]["search"]
SEARCH_ID = ObjectId("607f0e5e30484f83ad40dfbb")


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
            ## We also update user github details here
            user_collection.find_one_and_update(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "username": user_info["username"],
                        "userid": user_info["userid"],
                        "avatar": user_info["avatar"],
                        "githubURL": user_info["githubURL"],
                    }
                },
            )
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
    def parse_string_AND(query):
        search = search_collection.find_one({"_id": SEARCH_ID})
        keywords = query.split(",")
        all_keys = list(search.keys())
        selected_projects = set()
        flag = False
        ## generate new keywords_list
        for query_keyword in keywords:
            new_keywords = list()
            for key in all_keys:
                if query_keyword in key:
                    new_keywords.append(key)
            new_keywords = list(set(new_keywords))
            try:
                project_set = search[new_keywords[0]]
                for key in new_keywords[1:]:
                    project_set += search[key]
                project_set = list(set(project_set))
                if flag:
                    selected_projects = set(selected_projects) & set(project_set)
                else:
                    selected_projects = set(project_set)
                    flag = True
            except IndexError:
                continue
        return list(set(selected_projects))
        # try:
        #     project_set = set(search[keywords[0]])
        # except KeyError:
        #     project_set = set()
        # except AttributeError:
        #     project_set = set()
        # for key in keywords[1:]:
        #     try:
        #         project_set = project_set & set(search[key])
        #     except KeyError:
        #         continue
        #     except AttributeError:
        #         continue
        # return list(project_set)

    @staticmethod
    def parse_string_OR(query):
        search = search_collection.find_one({"_id": SEARCH_ID})
        keywords = query.split(",")
        all_keys = list(search.keys())
        selected_projects = set()
        flag = False
        ## generate new keywords_list
        for query_keyword in keywords:
            new_keywords = list()
            for key in all_keys:
                if query_keyword in key:
                    new_keywords.append(key)
            new_keywords = list(set(new_keywords))
            try:
                project_set = search[new_keywords[0]]
                for key in new_keywords[1:]:
                    project_set += search[key]
                project_set = list(set(project_set))
                if flag:
                    selected_projects = set(selected_projects) | set(project_set)
                else:
                    selected_projects = set(project_set)
                    flag = True
            except IndexError:
                continue
        return list(set(selected_projects))
        # try:
        #     project_set = set(search[keywords[0]])
        # except KeyError:
        #     project_set = set()
        # except AttributeError:
        #     project_set = set()
        # for key in keywords[1:]:
        #     try:
        #         project_set = project_set | set(search[key])
        #     except KeyError:
        #         continue
        #     except AttributeError:
        #         continue
        # return project_set

    @staticmethod
    def parse_string_NOT(projects, query, status):
        search = search_collection.find_one({"_id": SEARCH_ID})
        if status:
            keywords = query.split(",")
            project_set = set(projects)
            for key in keywords:
                try:
                    project_set = project_set - set(search[key])
                except KeyError:
                    continue
                except AttributeError:
                    continue
        else:
            keywords = query.split(",")
            all_projects = set(search.keys()) - set(keywords)
            project_set = set()
            for project_title in all_projects:
                project_set.update(search[project_title])
        return project_set

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
        """[summary]
        This is a prototype for boolean search algorithm.
        supported boolean keyword:
            - and : project must contain all keywords.
            - or : project contain any of keywords.
            - not : project must not contain keywords.
            - exact : fetch project with exact keyword match.
            - near : fetch pproject with near keyword match.
            ( by default, all project fetch is done on basis of exact match of keyword. )

            `NEAR` TOKEN IMPLEMENTATION IS NOT DONE YET.

        Examples:
            1) $and:python3,ml $not:ai
            2) $or:python2,script $not:ml

        Args:
            search_query (string): string contains keywords with boolean text.
        """
        search = search_collection.find_one({"_id": SEARCH_ID})
        user = user_collection.find_one({"_id": search_info["USER_ID"]})
        if user == None:
            raise ValueError("User not exists in database.")
        user_bookmarks = user["bookmarks"]
        user_contributions = user["contributions"]
        user_outgoing = user["outgoing"]
        tokenize_strings = search_info["search_query"].split()
        flag = False
        fetched_project = list()
        for query_token in tokenize_strings:
            keywords = query_token.split(":")
            if keywords[0][1:] == "and":
                if flag:
                    raise ValueError(
                        "flag is set to True. $and and $or in single query."
                    )
                else:
                    flag = True
                    fetched_project += SearchPageHandler.parse_string_AND(keywords[1])
            elif keywords[0][1:] == "or":
                if flag:
                    raise ValueError(
                        "flag is set to True. $and and $or in single query."
                    )
                else:
                    flag = True
                    fetched_project += SearchPageHandler.parse_string_OR(keywords[1])
            elif keywords[0][1:] == "not":
                if len(fetched_project) == 0:
                    fetched_project = list(
                        SearchPageHandler.parse_string_NOT(
                            [], keywords[1], status=False
                        )
                    )
                else:
                    fetched_project = list(
                        SearchPageHandler.parse_string_NOT(
                            fetched_project, keywords[1], status=True
                        )
                    )
            elif keywords[0][1:] == "exact":
                raise NotImplementedError("methos is not implemeneted.")
            elif keywords[0][1:] == "near":
                raise NotImplementedError("methos is not implemeneted.")
            else:
                # single keyword search algo here.
                # try:
                #     fetched_project = search[search_info["search_query"]]
                # except KeyError:
                #     fetched_project = None
                # except AttributeError:
                #     fetched_project = None
                #
                keywords = search_info["search_query"].split(",")
                if len(keywords) != 1:
                    pass
                    # return statement should be here.
                all_keys = list(search.keys())
                selected_projects = set()
                flag = False
                ## generate new keywords_list
                for query_keyword in keywords:
                    new_keywords = list()
                    for key in all_keys:
                        if query_keyword in key:
                            new_keywords.append(key)
                    new_keywords = list(set(new_keywords))
                    try:
                        project_set = search[new_keywords[0]]
                        for key in new_keywords[1:]:
                            project_set += search[key]
                        project_set = list(set(project_set))
                        if flag:
                            selected_projects = set(selected_projects) | set(
                                project_set
                            )
                        else:
                            selected_projects = set(project_set)
                            flag = True
                    except IndexError:
                        continue
                    fetched_project = list(selected_projects)
        project_id_list = fetched_project
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
                    project_outgoing = False
                else:
                    project_outgoing = True if id in user_outgoing else False
                if user_contributions == None:
                    project_contribution = False
                else:
                    project_contribution = True if id in user_contributions else False
                if not (project_outgoing) and not (project_contribution):
                    project["contribution"] = 0  # Do Contribution

                elif project_outgoing and not (project_contribution):
                    project["contribution"] = 1  # Requested

                elif not (project_outgoing) and project_contribution:
                    project["contribution"] = 2  # Accepted

                else:
                    ValueError("This should be executed")
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
        if user == None:
            raise ValueError("User not exits in database.")
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
            except AttributeError:
                value_list = list()
            except KeyError:
                value_list = list()

            value_list.append(project.inserted_id)
            search_collection.find_one_and_update(
                {"_id": SEARCH_ID}, {"$set": {skill: value_list}}, upsert=False
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
        function returns user details of specified user_id.

        Args:
            user_id (bson.object.ObjectId)

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
        if user == None:
            raise ValueError("User not exists in database.")
        user_bookmarks = list()
        for project_id in user["bookmarks"]:
            project = project_collection.find_one({"_id": project_id})
            if project == None:
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
            if project == None:
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
    def fetch_and_create_user_info(user_id=None):
        if user_id is None:
            user_object_id = ObjectId(get_user_object_id())
        else:
            user_object_id = ObjectId(user_id)
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
        if owner == None:
            raise ValueError("Project Owner is not exists in database.")
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
        if user == None:
            raise ValueError("Requestes User is not exists in database.")
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
        if owner == None:
            raise ValueError("Project Owner is not exists in database.")
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
        if user == None:
            raise ValueError("Requestes User is not exists in database.")
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
        add or remove bookmark based on status.
        if status is `True` then add bookmark,
        else remove bookmark.
        Function call from add_bookmark and remove_bookmark methods with status.

        Args:
            user_id (bson.object.ObjectId)
            project_id (bson.object.ObjectId)
            status (bool)
        """
        user = user_collection.find_one({"_id": user_id})
        if user == None:
            raise ValueError("User not exists in database.")
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
        if user == None:
            raise ValueError("User is not exist in database.")
        user_incomings = [] if user["incoming"] is None else user["incoming"]
        incomings_list = list()
        for item in user_incomings:
            requested_user = user_collection.find_one({"_id": item["user_id"]})
            user = requested_user["userid"]
            user_id = requested_user["_id"]
            project = project_collection.find_one({"_id": item["project_id"]})
            requested_project_name = project["projectTitle"]
            requested_project_id = project["_id"]
            requested_project_owner = project["owner"]
            incomings_list.append(
                {
                    "user": user,
                    "user_id": user_id,
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
        if user == None:
            raise ValueError("User is not exist in database.")
        user_outgoings = [] if user["outgoing"] is None else user["outgoing"]
        outgoings_list = list()
        for item in user_outgoings:
            requested_project_name = project_collection.find_one({"_id": item})[
                "projectTitle"
            ]
            project = project_collection.find_one({"_id": item})
            requested_project_id = project["_id"]
            requested_project_owner = project["owner"]
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
        if user == None:
            raise ValueError("User is not exist in database.")
        contribution_list = user["contributions"]
        ## add project to user contribution list
        contribution_list.append(project_info["PROJECT_ID"])
        ## add project to user notification bucket
        bucket = user["notification_bucket"]
        bucket.append(
            {
                "project_id": project_info["PROJECT_ID"],
                "status": "Accepted",
            }
        )
        user_outgoing = user["outgoing"]
        ## remove project from user outgoing list
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
            upsert=False,
        )
        owner = user_collection.find_one({"_id": project_info["OWNER_ID"]})
        if owner == None:
            raise ValueError("Project owner is not exist in database.")
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
        # NotificationsHandler.add_contribution(contribution_info=contribution_info)

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
        if user == None:
            raise ValueError("User not exist in database.")
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
            upsert=False,
        )
        owner = user_collection.find_one({"_id": project_info["OWNER_ID"]})
        if owner == None:
            raise ValueError("Project Owner is not exist in database.")
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
        # NotificationsHandler.remove_contribution(contribution_info=contribution_info)

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
        if user == None:
            raise ValueError("User not exist in database.")
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
            incoming["user_id"] = str(incoming["user_id"])
            incoming["project_id"] = str(incoming["project_id"])
            incoming["project_owner"] = str(incoming["project_owner"])
        for outgoing in outgoing_list:
            outgoing["project_id"] = str(outgoing["project_id"])
            outgoing["project_owner"] = str(outgoing["project_owner"])
        return {"collaborations": incoming_list, "contributions": outgoing_list}

    @staticmethod
    def fetch_and_accept_colloboration_request(project_dict):
        project_info = {
            "USER_ID": ObjectId(project_dict["user_id"]),
            "PROJECT_ID": ObjectId(project_dict["project_id"]),
            "OWNER_ID": ObjectId(project_dict["project_owner"]),
        }
        NotificationsHandler.accept_incoming(project_info=project_info)

    @staticmethod
    def fetch_and_reject_colloboration_request(project_dict):
        project_info = {
            "USER_ID": ObjectId(project_dict["user_id"]),
            "PROJECT_ID": ObjectId(project_dict["project_id"]),
            "OWNER_ID": ObjectId(project_dict["project_owner"]),
        }
        NotificationsHandler.reject_incoming(project_info=project_info)