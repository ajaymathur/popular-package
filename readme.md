# popular-package

> Get the popularity stats of packages of repo both internally in repo and on npm for [bolt](https://github.com/boltpkg/bolt) or [lerna](https://github.com/lerna/lerna) repo

![preview](https://raw.githubusercontent.com/ajaymathur/popular-package/master/github/preview.png)

## Install

```sh
$ yarn global add popular-package
```

## Examples

View internal popularity of a package in bolt repo:

```sh
$ popular-package internal --bolt
```

View internal popularity of a packages for a lerna repo:

```sh
$ popular-package internal --lerna
```

View popularity of packages on npm for a bolt repo:

```sh
$ popular-package global --bolt
```

View popularity of packages on npm for a lerna repo:

```sh
$ popular-package global --lerna
```

## Usage

```sh
$ popular-package <command> [options]
```

- `command` - (`internal | global`) Wheather to show stats for popularity in repo or globally on npm
- `options` - [`lerna | bolt`] it is a lerna or a bolt repo

### Commands

#### `internal`

Get the stats of package with dependency in other packages within repo. If no options is passed it will look for packages in ***/packages/***

- `--lerna` - If the mono repo is using lerna, needed to pick packages config from **lerna.json**
- `--bolt`  - If the mono repo is using bolt, needed to pick bolt packages config from **package.json**

#### `global`

Get the stats of package by the number of downloads in last day on npm. If no options is passed it will look for packages in ***/packages/***

- `--lerna` - If the mono repo is using lerna, needed to pick packages config from **lerna.json**
- `--bolt`  - If the mono repo is using bolt, needed to pick bolt packages config from **package.json**
