#!/usr/bin/env bash
#
# Cuts a release. The version of the React package is moved on, and the MCP server's beside it,
# the move is committed and pushed, and a GitHub release is published under a tag naming the React
# package's version. The release is what sends both packages to npm, through the Continuous
# Integration workflow, so nothing here publishes anything to the registry itself.
#
# Run it with --help to see what it can be told

set -euo pipefail

# Everything below is said relative to the root of the repository, wherever the script is run from
cd "$(dirname "${BASH_SOURCE[0]}")/.."

readonly REACT_MANIFEST="packages/react/package.json"
readonly MCP_MANIFEST="packages/mcp/package.json"
readonly REMOTE="origin"
readonly BRANCH="main"

react_bump="patch"
mcp_bump="patch"
run_checks=true
publish_release=true
dry_run=false
assume_yes=false

usage() {
    cat << EOF
Usage: scripts/release.sh [options]

Moves the packages on to their next versions, commits and pushes the move, and publishes a GitHub
release tagged with the React package's version, which the Continuous Integration workflow then
publishes to npm.

Options:
  --react <bump>   How far the React package moves: patch, minor, major or an exact version.
                   Defaults to patch
  --mcp <bump>     How far the MCP server moves: patch, minor, major, an exact version, or none to
                   leave it where it is. Defaults to patch
  --skip-checks    Leaves the lint, the tests and the build to the workflow alone
  --no-release     Commits and pushes the versions, and leaves the release to be drafted by hand
  --dry-run        Says what would be done and does none of it
  -y, --yes        Goes ahead without asking first
  -h, --help       Prints this and stops
EOF
}

fail() {
    echo "release: $*" >&2
    exit 1
}

# Says which step is under way, so that a release stopped partway shows how far it got
step() {
    echo
    echo "==> $*"
}

while [ $# -gt 0 ]; do
    case "$1" in
        --react)
            [ $# -ge 2 ] || fail "--react needs a bump: patch, minor, major or a version"
            react_bump="$2"
            shift 2
            ;;
        --mcp)
            [ $# -ge 2 ] || fail "--mcp needs a bump: patch, minor, major, a version or none"
            mcp_bump="$2"
            shift 2
            ;;
        --skip-checks)
            run_checks=false
            shift
            ;;
        --no-release)
            publish_release=false
            shift
            ;;
        --dry-run)
            dry_run=true
            shift
            ;;
        -y | --yes)
            assume_yes=true
            shift
            ;;
        -h | --help)
            usage
            exit 0
            ;;
        *)
            fail "$1 is not an option this script takes (see --help)"
            ;;
    esac
done

# The tag is published through the release rather than pushed on its own, so a React package left
# where it is would be released under a tag that already names an earlier release
[ "$react_bump" != "none" ] || fail "the React package names the release, so it has to move"

# What a field of a package's manifest holds, read the way the workflow reads the version
manifest_field() {
    node -p "require('./$1').$2"
}

# The version a bump moves a package to. An exact version has to be further on than the one the
# package is already at, since the registry never takes the same version twice
next_version() {
    node -e '
        const [current, bump] = process.argv.slice(1);
        const parse = (version) => {
            const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

            return match ? match.slice(1).map(Number) : null;
        };
        const from = parse(current);

        if (!from) {
            console.error(`release: ${current} is not a version this script can move on from`);
            process.exit(1);
        }

        const [major, minor, patch] = from;
        const steps = {
            major: [major + 1, 0, 0],
            minor: [major, minor + 1, 0],
            patch: [major, minor, patch + 1],
        };
        const to = Object.hasOwn(steps, bump) ? steps[bump] : parse(bump);

        if (!to) {
            console.error(`release: ${bump} is not patch, minor, major or a version`);
            process.exit(1);
        }

        const moved = to.findIndex((part, index) => part !== from[index]);

        if (moved === -1 || to[moved] < from[moved]) {
            console.error(`release: ${to.join(".")} is not further on than ${current}`);
            process.exit(1);
        }

        console.log(to.join("."));
    ' "$1" "$2"
}

