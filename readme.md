# popular-package

> Get the popularity stats of packages in a mono repository either internally or on npm for [bolt](https://github.com/boltpkg/bolt) or [lerna](https://github.com/lerna/lerna).

![preview](https://raw.githubusercontent.com/ajaymathur/popular-package/master/github/preview.png)

## Install

```sh
$ yarn global add popular-package
```

## Examples

View internal popularity of a package in bolt or lerna repository:

```sh
$ popular-package internal
```

View popularity of packages on npm for a bolt or lerna repository:

```sh
$ popular-package global
```

## Usage

```sh
$ popular-package <command>
```

- `command` - (`internal | global`) Wheather to show stats for popularity in repository or globally on npm

### Commands

#### `internal`

Get the stats of package with dependency in other packages within repository.

#### `global`

Get the stats of package by the number of downloads in last day on npm.

### Packages Pattern

#### `Bolt`

It will read pattern of workspaces from bolt config in package json of the repository

#### `Lerna`

It will read pattern of packages from lerna.json in repository

---

***If neither lerna.json or bolt config in packages json is found packages pattern will default to &rarr; `[packages/*]`***
