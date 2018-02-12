# popular-package

> Get the popularity stats of packages of repo both internally in repo and on npm for [bolt](https://github.com/boltpkg/bolt) or [lerna](https://github.com/lerna/lerna) repo

![preview](https://raw.githubusercontent.com/ajaymathur/popular-package/master/github/preview.png)

## Install

```sh
$ yarn global add popular-package
```

## Examples

View internal popularity of a package in bolt or lerna repo:

```sh
$ popular-package internal
```

View popularity of packages on npm for a bolt or lerna repo:

```sh
$ popular-package global
```

## Usage

```sh
$ popular-package <command>
```

- `command` - (`internal | global`) Wheather to show stats for popularity in repo or globally on npm

### Commands

#### `internal`

Get the stats of package with dependency in other packages within repo. If no options is passed it will look for packages in ***/packages/***

#### `global`

Get the stats of package by the number of downloads in last day on npm. If no options is passed it will look for packages in ***/packages/***

### Packages Pattern

#### `Bolt`

It will read pattern of workspaces from bolt config in package json of the repo

#### `Lerna`

It will read pattern of packages from lerna.json in repo

---

***If neither lerna.json or bolt config in packages json is found it will defualt to pattern &rarr; `[packages/*]`***
