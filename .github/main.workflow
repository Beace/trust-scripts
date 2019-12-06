workflow "build and publish" {
  on = "push"
  resolves = ["build"]
}

action "build" {
  uses = "actions/npm@master"
  args = "ci"
}

workflow "publish on release" {
  on = "release"
  resolves = ["publish"]
}

action "publish" {
  uses = "actions/npm@master"
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}