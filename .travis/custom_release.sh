#!/bin/bash
set -e
set -x

# map master branch to stage-beta environment
if [[ "${TRAVIS_BRANCH}" = "master" ]]; then
    echo "PUSHING stage-beta"
    rm -rf ./dist/.git
    .travis/release.sh "stage-beta"
fi

if [[ "${TRAVIS_BRANCH}" = "stage-stable" ]]; then
    echo "PUSHING stage-stable"
    rm -rf ./build/.git
    .travis/release.sh "${TRAVIS_BRANCH}"
fi

if [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    echo "PUSHING ${TRAVIS_BRANCH}"
    rm -rf ./build/.git

    #we do not want sourmaps uploaded to browser for prod-beta and prod-stable envs
    rm -rf ./build/sourcemaps
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
