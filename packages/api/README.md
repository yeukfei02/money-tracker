# api

money tracker api

documentation: <https://documenter.getpostman.com/view/3827865/U16ev89t>

## Requirement

- install yarn
- install node (v14+)

## Testing and run

```zsh
// install node dependencies
$ yarn

// create controller
$ node ace make:controller <controllerName>

// create model
$ node ace make:model <modelName>

// create migration file
$ node ace make:migration <migrationName>

// db migration
$ node ace migration:run

// db rollback
$ node ace migrate:rollback

// check migration status
$ node ace migration:status

// create db seed
$ node ace make:seeder <seederName>

// run all db seed
$ node ace db:seed

// create middleware
$ node ace make:middleware <middlewareName>

// list routes
$ node ace list:routes

// lint code
$ yarn run lint

// format code
$ yarn run format
```
