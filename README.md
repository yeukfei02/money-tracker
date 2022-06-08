# money-tracker

a monorepo for money tracking

documentation: <https://documenter.getpostman.com/view/3827865/U16ev89t>

api url: <https://money-tracker-monorepo-api.herokuapp.com>

web: <https://money-tracker-neon.vercel.app>

## Requirement

- install yarn
- install node (v14+)

## Testing and run

```zsh
// install node dependencies
$ yarn

// link packages and install all packages dependencies
$ yarn run bootstrap

// install all packages dependencies
$ yarn run exec

// link packages
$ yarn run link

// remove all packages node_modules
$ yarn run clean

// check diff
$ yarn run diff

// list packages
$ yarn run list

// run all (api + web) in local
$ yarn run dev

// run all (api + web) production in local
$ yarn run production

// run api in local
$ yarn run dev:api

// run web in local
$ yarn run dev:web

// run api production in local
$ yarn run production:api

// run web production in local
$ yarn run production:web
```