# Moves the version a manifest holds and leaves everything else in it as it was. The manifests are
# not all laid out alike, so writing one back out whole would reformat whichever of them did not
# match. What was written is read back and held against what was meant, so a manifest the version
# could not be found in is stopped at rather than left half changed
set_version() {
    node -e '
        const fs = require("fs");
        const [file, version] = process.argv.slice(1);
        const text = fs.readFileSync(file, "utf8");
        const next = text.replace(
            /("version"\s*:\s*")[^"]*(")/,
            (_, open, close) => `${open}${version}${close}`,
        );
        const expected = JSON.stringify({ ...JSON.parse(text), version });

        if (JSON.stringify(JSON.parse(next)) !== expected) {
            console.error(`release: the version in ${file} could not be moved on its own`);
            process.exit(1);
        }

        fs.writeFileSync(file, next);
    ' "$1" "$2"
}

# Whether the registry already holds a version of a package. A registry that cannot be reached is
# taken to hold nothing, and the workflow is left to find out otherwise
is_published() {
    [ -n "$(npm view "$1@$2" version 2> /dev/null || true)" ]
}

# Where the repository is on GitHub, read off the remote whether it was cloned over HTTPS or SSH
repository_url() {
    git remote get-url "$REMOTE" | sed -e 's#^git@github\.com:#https://github.com/#' -e 's#\.git$##'
}

step "Checking the repository"

for tool in git node npm; do
    command -v "$tool" > /dev/null || fail "$tool is needed to cut a release"
done

# The release is published through the GitHub CLI, so whether it can be is asked before anything
# is changed, rather than once the versions have already been pushed
if [ "$publish_release" = true ]; then
    command -v gh > /dev/null ||
        fail "the GitHub CLI (gh) publishes the release; install it, or pass --no-release"
    gh auth status > /dev/null 2>&1 ||
        fail "the GitHub CLI is not signed in; run gh auth login, or pass --no-release"
fi

# A release is cut from the tip of the main branch, so what is published is what everyone else
# already has
current_branch="$(git symbolic-ref --quiet --short HEAD || true)"
[ "$current_branch" = "$BRANCH" ] ||
    fail "releases are cut from $BRANCH, and this is ${current_branch:-a detached HEAD}"

# Only the manifests are committed, so a file the repository does not track is no obstacle. A
# change to one it does track is, since the commit would be released without it
if ! git diff --quiet || ! git diff --cached --quiet; then
    fail "commit or stash the changes to tracked files first"
fi

git fetch --quiet "$REMOTE" "$BRANCH"

behind="$(git rev-list --count "HEAD..$REMOTE/$BRANCH")"
[ "$behind" -eq 0 ] || fail "$BRANCH is $behind commit(s) behind $REMOTE/$BRANCH; pull first"

# Commits not yet pushed go out with the release, so they are counted to be said in the plan
ahead="$(git rev-list --count "$REMOTE/$BRANCH..HEAD")"

react_name="$(manifest_field "$REACT_MANIFEST" name)"
react_current="$(manifest_field "$REACT_MANIFEST" version)"
react_next="$(next_version "$react_current" "$react_bump")"

mcp_name="$(manifest_field "$MCP_MANIFEST" name)"
mcp_current="$(manifest_field "$MCP_MANIFEST" version)"

if [ "$mcp_bump" = "none" ]; then
    mcp_next="$mcp_current"
    message="feat: update version to $react_next for React package"
else
    mcp_next="$(next_version "$mcp_current" "$mcp_bump")"
    message="feat: update version to $mcp_next for MCP and $react_next for React packages"
fi

# The workflow holds the tag against the React package's version, with the v taken off
tag="v$react_next"

# A version is only ever published once, so a tag that already names a release, or a version the
# registry already holds, means this one was cut before
if git ls-remote --exit-code --tags "$REMOTE" "refs/tags/$tag" > /dev/null; then
    fail "$tag is already tagged on $REMOTE"
fi

if is_published "$react_name" "$react_next"; then
    fail "$react_name@$react_next is already published"
fi

if [ "$mcp_next" != "$mcp_current" ] && is_published "$mcp_name" "$mcp_next"; then
    fail "$mcp_name@$mcp_next is already published"
fi

step "The release"

# One line to a thing that will be done, its name in a column of its own so the lines read down
plan() {
    printf '  %-26s %s\n' "$1" "$2"
}

plan "$react_name" "$react_current -> $react_next"

if [ "$mcp_next" = "$mcp_current" ]; then
    plan "$mcp_name" "$mcp_current, left where it is"
else
    plan "$mcp_name" "$mcp_current -> $mcp_next"
fi

plan "Commit" "$message"
plan "Push" "$((ahead + 1)) commit(s) to $REMOTE/$BRANCH"

if [ "$publish_release" = true ]; then
    plan "Release" "$tag, published through the GitHub CLI"
else
    plan "Release" "$tag, left to be drafted by hand"
fi

if [ "$dry_run" = true ]; then
    echo
    echo "Dry run: nothing has been changed"
    exit 0
fi

# Pushing and publishing cannot be taken back, so they are agreed to before anything is changed
if [ "$assume_yes" = false ]; then
    echo
    read -r -p "Cut this release? [y/N] " answer || answer=""

    case "$answer" in
        y | Y | yes | Yes) ;;
        *) fail "nothing has been changed" ;;
    esac
fi

# The workflow runs these again, along with the end to end suites, before it publishes anything.
# Running them here first stops most releases that would fail there before a version has been
# spent on them
if [ "$run_checks" = true ]; then
    step "Linting"
    npm run lint

    step "Testing"
    npm test

    step "Building"
    npm run build
fi

step "Moving the versions"

set_version "$REACT_MANIFEST" "$react_next"

if [ "$mcp_next" != "$mcp_current" ]; then
    set_version "$MCP_MANIFEST" "$mcp_next"
fi

git add -- "$REACT_MANIFEST" "$MCP_MANIFEST"
git commit --quiet -m "$message"

step "Pushing to $REMOTE/$BRANCH"

git push --quiet "$REMOTE" "$BRANCH"

if [ "$publish_release" = true ]; then
    step "Publishing $tag"

    # The release is cut from the commit that was just pushed rather than from wherever the branch
    # happens to be by the time GitHub reads it
    gh release create "$tag" --target "$(git rev-parse HEAD)" --title "$tag" --generate-notes

    echo
    echo "Published $tag. The Continuous Integration workflow sends the packages to npm from here"
else
    echo
    echo "Pushed. Draft the release as $tag to send the packages to npm:"
    echo "  $(repository_url)/releases/new?tag=$tag&target=$BRANCH"
fi
