# page widget built using

--Vue.js

```html
<html>
  <body>
    ...

    <widget>
    <widget/>

    <script src="../dist/build.js"></script>
  </body>
</html>
```

## How it works

Components are registered in `src/main.js`.

Component code is in `src/Widget.vue`.

To add a component :

- Add a `.vue` file in `src/components`
- Register the component in `src/main.js`

To test  :

- Install node modules : `npm install` (watch mode)
- Launch webpack : `npm run dev` (watch mode)
- Open `demo/index.html` in a browser
- Edit `src/main.js` or your component file
- Refresh the page

## Bundle a release

```
npm run build
```

## Features

- Can be loaded in any HTML Page
- Highly reactive
- Congigurable

## TODO
- Build backend api for the widget

