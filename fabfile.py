#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Copyright (c) 2016 xmonster.cn. All rights reserved.

from fabric.api import run, env, cd, task


from fabric.contrib import files
from fabric.decorators import parallel
from fabric.operations import require
from termcolor import colored
from secret import www_usr_pwd, root_usr_pwd

project_name = "rest-api-sample"

dev_servers = ['120.55.119.4']
prod_grayscale_servers = ['']
prod_all_servers = ['120.55.119.4']

log_folder = '/data/log'
project_path = '/home/www/sites/{proj}'.format(proj=project_name)
clone_src_path = '/src/github.com/simpleton/{proj}'.format(proj=project_name)
repo = 'git@github.com:simpleton/rest-api-sample.git'

STAGES = {
    'dev': {
        'hosts': dev_servers,
        'password': root_usr_pwd,
        'user': 'root',
        'project_repo': repo,
        'project_repo_path': "/".join([project_path, clone_src_path]),
        'log_folder': log_folder,
        'environment': 'dev',
        'branch': 'develop',
    },

    'prod': {
        'hosts': prod_all_servers,
        'password': root_usr_pwd,
        'user': 'root',
        'project_repo': repo,
        'project_repo_path': "/".join([project_path, clone_src_path]),
        'log_folder': log_folder,
        'environment': 'prod',
        'branch': 'master',
    }
}

# Deployment environments
def stage_set(stage_name='dev'):
    env.stage = stage_name
    _info("we are deploying {env} environment".format(env=stage_name))
    for option, value in STAGES[env.stage].items():
        setattr(env, option, value)

@task
def prod():
    """
    deploy to production server
    """
    stage_set('prod')


@task
def dev():
    """
    deploy to dev server185
    """
    stage_set('dev')


@task
@parallel(pool_size=8)
def deploy(branch=None, tag=None):
    """deploy source code"""
    require('stage', provided_by=(dev, prod,))
    _branch = branch or env.branch
    _path = env.get('project_repo_path')

    if not files.exists(_path):
        _clone_repo()

    if not is_locked():
        try:
            _lock()
            _info("we are deploy {branch} branch, tag {tag}".format(
                branch=_branch,
                tag=tag
            ))

            _mkdir_folder()

            _check_process_if_not_exist_start_it("supervisord")
            _update_repo(branch=_branch, tag=tag)
            _copy_all_supervisor_config([project_name], env.host)

            _build_proj()
            _restart_proj()
        finally:
            _unlock()

@task()
@parallel(pool_size=8)
def unlock():
    """
    unlock deploy lock
    """
    require('stage', provided_by=(dev, prod,))
    _unlock()

"""
******************
internal function
******************
"""

def _check_process_if_not_exist_start_it(process):
    if int(run('ps -ef | grep {process} | wc -l'.format(process=process))) < 3:
        run('{process}'.format(process=process))

def _update_repo(branch=None, tag=None):
    """Updates the source code and its requirements"""
    _branch = branch or env.get('branch')
    _fetch_and_checkout_repo(branch=_branch, tag=tag)

def _mkdir_folder():
    run("mkdir -p {folder}/{proj}".format(folder=env.log_folder, proj=project_name))

def _clone_repo():
    """Clones the Git repository"""
    _info('\n\nCloning the repository...')
    run('git clone %(project_repo)s %(project_repo_path)s' % env)

def _fetch_and_checkout_repo(tag, branch):
    """Updates the Git repository and checks out the specified branch"""
    _info('\n\nUpdating repository branch...')

    with cd(env.project_repo_path):
        run('git reset .')
        run('git checkout .')
        run('git clean -df')
        run('git fetch --prune')
        run('git checkout {branch}'.format(branch=branch))
        run('git merge -X theirs origin/{branch}'.format(branch=branch))
        if tag:
            run('git checkout tags/{tag}'.format(tag=tag))

    run('chmod -R go=u,go-w %(project_repo_path)s' % env)

def _lock():
    _warning("locking:" + env.host)
    with cd(env.project_repo_path):
        run('touch deploy.lock')

def _unlock():
    _warning("unlock:" + env.host)
    with cd(env.project_repo_path):
        run('rm -f deploy.lock')

def is_locked():
    if files.exists("%(project_repo_path)s/deploy.lock" % env):
        _error("someone is deploying, or last deploy shot down by accident.")
        _info("delete deploy.lock will fix this issue")
        return True
    else:
        _info("Deploying...")
        return False

def _copy_supervisor_conf(filename):
    run("cp -f {env}/*_supervisord.conf ./".format(
        env=env.get('environment'),
        file=filename
    ))

def _copy_all_supervisor_config(projects, current_host):
    _info("current_host:{host}".format(host=current_host))

    with cd("{repo_path}/supervisord".format(repo_path=env.project_repo_path)):
        for filename in projects:
            _copy_supervisor_conf(filename)
"""
supervisor util function
"""
def _restart_proj():
    _reload_supervisor_config()
    # the supervisor's item name didn't allow contain "-" or "_",
    # we remove it at here
    run('supervisorctl restart %s' % "".join(project_name.split('-')))

def _reload_supervisor_config():
    run('supervisorctl reread')
    run('supervisorctl update')

def _build_proj():
    with cd("{repo_path}".format(repo_path=env.project_repo_path)):
        run('make clean && make prepare && make')

def _gen_doc():
    with cd("{repo_path}/swagger".format(repo_path=env.project_repo_path)):
        #run('swagger-codegen generate -i swagger.yaml -l swagger')
        pass

def _info(log):
    print colored(log, "green")

def _warning(log):
    print colored(log, "yellow")

def _error(log):
    print colored(log, "red")
