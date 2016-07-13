#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Copyright (c***REMOVED*** 2016 xmonster.cn. All rights reserved.

from fabric.api import run, env, cd, task


from fabric.contrib import ***REMOVED***les
from fabric.decorators import parallel
from fabric.operations import require
from termcolor import colored
from secret import www_usr_pwd, root_usr_pwd

dev_servers = ['120.55.119.4']
prod_grayscale_servers = ['']
prod_all_servers = ['120.55.119.4']

log_folder = '/data/log'
project_path = '/home/www/sites/tinker-api'
clone_src_path = '/src/github.com/simpleton/tinker-api'
repo = 'https://github.com/simpleton/tinker-api.git'

STAGES = {
    'dev': {
        'hosts': dev_servers,
        'password': root_usr_pwd,
        'user': 'root',
        'project_repo': repo,
        'project_repo_path': project_path,
        'srv_src_path': srv_src_path,
        'log_folder': log_folder,
        'environment': 'dev',
        'deploy_projs': all_projs,
        'branch': 'develop',
    },

    'prod': {
        'hosts': prod_all_servers,
        'password': www_usr_pwd,
        'user': 'www',
        'project_repo': repo,
        'project_repo_path': project_path,
        'srv_src_path': srv_src_path,
        'log_folder': log_folder,
        'environment': 'prod',
        #the project in this array will be deploy at every machine of hosts
        'deploy_projs': all_projs,
        'branch': 'master',
    }
}

