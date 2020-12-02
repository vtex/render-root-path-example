# Render Root Path Feature Example

Reference app for root path feature implementation. This shows how a reverse proxy should perform host and path rewriting.

## How root path support works in Render

If your main domain is served by a different platform or system and you want to scope a VTEX IO store in a fixed path prefix, you can use the Root Path feature.

For example, given a domain `mybrand.com`, if you want to serve your store under `mybrand.com/ar`, you must:

1 - Create a public domain for your account and add it to License Manager, e.g. `mybrand.com.ar`.

2 - For all requests to `mybrand.com/ar`, configure your reverse proxy to:

  2.1 - Rewrite the `Host` header to `mybrand.com.ar`.

  2.2 - Rewrite the request `path` removing the prefix. E.g. `/ar/my-product/p` becomes `/my-product/p`.
  
  2.3 - Add a `x-vtex-root-path` header to the request with the value of the removed prefix, e.g. `/ar`.

This will inform Render that all generated links in this site should be prefixed by the root path, in this case `/ar`.

## Example proxy app

This is an example app that performs the rewrites and adds the header for test purposes.
