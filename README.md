# react-image-mapper2

This repository is based on [react-image-mapper](https://github.com/coldiary/react-image-mapper). Written in Typescript and React FC with some bug fixes.

## Installation

```
$ yarn add react-image-mapper2
# or
$ npm install react-image-mapper2
```

## Usage

```JS
import { ImageMapper, ImageMapperProps } from 'react-image-mapper2';

<ImageMapper
  active
  width={500}
  src={'https://c1.staticflickr.com/5/4052/4503898393_303cfbc9fd_b.jpg'}
  map={{
    name: 'my-map',
    areas: [
      { shape: 'poly', coords: [25,33,27,300,128,240,128,94] },
      { shape: 'poly', coords: [219,118,220,210,283,210,284,119] },
      { shape: 'poly', coords: [381,241,383,94,462,53,457,282] },
      { shape: 'poly', coords: [245,285,290,285,274,239,249,238] },
    ]
  }}
/>

```

## TODO

- [ ] Update README
- [ ] Write test