# Deployment environments
def stage_set(stage_name='dev'***REMOVED***:
    env.stage = stage_name
    _info("we are deploying {env} environment".format(env=stage_name***REMOVED******REMOVED***
    for option, value in STAGES[env.stage].items(***REMOVED***:
        setattr(env, option, value***REMOVED***

@task
def prod(***REMOVED***:
    """
    deploy to production server
    """
    stage_set('prod'***REMOVED***


@task
def dev(***REMOVED***:
    """
    deploy to dev server
    """
    stage_set('dev'***REMOVED***


@task
@parallel(pool_size=8***REMOVED***
def deploy(branch=None, tag=None***REMOVED***:
    """deploy source code"""
    require('stage', provided_by=(dev, prod,***REMOVED******REMOVED***
    _branch = branch or env.branch
    _path = env.get('project_repo_path'***REMOVED***

    if not ***REMOVED***les.exists(_path***REMOVED***:
        _clone_repo(***REMOVED***
        _install_tools(***REMOVED***

    if not is_locked(***REMOVED***:
        try:
            _mkdir_folder(***REMOVED***
            _install_tools(***REMOVED***
            _lock(***REMOVED***
            _info("we are deploy {branch} branch, tag {tag}".format(
                branch=_branch,
                tag=tag
            ***REMOVED******REMOVED***

            _check_process_if_not_exist_start_it("supervisord"***REMOVED***
            _update_repo(branch=_branch, tag=tag***REMOVED***
            _copy_all_supervisor_con***REMOVED***g(env.get('deploy_projs'***REMOVED***, env.host***REMOVED***

            _clean_project(***REMOVED***
            _go_get(***REMOVED***
            #_gen_doc(***REMOVED***

            #save memory for compiling
            _install_proj(env.get("environment"***REMOVED******REMOVED***
            _restart_projs(***REMOVED***
        ***REMOVED***nally:
            _unlock(***REMOVED***

@task(***REMOVED***
@parallel(pool_size=8***REMOVED***
def unlock(***REMOVED***:
    """
    unlock deploy lock
    """
    require('stage', provided_by=(dev, prod,***REMOVED******REMOVED***
    _unlock(***REMOVED***

"""
******************
internal function
******************
"""

def _check_process_if_not_exist_start_it(process***REMOVED***:
    if int(run('ps -ef | grep {process} | wc -l'.format(process=process***REMOVED******REMOVED******REMOVED*** < 3:
        run('{process}'.format(process=process***REMOVED******REMOVED***

def _update_repo(branch=None, tag=None***REMOVED***:
    """Updates the source code and its requirements"""
    _branch = branch or env.get('branch'***REMOVED***
    _fetch_and_checkout_repo(branch=_branch, tag=tag***REMOVED***

def _mkdir_folder(***REMOVED***:
    run('mkdir -p %(log_folder***REMOVED***s/nginx' % env***REMOVED***
    for proj in all_projs:
        run("mkdir -p {folder}/{proj}".format(folder=env.log_folder, proj=proj***REMOVED******REMOVED***


def _clone_repo(***REMOVED***:
    """Clones the Git repository"""
    _info('\n\nCloning the repository...'***REMOVED***
    run('git clone %(project_repo***REMOVED***s %(project_repo_path***REMOVED***s' % env***REMOVED***

def _fetch_and_checkout_repo(tag, branch***REMOVED***:
    """Updates the Git repository and checks out the speci***REMOVED***ed branch"""
    _info('\n\nUpdating repository branch...'***REMOVED***

    with cd(env.project_repo_path***REMOVED***:
        run('git reset .'***REMOVED***
        run('git checkout .'***REMOVED***
        run('git clean -df'***REMOVED***
        run('git fetch --prune'***REMOVED***
        run('git checkout {branch}'.format(branch=branch***REMOVED******REMOVED***
        run('git merge origin/{branch}'.format(branch=branch***REMOVED******REMOVED***
        if tag:
            run('git checkout tags/{tag}'.format(tag=tag***REMOVED******REMOVED***

    run('chmod -R go=u,go-w %(project_repo_path***REMOVED***s' % env***REMOVED***

def _lock(***REMOVED***:
    _warning("locking:" + env.host***REMOVED***
    with cd(env.project_repo_path***REMOVED***:
        run('touch deploy.lock'***REMOVED***

def _unlock(***REMOVED***:
    _warning("unlock:" + env.host***REMOVED***
    with cd(env.project_repo_path***REMOVED***:
        run('rm -f deploy.lock'***REMOVED***

def is_locked(***REMOVED***:
    if (***REMOVED***les.exists("%(project_repo_path***REMOVED***s/deploy.lock" % env***REMOVED******REMOVED***:
        _error("someone is deploying, or last deploy shot down by accident."***REMOVED***
        _info("delete deploy.lock will ***REMOVED***x this issue"***REMOVED***
        return True
    ***REMOVED***:
        _info("Deploying..."***REMOVED***
        return False

def _copy_supervisor_conf(***REMOVED***lename***REMOVED***:
    #run("cp -f {env}/{***REMOVED***le}_supervisord.conf ./".format(
    run("cp -f {env}/*_supervisord.conf ./".format(
        env=env.get('environment'***REMOVED***,
        ***REMOVED***le=***REMOVED***lename
    ***REMOVED******REMOVED***

def _copy_all_supervisor_con***REMOVED***g(projects, current_host***REMOVED***:
    _info("current_host:{host}".format(host=current_host***REMOVED******REMOVED***

    with cd("{repo_path}/../conf/supervisor".format(repo_path=env.srv_src_path***REMOVED******REMOVED***:
        for ***REMOVED***lename in projects:
            _copy_supervisor_conf(***REMOVED***lename***REMOVED***


def _restart_site(proj***REMOVED***:
    #_gen_supervisor_conf(***REMOVED***
    _reload_supervisor_con***REMOVED***g(***REMOVED***
    run('supervisorctl restart %s' % "".join(proj.split('_'***REMOVED******REMOVED******REMOVED***

def _restart_projs(***REMOVED***:
    _reload_supervisor_con***REMOVED***g(***REMOVED***
    for proj in sub_projs:
        _restart_site(proj***REMOVED***


def _reload_supervisor_con***REMOVED***g(***REMOVED***:
    run('supervisorctl reread'***REMOVED***
    run('supervisorctl update'***REMOVED***

def _go_get(***REMOVED***:
    with cd("{repo_path}".format(repo_path=env.srv_src_path***REMOVED******REMOVED***:
        run('GOM_VENDOR_NAME=../../.vendor gom install'***REMOVED***

def _gen_doc(***REMOVED***:
    with cd("{repo_path}".format(repo_path=env.srv_src_path***REMOVED******REMOVED***:
        run('bee generate docs'***REMOVED***

def _install_proj(environment***REMOVED***:
    with cd("{repo_path}".format(repo_path=env.srv_src_path***REMOVED******REMOVED***:
        #run('bash change_runmode.sh {env}'.format(env=environment***REMOVED******REMOVED***
        for sub_proj in sub_projs:
            run('GOM_VENDOR_NAME=../../.vendor gom build {proj}'.format(proj=sub_proj***REMOVED******REMOVED***

def _install_tools(***REMOVED***:
    #run('go get -u github.com/simpleton/bee'***REMOVED***
    #run('go get -u github.com/mattn/gom'***REMOVED***
    pass

def _clean_project(***REMOVED***:
    with cd("{repo_path}".format(repo_path=env.srv_src_path***REMOVED******REMOVED***:
        run('go clean'***REMOVED***

def _info(log***REMOVED***:
    print colored(log, "green"***REMOVED***

def _warning(log***REMOVED***:
    print colored(log, "yellow"***REMOVED***

def _error(log***REMOVED***:
    print colored(log, "red"***REMOVED***


