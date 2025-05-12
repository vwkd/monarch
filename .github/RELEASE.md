# Release Flow

To cut a release, follow these steps:

1. Create a release branch and update the `deno.json` version number

1. Create and land a PR

1. Pull the changes and tag the main branch:

   ```sh
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

1. Publish the tag from github UI

1. Wait for the workspace publish action to publish the new release to JSR.
