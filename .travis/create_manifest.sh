#!/usr/bin/env bash
set -e
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
    echo -e "Pull Request, not pushing a build"
    exit 0
else
    if [ "${TRAVIS_BRANCH}" = "master" ] || [ "${TRAVIS_BRANCH}" = "prod-stable" ]; then
        GENERATOR_PATH=$(pwd)/.travis/package-manifest-generator.js
        PACKAGE_LOCK=$(pwd)/package-lock.json
        LATEST_VERSION=$(git describe --tags | grep -Po "v[0-9]+\.[0-9]+\.[0-9]+")
        cd /tmp
        git clone https://github.com/RedHatInsights/manifests.git
        cd manifests
        mkdir -p patchman-ui
        cd patchman-ui
        if [ "${TRAVIS_BRANCH}" = "master" ]; then
            $GENERATOR_PATH $PACKAGE_LOCK
        elif [ "${TRAVIS_BRANCH}" = "prod-stable" ]; then
            git checkout stable
            $GENERATOR_PATH $PACKAGE_LOCK $LATEST_VERSION
        fi

        git remote set-url origin $MANIFEST_REPO_TOKEN
        git config user.email $MANIFEST_REPO_EMAIL
        git config user.name "vmaas-bot"
        git add .
        git diff-index --quiet HEAD || git commit -m "Update manifest for Patch UI"
        git push
    else
        echo -e "Other branch than master or prod-stable, not pushing a build"
        exit 0
    fi
fi
